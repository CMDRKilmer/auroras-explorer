import { chunk, compact, keyBy } from 'es-toolkit'
import type { Knex } from 'knex'
import type { Contract } from '@/lib/api/types'
import type { UserContract, UserContractCondition } from '@/lib/fio'
import { dayjs } from '@/lib/format'
import { parseOrderBy } from '@/lib/order'
import { db } from '../common/db'
import { logger } from '../common/logger'
import { getCompanyByCodeWithCache } from './company'
import type { UserContractConditionPO, UserContractPO } from './type'

export interface BulkSaveContractResult {
  savedContractsCount: number
  savedConditionsCount: number
  normalizedAndSavedContractsCount: number
}

export const bulkSaveUserContracts = async (contracts: UserContract[]) => {
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

  for (const chunkedContracts of chunk(contracts, 50)) {
    result.normalizedAndSavedContractsCount =
      await mergeAndSaveContracts(chunkedContracts)
  }

  return result
}

export interface ListContractsOptions {
  submitters?: string[]
  limit?: number
  offset?: number
  order?: string
  types?: string[]
  participants?: string[]
}

const getConditionsForContract = async (
  keys: { ContractId: string; UserNameSubmitted: string }[],
) => {
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
  contract: UserContractPO,
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

const handleListContractOptions = (
  query: Knex.QueryBuilder,
  {
    submitters,
    limit = 50,
    offset = 0,
    order = '-DateEpochMs',
    types,
    participants,
  }: ListContractsOptions,
) => {
  if (submitters && submitters.length > 0) {
    query.whereIn('UserNameSubmitted', submitters)
  }
  if (types && types.length > 0) {
    query.whereIn('Type', types)
  }
  if (participants && participants.length > 0) {
    query.where(function () {
      for (const participant of participants) {
        this.orWhere('CustomerUsername', participant).orWhere(
          'ProviderUsername',
          participant,
        )
      }
    })
  }
  for (const { field, direction } of parseOrderBy(order, [
    'DateEpochMs',
    'ContractId',
  ])) {
    query.orderBy(field, direction)
  }
  query.limit(limit).offset(offset)
}

export const listUserContracts = async (opts: ListContractsOptions) => {
  const query = db('fio_user_contracts').select('*')

  handleListContractOptions(query, opts)

  const contracts = await query

  const conditions = await getConditionsForContract(contracts)

  return contracts.map(contract => {
    return formatContract(contract, conditions)
  })
}

export const listContracts = async (opts: ListContractsOptions) => {
  const query = db('contracts').select('*')

  handleListContractOptions(query, opts)

  const contracts = await query

  const conditions = await getConditionsForContract(
    contracts.map(c => {
      return {
        ContractId: c.ContractId,
        UserNameSubmitted: c.LastSubmittedBy,
      }
    }),
  )

  return contracts.map(contract => {
    return formatContract(contract, conditions)
  })
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
  Contract,
  'Conditions' | 'CreatedAt' | 'UpdatedAt'
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
  const partnerCompany = await getCompanyByCodeWithCache(PartnerCompanyCode)

  if (!partnerCompany) {
    logger.warn(`Partner company not found for code: ${PartnerCompanyCode}`)
    return
  }

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
      Party === 'CUSTOMER' ? UserNameSubmitted : partnerCompany.UserName,
    ProviderUsername:
      Party === 'PROVIDER' ? UserNameSubmitted : partnerCompany.UserName,
    Type: getContractType(Conditions),
    Timestamp,
    LastSubmittedBy: UserNameSubmitted,
  }
}

export const mergeAndSaveContracts = async (contracts: UserContract[]) => {
  const contractIds = contracts.map(c => c.ContractId)
  const normalizedContracts = await Promise.all(
    contracts.map(normalizeContract),
  )
  const validNormalizedContracts = compact(normalizedContracts)
  return await db.transaction(async trx => {
    const toInsert: ToInsertedContract[] = []
    const existingContracts = await trx('contracts')
      .select('*')
      .whereIn('ContractId', contractIds)

    const existingContractsById = keyBy(existingContracts, c => c.ContractId)

    for (const contract of validNormalizedContracts) {
      const existingContract = existingContractsById[contract.ContractId]
      if (
        !existingContract ||
        dayjs(existingContract.LastSubmittedBy).isBefore(
          dayjs(contract.LastSubmittedBy),
        )
      ) {
        toInsert.push(contract)
      }
    }

    if (toInsert.length === 0) {
      return 0
    }

    await trx('contracts')
      .insert(
        toInsert.map(i => {
          return {
            ...i,
            UpdatedAt: new Date(),
          }
        }),
      )
      .onConflict('ContractId')
      .merge()

    return toInsert.length
  })
}
