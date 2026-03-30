import {
  flexRender,
  type Row,
  type Table as TanStackTable,
} from '@tanstack/react-table'
import type { ComponentType, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface DataTableProps<T> {
  table: TanStackTable<T>
  collapsibleContent?: ComponentType<{
    row: Row<T>
  }>
  footer?: boolean
  onRowClick?: (e: MouseEvent, row: Row<T>) => void
}

export const DataTable = <T,>({
  table,
  footer,
  collapsibleContent: CustomCollapsibleContent,
  onRowClick,
}: DataTableProps<T>) => {
  const { t } = useTranslation()
  const rowModel = table.getRowModel()
  const footerGroups = table.getFooterGroups()

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rowModel.rows?.length ? (
            rowModel.rows.map(row => {
              const rowContent = (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={onRowClick ? e => onRowClick(e, row) : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )

              return CustomCollapsibleContent ? (
                <Collapsible key={row.id} asChild>
                  {/** biome-ignore lint/complexity/noUselessFragments: children accept only 1 element */}
                  <>
                    <CollapsibleTrigger asChild>
                      {rowContent}
                    </CollapsibleTrigger>
                    <CollapsibleContent asChild>
                      <CustomCollapsibleContent row={row} />
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ) : (
                rowContent
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={100} className="h-24 text-center">
                {t('dataTable.noResults')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {footer && (
          <TableFooter>
            <TableRow>
              {footerGroups.map(footerGroup =>
                footerGroup.headers.map(footer => (
                  <TableCell
                    key={footer.id}
                    colSpan={footer.colSpan}
                    style={{ width: footer.getSize() }}
                  >
                    {footer.isPlaceholder
                      ? null
                      : flexRender(
                          footer.column.columnDef.footer,
                          footer.getContext(),
                        )}
                  </TableCell>
                )),
              )}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  )
}
