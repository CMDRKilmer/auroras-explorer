import { createColumnHelper } from '@tanstack/react-table'
import { capitalize } from 'es-toolkit'
import type { UserInfo } from '@/lib/api/types'
import { dayjs } from '@/lib/format'
import { cn } from '@/lib/utils'
import { UserCardBadge } from '../user-card'

const columnHelper = createColumnHelper<UserInfo>()

export const columns = [
  columnHelper.accessor('key', {
    header: 'Name',
    cell: row => {
      const user = row.row.original
      return (
        <div className="flex gap-4">
          <div className={cn('font-medium w-40 truncate', 'text-gray-500')}>
            {user.username ?? user.key}
          </div>

          {user.username ? (
            <div className="text-slate-500 font-medium flex gap-2 items-center">
              {user.companyName}
              <div className="text-muted-foreground text-xs">
                ({user.companyCode})
              </div>
            </div>
          ) : null}
        </div>
      )
    },
  }),

  columnHelper.display({
    id: 'status',
    header: 'Status',
    cell: row => {
      const user = row.row.original
      return (
        <div className="flex gap-2">
          <UserCardBadge user={user} />

          {user.lastContSyncStatus !== 'SUCCESS' ? (
            <div className="text-sm text-destructive">
              Sync failed:{' '}
              {capitalize(user.lastContSyncStatus.replaceAll('_', ' '))}
            </div>
          ) : !user.username ? (
            <div className="text-sm text-yellow-500">
              Cannot fetch user info
            </div>
          ) : null}

          {user.lastContSubmitAt ? (
            <div className="text-sm text-gray-500">
              Last Submitted at{' '}
              <span>{dayjs(user.lastContSubmitAt).fromNow()}</span>
            </div>
          ) : null}
        </div>
      )
    },
  }),
]
