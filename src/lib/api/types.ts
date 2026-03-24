import type {
  ContractPO,
  GroupPO,
  UserContractConditionPO,
} from '@/server/store/type'
import type { BasePlanner } from '../planner/types'

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

export interface Group extends Omit<GroupPO, 'fioApiToken'> {}

export interface GroupPlan {
  id: string
  groupId: string
  planetId: string
  planId: string
  createdAt: string
  updatedAt: string
  createdBy: string
  data: BasePlanner
  buildings: string[]
  inputs: string[]
  outputs: string[]
}

export interface UserPlan {
  id: string
  username: string
  groupId: string
  planetId: string
  planId: string
  planName: string
  createdAt: string
  updatedAt: string
  createdBy: string
  buildings: string[]
  inputs: string[]
  outputs: string[]
}
