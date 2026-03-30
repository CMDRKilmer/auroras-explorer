import {
  createColumnHelper,
  type ColumnDef,
  type Table,
} from '@tanstack/react-table'
import { sumBy } from 'es-toolkit'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialTile } from '@/components/game/material-tile'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency } from '@/lib/format'
import type { Acquisition } from '@/lib/trade'

const columnHelper = createColumnHelper<Acquisition>()

export const getRows = (table: Table<Acquisition>) => {
  const selectedRowModel = table.getSelectedRowModel()
  const rowModel = table.getRowModel()

  return selectedRowModel.rows.length > 0
    ? selectedRowModel.rows
    : rowModel.rows
}

export const useColumns = (props: { fromCX: string; toCX: string }) => {
  const { t } = useTranslation()

  return useMemo(
    () =>
      [
        columnHelper.display({
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={value =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label={t('shipment.table.selectAll')}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={value => row.toggleSelected(!!value)}
              aria-label={t('shipment.table.selectRow')}
            />
          ),
          footer: t('shipment.table.total'),
          enableSorting: false,
          enableHiding: false,
          size: 20,
        }),
        columnHelper.accessor('materialTicker', {
          header: t('shipment.table.material'),
          cell: row => {
            return (
              <MaterialTile ticker={row.getValue()} className="h-6 text-xs" />
            )
          },
          maxSize: 60,
        }),
        columnHelper.accessor('sellingPricePerItem', {
          id: 'ask',
          header: `${props.fromCX} ${t('shipment.table.ask')}`,
          cell: row => (
            <div className="text-right">{formatCurrency(row.getValue())}</div>
          ),
          maxSize: 60,
        }),
        columnHelper.accessor('costPerItem', {
          header: `${props.toCX} ${t('shipment.table.bid')}`,
          cell: row => (
            <div className="text-right">{formatCurrency(row.getValue())}</div>
          ),
          maxSize: 60,
        }),
        columnHelper.accessor(
          row => row.costPerItem - row.sellingPricePerItem,
          {
            id: 'spread',
            header: t('shipment.table.spread'),
            cell: row => {
              return (
                <div className="flex items-center gap-1 justify-between">
                  {formatCurrency(row.getValue())}
                  <span className="text-sm text-muted-foreground">
                    {(
                      (row.getValue() / row.row.original.costPerItem) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              )
            },
            maxSize: 80,
          },
        ),
        columnHelper.accessor('count', {
          header: t('shipment.table.amount'),
          meta: { align: 'right' },
          cell: row => (
            <div className="text-right">{row.getValue().toLocaleString()}</div>
          ),
          footer: ({ table }) => {
            return (
              <div className="text-right">
                {sumBy(
                  getRows(table),
                  row => row.original.count,
                ).toLocaleString()}
              </div>
            )
          },
          maxSize: 80,
        }),
        columnHelper.accessor('profit', {
          header: t('shipment.table.profit'),
          cell: row => (
            <div className="text-right">{formatCurrency(row.getValue())}</div>
          ),
          footer: ({ table }) => {
            return (
              <div className="text-right">
                {formatCurrency(
                  sumBy(getRows(table), row => row.original.profit),
                )}
              </div>
            )
          },
          maxSize: 80,
        }),
        columnHelper.accessor('totalSellingPrice', {
          header: t('shipment.table.cost'),
          cell: row => (
            <div className="text-right">{formatCurrency(row.getValue())}</div>
          ),
          footer: ({ table }) => {
            return (
              <div className="text-right">
                {formatCurrency(
                  sumBy(getRows(table), row => row.original.totalSellingPrice),
                )}
              </div>
            )
          },
          maxSize: 80,
        }),
        columnHelper.accessor(
          row => ({ weight: row.totalWeight, volume: row.totalVolume }),
          {
            id: 'vol',
            header: t('shipment.table.weightVolume'),
            cell: row => {
              const { weight, volume } = row.getValue()
              return (
                <div className="flex gap-4 text-right">
                  <div className="min-w-14">{weight.toFixed(2)}t</div>
                  <div className="min-w-14">{volume.toFixed(2)}m³</div>
                </div>
              )
            },
            footer: ({ table }) => {
              const totalWeight = sumBy(
                getRows(table),
                row => row.original.totalWeight,
              )
              const totalVolume = sumBy(
                getRows(table),
                row => row.original.totalVolume,
              )
              return (
                <div className="flex gap-4 text-right">
                  <div className="min-w-14">{totalWeight.toFixed(2)}t</div>
                  <div className="min-w-14">{totalVolume.toFixed(2)}m³</div>
                </div>
              )
            },
          },
        ),
      ] as ColumnDef<Acquisition>[],
    [t, props.fromCX, props.toCX],
  )
}
