import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DataTable } from '@/components/common/data-table'
import { LoadingPage } from '@/components/common/loading'
import { groupUsersQuery } from '@/lib/query/group'
import { columns } from './user-table/columns'

export const GroupMembersPage = () => {
  const { data: users } = useQuery(groupUsersQuery('873386'))

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (!users) return <LoadingPage />

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Group Members</h1>
      <div className="mt-4 flex flex-col">
        <DataTable table={table} />
      </div>
    </div>
  )
}
