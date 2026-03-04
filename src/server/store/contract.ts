import { chunk, compact, keyBy, uniq } from 'es-toolkit'
import type { Knex } from 'knex'
import type { Contract } from '@/lib/api/types'
import type { UserContract, UserContractCondition } from '@/lib/fio'
import { dayjs } from '@/lib/format'
import { db } from '../common/db'
import { logger } from '../common/logger'
import { handleOrderBy, type Pagination } from '../common/paging'
import { matchAndUpdateContractTags } from '../services/contract/match-contract'
import type { PriceService } from '../services/price'
import { getCompanyByUsernames, getCompanyWithCache } from './company'
import type { ContractPO, UserContractConditionPO } from './type'

export interface BulkSaveContractResult {
  savedContractsCount: number
  savedConditionsCount: number
  normalizedAndSavedContractsCount: number
}

export const bulkSaveUserContracts = async (
  priceService: PriceService,
  contracts: UserContract[],
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contractsToSave = contracts.map(({ Conditions, ...contract }) => {
    return {
      ...contract,
      UpdatedAt: new Date(),
    }
  })
  const conditionsToSave = contracts.flatMap(
    ({ Conditions, ContractId, UserNameSubmitted }) => {
      return Conditions.map(condition => {
        return {
          ...condition,
          Dependencies: condition.Dependencies.map(d => d.Dependency),
          ContractId,
          UserNameSubmitted,
          UpdatedAt: new Date(),
        }
      })
    },
  )
  const result: BulkSaveContractResult = {
    savedContractsCount: contractsToSave.length,
    savedConditionsCount: conditionsToSave.length,
    normalizedAndSavedContractsCount: 0,
  }
  for (const chunkedContracts of chunk(contractsToSave, 50)) {
    await db('fio_user_contracts')
      .insert(chunkedContracts)
      .onConflict(['ContractId', 'UserNameSubmitted'])
      .merge()
  }

  for (const chunkedConditions of chunk(conditionsToSave, 50)) {
    await db('fio_user_contract_conditions')
      .insert(chunkedConditions)
      .onConflict(['ConditionId', 'UserNameSubmitted'])
      .merge()
  }

  const allNewContractIds: string[] = []
  for (const chunkedContracts of chunk(contracts, 50)) {
    const { mergedCount, newContractIds } =
      await mergeAndSaveContracts(chunkedContracts)
    result.normalizedAndSavedContractsCount = mergedCount
    allNewContractIds.push(...newContractIds)
  }

  for (const contractId of allNewContractIds) {
    await matchAndUpdateContractTags(priceService, contractId)
  }

  return result
}

export interface ListContractsOptions {
  submitters?: string[]
  limit: number
  offset: number
  order?: string
  types?: string[]
  statuses?: string[]
  participants?: string[]
  /**
   * if true, will only return contracts that are explicitly participated by the
   * two participants, which means the contract must have one participant as
   * provider and the other as customer. If false, will return contracts that
   * have at least one of the participants, regardless of their role in the
   * contract. Default is false.
   */
  explicit?: boolean
  tags?: string[]
  time?: {
    from?: number
    to?: number
  }
}

const getConditionsForContract = async (
  keys: { ContractId: string; UserNameSubmitted: string }[],
): Promise<UserContractConditionPO[]> => {
  const bindings = keys.flatMap(({ ContractId, UserNameSubmitted }) => {
    return [ContractId, UserNameSubmitted]
  })

  const placeholders = keys.map(() => '(?, ?)').join(', ')

  const conditions = await db('fio_user_contract_conditions AS c')
    .select('c.*')
    .innerJoin(
      db.raw(`(VALUES ${placeholders}) AS k (cid, u)`, bindings),
      function () {
        this.on('c.ContractId', '=', 'k.cid').andOn(
          'c.UserNameSubmitted',
          '=',
          'k.u',
        )
      },
    )

  return conditions
}

const formatContract = (
  contract: ContractPO,
  conditions: UserContractConditionPO[],
) => {
  return {
    ...contract,
    DateEpochMs: Number(contract.DateEpochMs),
    DueDateEpochMs: contract.DueDateEpochMs
      ? Number(contract.DueDateEpochMs)
      : null,
    Conditions: conditions
      .filter(c => c.ContractId === contract.ContractId)
      .map(c => {
        return {
          ...c,
          DeadlineDurationMs: c.DeadlineDurationMs
            ? Number(c.DeadlineDurationMs)
            : null,
          DeadlineEpochMs: c.DeadlineEpochMs ? Number(c.DeadlineEpochMs) : null,
        }
      })
      .toSorted((a, b) => a.ConditionIndex - b.ConditionIndex),
  }
}

