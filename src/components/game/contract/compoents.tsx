import type { FC } from 'react'
import { Badge } from '@/components/ui/badge'
import { dayjs } from '@/lib/format'
import { getContractStatusLabel } from './utils'

export const ContractStatus: FC<{ status: string }> = ({ status }) => {
  return (
    <Badge
      variant={
        status === 'OPEN'
          ? 'info'
          : status === 'PARTIALLY_FULFILLED' || status === 'TERMINATED'
            ? 'warning'
            : status === 'FULFILLED'
              ? 'success'
              : status === 'REJECTED' || status === 'CANCELLED'
                ? 'error'
                : 'disabled'
      }
    >
      {getContractStatusLabel(status)}
    </Badge>
  )
}

export const DueDateBadge: FC<{ dueDateMs?: number | null }> = ({
  dueDateMs,
}) => {
  if (!dueDateMs) return null

  const durationMs = dueDateMs - Date.now()

  const duration = dayjs.duration(durationMs)

  if (duration.asDays() < 1) {
    return (
      <span className="text-destructive">{duration.asDays().toFixed(1)}d</span>
    )
  }
  if (duration.asDays() < 3) {
    return (
      <span className="text-yellow-500">{duration.asDays().toFixed(1)}d</span>
    )
  }

  return <span className="text-green-500">{duration.asDays().toFixed(1)}d</span>
}
