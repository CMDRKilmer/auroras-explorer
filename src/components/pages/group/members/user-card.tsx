import type { FC } from 'react'
import type { UserInfo } from '@/lib/api/types'
import { dayjs } from '@/lib/format'
import MdiAlert from '~icons/mdi/alert'
import MdiCheck from '~icons/mdi/check'
import MdiWarning from '~icons/mdi/warning'

export const UserCardBadge: FC<{ user: UserInfo }> = ({ user }) => {
  if (user.lastContSyncStatus !== 'SUCCESS') {
    return <MdiAlert className="text-red-500" />
  }

  if (!user.username) {
    return <MdiWarning className="text-yellow-500" />
  }

  if (dayjs(user.lastContSubmitAt).isBefore(dayjs().subtract(7, 'day'))) {
    return <MdiAlert className="text-yellow-500" />
  }

  return <MdiCheck className="text-green-500" />
}
