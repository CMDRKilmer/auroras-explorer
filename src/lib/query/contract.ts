import { queryOptions } from '@tanstack/react-query'
import type { ListContractsOptions } from '@/server/store/contract'
import { apiClient } from '../api'
import type { UserContract } from '../fio'

export const userContractsQuery = (params: ListContractsOptions) =>
  queryOptions({
    queryKey: ['user-contracts', params],
    queryFn: async () => {
      const res = await apiClient.get<UserContract[]>('/api/contracts', {
        params: {
          ...params,
          usernames: params.usernames.join(','),
        },
      })
      return res.data
    },
    enabled: params.usernames.length > 0,
  })
