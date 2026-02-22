import type { UseQueryResult } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { createContext, useContext } from 'react'
import type { DateRange } from 'react-day-picker'
import type { Contract } from '@/lib/api'
import type { Pagination } from '@/server/common/paging'

export const GroupContractsPageContext = createContext<{
  groupId: string
  usernames: string[]
  setUsernames: (usernames: string[]) => void
  type: string
  setType: (type: string) => void
  status: string
  setStatus: (status: string) => void
  tags: string[]
  setTags: (tags: string[]) => void
  date?: DateRange
  setDate: (date: DateRange | undefined) => void
  contractsQuery: UseQueryResult<Pagination<Contract>, Error>
  pagination: {
    pageIndex: number
    pageSize: number
  }
  table: Table<Contract>
}>({
  groupId: '',
  usernames: [],
  setUsernames: () => {},
  type: 'All',
  setType: () => {},
  status: 'All',
  setStatus: () => {},
  tags: [],
  setTags: () => {},
  setDate: () => {},
  contractsQuery: {} as UseQueryResult<Pagination<Contract>, Error>,
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  table: {} as Table<Contract>,
})

export const useGroupContractsPageContext = () => {
  return useContext(GroupContractsPageContext)
}
