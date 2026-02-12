import { chunk } from 'es-toolkit'
import type { UserContract } from '@/lib/fio'
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
