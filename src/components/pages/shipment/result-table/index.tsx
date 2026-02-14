import type { FC } from 'react'
import { DataTable } from '@/components/common/data-table'
import { useShipmentContext } from '../context'

export const ShipmentResultTable: FC = () => {
  const { table } = useShipmentContext()

  return <DataTable table={table} footer />
}
