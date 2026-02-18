import { createColumnHelper } from '@tanstack/react-table'
import type { Contract } from '@/lib/api/types'
import MdiArrowLeftRight from '~icons/mdi/arrow-left-right'
import {
  ContractItems,
  ContractLocation,
  ContractStatus,
  ContractType,
  DueDateBadge,
} from '../components'

const columnHelper = createColumnHelper<Contract>()

export const columns = [
  columnHelper.display({
    id: 'Id',
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

  columnHelper.accessor('Type', {
    id: 'Type',
    header: 'Type',
    cell: row => {
      return <ContractType type={row.getValue()} />
    },
  }),

  columnHelper.display({
    id: 'Items',
    header: 'Items',
    cell: row => {
      return <ContractItems contract={row.row.original} max={4} />
    },
    minSize: 250,
  }),

  columnHelper.display({
    id: 'Location',
    header: 'Location',
    cell: row => {
      return <ContractLocation contract={row.row.original} />
    },
  }),

  columnHelper.accessor('Status', {
    id: 'Status',
    header: 'Status',
    cell: row => {
      const contract = row.row.original
      return <ContractStatus contract={contract} />
    },
  }),

  columnHelper.display({
    id: 'Partner',
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

  columnHelper.display({
    id: 'Tags',
  }),

  columnHelper.accessor('DateEpochMs', {
    id: 'Created At',
    header: 'Created At',
    cell: row => {
      const date = new Date(row.getValue())
      return (
        <span className="text-sm text-gray-500">{date.toLocaleString()}</span>
      )
    },
  }),

  columnHelper.accessor('DueDateEpochMs', {
    id: 'Due Date',
    header: 'Due Date',
    cell: row => {
      return <DueDateBadge dueDateMs={row.getValue()} />
    },
  }),
]
