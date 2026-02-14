import type { UserContractCondition } from '../fio'

export interface Contract {
  Conditions: UserContractCondition[]
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
  Timestamp: string // when the contract was submitted by the user
  CreatedAt: string // when the contract was created in the server database
  UpdatedAt: string // when the contract was synced to the server
  LastSubmittedBy: string
}

export interface UserInfo {
  key: string
  username: string
  companyName: string
  companyCode: string
  lastContSubmitAt: string
  lastContSyncAt: string
  lastContSyncStatus: string
}
