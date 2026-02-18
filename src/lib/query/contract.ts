import { queryOptions } from '@tanstack/react-query'
import type { Pagination } from '@/server/common/paging'
import { apiClient } from '../api'
import type { Contract } from '../api/types'

interface GroupContractsParams {
  groupId: string
  page?: number
  pageSize?: number
  types?: string[]
  order?: string
  usernames?: string[]
  statuses?: string[]
  tags?: string[]
}

export const groupContractsQuery = (opt: GroupContractsParams) => {
  const { groupId, usernames, types, statuses, pageSize, ...params } = opt
  return queryOptions({
    queryKey: ['group-contracts', opt],
    queryFn: async () => {
      const res = await apiClient.get<Pagination<Contract>>(
        `/api/group/${groupId}/contracts`,
        {
          params: {
            ...params,
            types: types?.join(','),
            statuses: statuses?.join(','),
            usernames: usernames?.map(i => i.toUpperCase()).join(','),
            page_size: pageSize,
          },
        },
      )
      return res.data
    },
    enabled: !!groupId,
  })
}
