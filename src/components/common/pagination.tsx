import { useTranslation } from 'react-i18next'
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

export interface PaginationInstance {
  firstPage: () => void
  previousPage: () => void
  nextPage: () => void
  lastPage: () => void
  getCanPreviousPage: () => boolean
  getCanNextPage: () => boolean
  getPageCount: () => number
}

export interface PaginationProps {
  table: PaginationInstance
  pagination: {
    pageIndex: number
    pageSize: number
  }
}

export const Pagination = ({ table, pagination }: PaginationProps) => {
  const { t } = useTranslation()
  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label={t('pagination.firstPage') ?? undefined}
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
            aria-label={t('pagination.previousPage') ?? undefined}
            size="icon"
            onClick={() => table.getCanPreviousPage() && table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            {t('pagination.page')}{' '}
            <span className="text-foreground">{pagination.pageIndex + 1}</span>{' '}
            {t('pagination.of')}{' '}
            <span className="text-foreground">{table.getPageCount()}</span>
          </p>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label={t('pagination.nextPage') ?? undefined}
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
            aria-label={t('pagination.lastPage') ?? undefined}
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
