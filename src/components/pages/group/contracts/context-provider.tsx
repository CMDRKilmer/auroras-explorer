import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { columns } from '@/components/game/contract/contract-table/columns'
import { groupContractsQuery } from '@/lib/query/contract'
import { StatusMap, TypesMap } from './constants'
import { GroupContractsPageContext } from './context'

const routeApi = getRouteApi('/group/{-$groupId}/contracts/')

export const GroupContractsPageContextProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { groupId = '' } = routeApi.useParams()
  const [usernames, setUsernames] = useState<string[]>([])
  const [type, setType] = useState<string>('All')
  const [status, setStatus] = useState<string>('All')

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  const contractsQuery = useQuery(
    groupContractsQuery({
      groupId,
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
    getRowId: row => row.ContractId,
    state: {
      pagination,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: contractsQuery.data?.total || 0,
  })

  const value = useMemo(() => {
    return {
      groupId,
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
  }, [groupId, type, usernames, status, contractsQuery, table, pagination])

  return (
    <GroupContractsPageContext.Provider value={value}>
      {children}
    </GroupContractsPageContext.Provider>
  )
}
