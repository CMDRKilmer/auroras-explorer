import { chunk } from 'es-toolkit'
import type { UserContract } from '@/lib/fio'
import { parseOrderBy } from '@/lib/order'
import { knex } from '../common/db'

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
  for (const chunkedContracts of chunk(contractsToSave, 50)) {
    await knex('fio_user_contracts')
      .insert(chunkedContracts)
      .onConflict(['ContractId', 'UserNameSubmitted'])
      .merge()

    console.log(`Saved ${chunkedContracts.length} contracts`)
  }

  for (const chunkedConditions of chunk(conditionsToSave, 50)) {
    await knex('fio_user_contract_conditions')
      .insert(chunkedConditions)
      .onConflict(['ConditionId', 'UserNameSubmitted'])
      .merge()

    console.log(`Saved ${chunkedConditions.length} contract conditions`)
  }
}

interface ListContractsOptions {
  usernames: string[]
  limit?: number
  offset?: number
  order?: string
}

const getConditionsForContract = async (
  keys: { ContractId: string; UserNameSubmitted: string }[],
) => {
  const bindings = keys.flatMap(({ ContractId, UserNameSubmitted }) => {
    return [ContractId, UserNameSubmitted]
  })

  const placeholders = keys.map(() => '(?, ?)').join(', ')

  const conditions = await knex('fio_user_contract_conditions AS c')
    .select('c.*')
    .innerJoin(
      knex.raw(`(VALUES ${placeholders}) AS k (cid, u)`, bindings),
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

export const listContracts = async ({
  usernames,
  limit = 50,
  offset = 0,
  order = '-DateEpochMs',
}: ListContractsOptions) => {
  const query = knex('fio_user_contracts').select('*')

  if (usernames.length > 0) {
    query.whereIn('UserNameSubmitted', usernames)
  }
  for (const { field, direction } of parseOrderBy(order, [
    'DateEpochMs',
    'ContractId',
  ])) {
    query.orderBy(field, direction)
  }
  query.limit(limit).offset(offset)

  const contracts = await query

  const conditions = await getConditionsForContract(contracts)

  for (const contract of contracts) {
    contract.Conditions = conditions
      .filter(
        c =>
          c.ContractId === contract.ContractId &&
          c.UserNameSubmitted === contract.UserNameSubmitted,
      )
      .toSorted((a, b) => a.ConditionIndex - b.ConditionIndex)
  }

  return contracts
}
