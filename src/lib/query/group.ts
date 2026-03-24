import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '../api'
import type { Group, UserInfo, UserPlan } from '../api/types'

export const myGroupsQuery = () => {
  return queryOptions({
    queryKey: ['my-groups'],
    queryFn: async () => {
      const res = await apiClient.get<Group[]>('/api/my/groups')
      return res.data
    },
  })
}

export const groupUsersQuery = (groupId: string) => {
  return queryOptions({
    queryKey: ['group-users', groupId],
    queryFn: async () => {
      const res = await apiClient.get<UserInfo[]>(`/api/group/${groupId}/users`)
      return res.data
    },
    enabled: !!groupId,
  })
}

export const groupPlansQuery = (groupId: string) => {
  return queryOptions({
    queryKey: ['group-plans', groupId],
    queryFn: async () => {
      const res = await apiClient.get<UserPlan[]>(`/api/group/${groupId}/plans`)
      return res.data
    },
    enabled: !!groupId,
  })
}