const filterListContractOptions = (
  query: Knex.QueryBuilder,
  {
    submitters,
    types,
    participants,
    statuses,
    explicit = false,
    tags,
    time,
  }: ListContractsOptions,
) => {
  if (submitters && submitters.length > 0) {
    query.whereIn('UserNameSubmitted', submitters)
  }
  if (types && types.length > 0) {
    query.whereIn('Type', types)
  }
  if (statuses && statuses.length > 0) {
    query.whereIn('Status', statuses)
  }
  if (tags && tags.length > 0) {
    query.whereRaw(`"Tags" @> ?::text[]`, [`{${tags.join(',')}}`])
  }
  if (time) {
    if (time.from) {
      query.where('DateEpochMs', '>=', time.from)
    }
    if (time.to) {
      query.where('DateEpochMs', '<=', time.to)
    }
  }
  if (participants && participants.length > 0) {
    if (explicit) {
      for (const participant of participants) {
        query.where(function () {
          this.where('CustomerUsername', participant).orWhere(
            'ProviderUsername',
            participant,
          )
        })
      }
    } else {
      query.where(function () {
        for (const participant of participants) {
          this.orWhere('CustomerUsername', participant).orWhere(
            'ProviderUsername',
            participant,
          )
        }
      })
    }
  }
}

// export const listUserContracts = async (opts: ListContractsOptions) => {
// const query = db('fio_user_contracts').select('*')
// filterListContractOptions(query, opts)
// const contracts = await query
// const conditions = await getConditionsForContract(contracts)
// return contracts.map(contract => {
//   return formatContract(contract, conditions)
// })
// }

const listContractsItems = async (
  query: Knex.QueryBuilder,
  opts: ListContractsOptions,
) => {
  handleOrderBy(query, opts.order ?? '-DateEpochMs', [
    'DateEpochMs',
    'DueDateEpochMs',
    'CreatedAt',
    'UpdatedAt',
  ])

  query.limit(opts.limit).offset(opts.offset)

  const contracts: ContractPO[] = await query.select('*')

  if (contracts.length === 0) {
    return []
  }

  const conditions = await getConditionsForContract(
    contracts.map(c => {
      return {
        ContractId: c.ContractId,
        UserNameSubmitted: c.LastSubmittedBy,
      }
    }),
  )

  const companies = await getCompanyByUsernames(
    uniq(contracts.flatMap(c => [c.CustomerUsername, c.ProviderUsername])),
  )

  const companyByUsername = keyBy(companies, c => c.UserName.toUpperCase())

  const items = contracts.map(contract => {
    const r = formatContract(contract, conditions) as unknown as Contract
    const customerCompany =
      companyByUsername[contract.CustomerUsername.toUpperCase()]
    const providerCompany =
      companyByUsername[contract.ProviderUsername.toUpperCase()]
    return {
      ...r,
      CustomerUsername: customerCompany?.UserName ?? contract.CustomerUsername,
      ProviderUsername: providerCompany?.UserName ?? contract.ProviderUsername,
      CustomerCompanyName: customerCompany?.CompanyName,
      ProviderCompanyName: providerCompany?.CompanyName,
      CustomerCompanyCode: customerCompany?.CompanyCode,
      ProviderCompanyCode: providerCompany?.CompanyCode,
    }
  })

  return items
}

const listContractsTotal = async (query: Knex.QueryBuilder) => {
  const [{ total }] = await query.clone().count('* as total')
  return Number(total)
}

export const listContracts = async (
  opts: ListContractsOptions,
): Promise<Pagination<Contract>> => {
  const query = db('contracts')

  filterListContractOptions(query, opts)

  // const sql = query.toSQL().toNative()
  // console.log(sql.sql)
  // console.log(sql.bindings)

  const [items, total] = await Promise.all([
    listContractsItems(query.clone(), opts),
    listContractsTotal(query.clone()),
  ])

  return {
    items,
    total,
  }
}

