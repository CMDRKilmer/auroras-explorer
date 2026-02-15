import type { ContractPO } from '@/server/store/type'
import type { UserContractCondition } from '../fio'

export interface Contract extends ContractPO {
  Conditions: UserContractCondition[]
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
