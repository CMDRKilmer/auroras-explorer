import { createColumnHelper } from '@tanstack/react-table'
import type { Contract } from '@/lib/api/types'
import MdiArrowLeftRight from '~icons/mdi/arrow-left-right'
import { ContractStatus, DueDateBadge } from '../compoents'

const columnHelper = createColumnHelper<Contract>()

export const columns = [
  columnHelper.display({
    id: 'id',
    header: 'ID',
    cell: row => {
      const contract = row.row.original
      return (
        <span className="font-mono text-gray-500 tracking-wider mr-2 no-underline">
          {contract.ContractLocalId}
        </span>
      )
    },
  }),
  columnHelper.accessor('Status', {
    header: 'Status',
    cell: row => {
      const contract = row.row.original
      return <ContractStatus contract={contract} />
    },
  }),

  columnHelper.display({
    id: 'partner',
    header: 'Partner',
    cell: row => {
      const contract = row.row.original
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-semibold">{contract.ProviderUsername}</span>
          <MdiArrowLeftRight />
          <span className="font-semibold">{contract.CustomerUsername}</span>
        </div>
      )
    },
  }),

  columnHelper.accessor('DateEpochMs', {
    header: 'Created At',
    cell: row => {
      const date = new Date(row.getValue())
      return (
        <span className="text-sm text-gray-500">{date.toLocaleString()}</span>
      )
    },
  }),

  columnHelper.accessor('DueDateEpochMs', {
    header: 'Due Date',
    cell: row => {
      return <DueDateBadge dueDateMs={row.getValue()} />
    },
  }),
]
