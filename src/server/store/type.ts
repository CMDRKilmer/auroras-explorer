import type { Company, UserContract, UserContractCondition } from '@/lib/fio'

export type UserContractPO = UserContract & {
  UpdatedAt: Date
  CreatedAt: Date
}

export type UserContractConditionPO = Omit<
  UserContractCondition,
  'Dependencies'
> & {
  ContractId: string
  UserNameSubmitted: string
  Dependencies: string[]
}

export type ContractPO = Omit<
  UserContractPO,
  | 'Conditions'
  | 'Party'
  | 'PartnerId'
  | 'PartnerName'
  | 'PartnerCompanyCode'
  | 'UserNameSubmitted'
> & {
  ContractId: string
  ContractLocalId: string
  DateEpochMs: number
  ExtensionDeadlineEpochMs: number | null
  DueDateEpochMs: number | null
  CanExtend: boolean
  CanRequestTermination: boolean
  TerminationSent: boolean
  TerminationReceived: boolean
  Name: string
  Preamble: string
  Status: string

  CustomerUsername: string
  ProviderUsername: string

  Type: string
  Tags: string[]
  Timestamp: string // when the contract was submitted by the user
  CreatedAt: string // when the contract was created in the server database
  UpdatedAt: string // when the contract was synced to the server
  LastSubmittedBy: string
}

export type CompanyPO = Company & {
  UsernameUpper: string
}
