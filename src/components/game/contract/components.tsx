import { sortBy, uniqBy } from 'es-toolkit'
import type { FC } from 'react'
import type { Contract } from '@/lib/api'
import { dayjs } from '@/lib/format'
import MaterialSymbolsLocalShippingOutline from '~icons/material-symbols/local-shipping-outline'
import MdiBank from '~icons/mdi/bank'
import MdiCartOutline from '~icons/mdi/cart-outline'
import MdiOutput from '~icons/mdi/output'
import MdiQuestionMark from '~icons/mdi/question-mark'
import { MaterialTile } from '../material-tile'
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

export const ContractType: FC<{ type: string }> = ({ type }) => {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      {type === 'BUYING' ? (
        <MdiCartOutline />
      ) : type === 'SELLING' ? (
        <MdiOutput />
      ) : type === 'SHIPMENT' ? (
        <MaterialSymbolsLocalShippingOutline />
      ) : type === 'LOAN' ? (
        <MdiBank />
      ) : (
        <MdiQuestionMark />
      )}
      <span className="text-xs">{type}</span>
    </div>
  )
}

export const ContractItems: FC<{ contract: Contract; max?: number }> = ({
  contract,
  max = 100,
}) => {
  const items = sortBy(
    uniqBy(
      contract.Conditions.filter(cond => cond.MaterialTicker),
      cond => cond.MaterialTicker,
    ),
    ['MaterialTicker'],
  ).map(cond => {
    if (!cond.MaterialTicker) return null
    return (
      <MaterialTile
        key={cond.MaterialTicker}
        ticker={cond.MaterialTicker}
        className="h-6 w-10"
      />
    )
  })
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {items.slice(0, max)}
      {items.length > max && (
        <span className="text-sm text-muted-foreground">
          +{items.length - max}
        </span>
      )}
    </div>
  )
}

export const ContractLocation: FC<{ contract: Contract }> = ({ contract }) => {
  const location = contract.Conditions.find(cond => cond.Address)?.Address
  const destination = contract.Conditions.find(
    cond => cond.Destination,
  )?.Destination
  return (
    <div className="text-sm text-muted-foreground">
      {location || 'N/A'}
      {destination && (
        <>
          <span className="mx-1">→</span>
          {destination}
        </>
      )}
    </div>
  )
}
