import type { FC } from 'react'
import type { Contract } from '@/lib/api'
import { dayjs } from '@/lib/format'
import { getContractStatusLabel } from './utils'

export const ContractStatus: FC<{ contract: Contract }> = ({ contract }) => {
  const status = contract.Status
  return (
    <div
      className={
        status === 'OPEN'
          ? 'text-info'
          : status === 'PARTIALLY_FULFILLED'
            ? 'text-warning'
            : status === 'FULFILLED'
              ? 'text-success'
              : 'text-muted-foreground'
      }
    >
      {getContractStatusLabel(contract)}
    </div>
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
