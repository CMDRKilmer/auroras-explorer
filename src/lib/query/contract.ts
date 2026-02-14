import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '../api'
import type { Contract } from '../api/types'

interface GroupContractsParams {
  groupId: string
  limit?: number
  offset?: number
  types?: string[]
  order?: string
}

export const groupContractsQuery = (opt: GroupContractsParams) => {
  const { groupId, ...params } = opt
  return queryOptions({
    queryKey: ['group-contracts', opt],
    queryFn: async () => {
      const res = await apiClient.get<Contract[]>(
        `/api/group/${groupId}/contracts`,
        {
          params,
        },
      )
      return res.data
    },
  })
}
