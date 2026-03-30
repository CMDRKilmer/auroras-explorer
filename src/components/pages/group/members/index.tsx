import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DataTable } from '@/components/common/data-table'
import { LoadingPage } from '@/components/common/loading'
import { groupUsersQuery } from '@/lib/query/group'
import { columns } from './user-table/columns'

const routeApi = getRouteApi('/group/{-$groupId}/members/')

export const GroupMembersPage = () => {
  const { t } = useTranslation()
  const { groupId = '' } = routeApi.useParams()
  const { data: users } = useQuery(groupUsersQuery(groupId))

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!users) return <LoadingPage />

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('group.members.title')}</h1>
      <div className="mt-4 flex flex-col">
        <DataTable table={table} />
      </div>
    </div>
  )
}
