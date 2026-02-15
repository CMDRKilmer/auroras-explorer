import type { UseQueryResult } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { createContext, useContext } from 'react'
import type { Contract } from '@/lib/api'
import type { Pagination } from '@/server/common/paging'

export const GroupContractsPageContext = createContext<{
  usernames: string[]
  setUsernames: (usernames: string[]) => void
  type: string
  setType: (type: string) => void
  status: string
  setStatus: (status: string) => void
  contractsQuery: UseQueryResult<Pagination<Contract>, Error>
  pagination: {
    pageIndex: number
    pageSize: number
  }
  table: Table<Contract>
}>({
  usernames: [],
  setUsernames: () => {},
  type: 'All',
  setType: () => {},
  status: 'All',
  setStatus: () => {},
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
