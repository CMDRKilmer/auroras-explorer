import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { columns } from '@/components/game/contract/contract-table/columns'
import { groupContractsQuery } from '@/lib/query/contract'
import { StatusMap, TypesMap } from './constants'
import { GroupContractsPageContext } from './context'

export const GroupContractsPageContextProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [usernames, setUsernames] = useState<string[]>([])
  const [type, setType] = useState<string>('All')
  const [status, setStatus] = useState<string>('All')

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  const contractsQuery = useQuery(
    groupContractsQuery({
      groupId: '873386',
      order: '-DateEpochMs',
      types: TypesMap[type],
      statuses: StatusMap[status],
      usernames: usernames.length > 0 ? usernames : undefined,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
  )

  const table = useReactTable({
    data: contractsQuery.data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: contractsQuery.data?.total || 0,
  })

  const value = useMemo(() => {
    return {
      usernames,
      setUsernames,
      type,
      setType,
      status,
      setStatus,
      contractsQuery,
      pagination,
      table,
    }
  }, [type, usernames, status, contractsQuery, table, pagination])

  return (
    <GroupContractsPageContext.Provider value={value}>
      {children}
    </GroupContractsPageContext.Provider>
  )
}
