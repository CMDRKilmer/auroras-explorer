import type { Table } from '@tanstack/react-table'
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Pagination as PaginationRoot,
} from '../ui/pagination'

export interface PaginationProps<T> {
  table: Table<T>
  pagination: {
    pageIndex: number
    pageSize: number
  }
}

export const Pagination = <T extends object>({
  table,
  pagination,
}: PaginationProps<T>) => {
  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Go to first page"
            size="icon"
            onClick={() => table.firstPage()}
            disabled={pagination.pageIndex !== 0}
          >
            <ChevronFirstIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Go to previous page"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            Page{' '}
            <span className="text-foreground">{pagination.pageIndex + 1}</span>{' '}
            of <span className="text-foreground">{table.getPageCount()}</span>
          </p>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Go to next page"
            size="icon"
            onClick={() => table.getCanNextPage() && table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label="Go to last page"
            size="icon"
            onClick={() => table.lastPage()}
            disabled={pagination.pageIndex !== table.getPageCount() - 1}
          >
            <ChevronLastIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}
