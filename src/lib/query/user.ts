import { queryOptions, useQuery } from '@tanstack/react-query'
import { useLocalStorage } from '@/hooks/use-storage'
import { apiClient } from '../api'

export const identityQuery = () => {
  return queryOptions({
    queryKey: ['identity'],
    queryFn: async () => {
      const res = await apiClient.get<{
        username: string
      }>('/api/identity')
      return res.data
    },
  })
}

export const useIdentity = () => {
  const token = useLocalStorage('token')
  return useQuery({
    ...identityQuery(),
    enabled: !!token,
  })
}
