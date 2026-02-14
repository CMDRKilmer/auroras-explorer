import type { UserContract, UserContractCondition } from '@/lib/fio'

export type UserContractPO = UserContract & {
  UpdatedAt: Date
  CreatedAt: Date
}

export type UserContractConditionPO = UserContractCondition & {
  ContractId: string
  UserNameSubmitted: string
}
