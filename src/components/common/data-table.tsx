import { flexRender, type Table as TanStackTable } from '@tanstack/react-table'
import type { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const DataTable: FC<{
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // biome-ignore lint/suspicious/noExplicitAny: This component is a generic table and we want to allow any type of data.
  table: TanStackTable<any>
  /* eslint-enable @typescript-eslint/no-explicit-any */
  footer?: boolean
}> = ({ table, footer }) => {
  const rowModel = table.getRowModel()
  const footerGroups = table.getFooterGroups()
  console.log('footerGroups', footerGroups)

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
            rowModel.rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center">No results.</TableCell>
            </TableRow>
          )}
        </TableBody>

        {footer && (
          <TableFooter>
            <TableRow>
              {table.getFooterGroups().map(footerGroup =>
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
