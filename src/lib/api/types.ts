import type { ContractPO, UserContractConditionPO } from '@/server/store/type'

export interface Contract extends ContractPO {
  Conditions: UserContractConditionPO[]
  CustomerCompanyName: string
  ProviderCompanyName: string
  CustomerCompanyCode: string
  ProviderCompanyCode: string
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