export const getContractType = (conditions: UserContractCondition[]) => {
  const conditionTypes = new Set(
    Object.keys(Object.groupBy(conditions, c => c.Type)),
  )
  if (conditionTypes.has('COMEX_PURCHASE_PICKUP')) {
    return 'SELLING'
  }

  if (
    conditionTypes.has('PAYMENT') &&
    conditionTypes.has('DELIVERY') &&
    conditionTypes.size === 2
  ) {
    return 'BUYING'
  }

  if (conditionTypes.has('PROVISION_SHIPMENT')) {
    return 'SHIPMENT'
  }

  if (conditionTypes.has('LOAN_PAYOUT')) {
    return 'LOAN'
  }

  return 'OTHER'
}

type ToInsertedContract = Omit<
  ContractPO,
  'Conditions' | 'CreatedAt' | 'UpdatedAt' | 'Tags'
>

const CxCompanyCodes = ['AI1', 'CI1', 'CI2', 'IC1', 'NC1', 'NC2']
const CountryCodes = ['AI', 'CI', 'IC', 'NC']

const normalizeContract = async ({
  ContractId,
  ContractLocalId,
  DateEpochMs,
  ExtensionDeadlineEpochMs,
  DueDateEpochMs,
  CanExtend,
  CanRequestTermination,
  TerminationSent,
  TerminationReceived,
  Name,
  Preamble,
  Party,
  Status,
  PartnerCompanyCode,
  UserNameSubmitted,
  Timestamp,
  Conditions,
}: UserContract): Promise<ToInsertedContract | undefined> => {
  if (
    !PartnerCompanyCode ||
    CxCompanyCodes.includes(PartnerCompanyCode) ||
    CountryCodes.includes(PartnerCompanyCode)
  ) {
    // ignore country contracts
    return
  }
  const partnerCompany = await getCompanyWithCache({
    code: PartnerCompanyCode,
  })

  if (!partnerCompany) {
    logger.warn(`Partner company not found for code: ${PartnerCompanyCode}`)
    return
  }

  const partnerUsername = partnerCompany.UserName.toUpperCase()

  return {
    ContractId,
    ContractLocalId,
    DateEpochMs,
    ExtensionDeadlineEpochMs,
    DueDateEpochMs,
    CanExtend,
    CanRequestTermination,
    TerminationSent,
    TerminationReceived,
    Name,
    Preamble,
    Status,

    CustomerUsername:
      Party === 'CUSTOMER' ? UserNameSubmitted : partnerUsername,
    ProviderUsername:
      Party === 'PROVIDER' ? UserNameSubmitted : partnerUsername,
    Type: getContractType(Conditions),
    Timestamp,
    LastSubmittedBy: UserNameSubmitted,
  }
}

export interface MergeAndSaveContractsResult {
  mergedCount: number
  newContractIds: string[]
}

export const normalizeContractId = (contractId: string) =>
  contractId.includes('-') ? contractId.split('-')[0] : contractId

export const mergeAndSaveContracts = async (contracts: UserContract[]) => {
  const contractIds = contracts.map(c => normalizeContractId(c.ContractId))
  const normalizedContracts = await Promise.all(
    contracts.map(normalizeContract),
  )
  const validNormalizedContracts = compact(normalizedContracts)

  const result: MergeAndSaveContractsResult = {
    mergedCount: 0,
    newContractIds: [],
  }

  return await db.transaction(async trx => {
    const toInsert: ToInsertedContract[] = []
    const existingContracts = await trx('contracts')
      .select('*')
      .whereIn('ContractId', contractIds)

    const existingContractsById = keyBy(existingContracts, c => c.ContractId)

    for (const contract of validNormalizedContracts) {
      const id = normalizeContractId(contract.ContractId)
      const existingContract = existingContractsById[id]
      if (!existingContract) {
        result.newContractIds.push(id)
      }
      if (
        !existingContract ||
        !dayjs(existingContract.LastSubmittedBy).isAfter(
          dayjs(contract.LastSubmittedBy),
        )
      ) {
        toInsert.push(contract)
        result.mergedCount += 1
      }
    }

    if (toInsert.length === 0) {
      return result
    }

    await trx('contracts')
      .insert(
        toInsert.map(i => {
          return {
            ...i,
            ContractId: normalizeContractId(i.ContractId),
            UpdatedAt: new Date(),
          }
        }),
      )
      .onConflict('ContractId')
      .merge()

    return result
  })
}
