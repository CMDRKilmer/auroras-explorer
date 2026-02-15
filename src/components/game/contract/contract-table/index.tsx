import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { FC } from 'react'
import { isHotkeyPressed } from 'react-hotkeys-hook'
import { DataTable } from '@/components/common/data-table'
import type { Contract } from '@/lib/api/types'
import { ContractDetail } from '../contract-detail'
import { columns } from './columns'

export const ContractTable: FC<{ contracts: Contract[] }> = ({ contracts }) => {
  const table = useReactTable({
    data: contracts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTable
      table={table}
      collapsibleContent={ContractDetail}
      onRowClick={(e, row) => {
        if (isHotkeyPressed('backquote')) {
          e.preventDefault()
          console.log(row.original)
        }
      }}
    />
  )
}
