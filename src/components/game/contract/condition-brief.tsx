import { capitalize } from 'es-toolkit'
import type { FC } from 'react'
import type { UserContractConditionPO } from '@/server/store/type'
import { MaterialTile } from '../material-tile'

// HEADQUARTERS_UPGRADE
// FINISH_FLIGHT
// WORKFORCE_PROGRAM_START
// BASE_CONSTRUCTION
// PRODUCTION_RUN
// PLACE_ORDER
// POWER
// REPAIR_SHIP
// COMEX_PURCHASE_PICKUP
// DELIVERY_SHIPMENT
// PAYMENT
// DELIVERY
// PROVISION
// WORKFORCE_PROGRAM_PAYMENT
// REPUTATION
// START_FLIGHT
// CONSTRUCT_SHIP
// PICKUP_SHIPMENT
// EXPLORATION
// PROVISION_SHIPMENT
// PRODUCTION_ORDER_COMPLETED
// LOAN_PAYOUT
// LOAN_INSTALLMENT
// CONTRIBUTION

export const ConditionBrief: FC<{
  condition: UserContractConditionPO
}> = ({ condition }) => {
  if (condition.Type === 'PAYMENT') {
    return (
      <div className="text-muted-foreground flex items-center gap-1">
        Payment
        <span className="text-foreground">
          {condition.Amount.toLocaleString()} {condition.Currency}
        </span>
      </div>
    )
  }
  if (
    ['DELIVERY', 'PROVISION_SHIPMENT', 'COMEX_PURCHASE_PICKUP'].includes(
      condition.Type,
    ) &&
    condition.MaterialTicker &&
    condition.MaterialAmount
  ) {
    return (
      <div className="text-muted-foreground flex items-center gap-2">
        {condition.Type === 'DELIVERY'
          ? 'Deliver'
          : condition.Type === 'PROVISION_SHIPMENT'
            ? 'Provision'
            : condition.Type === 'COMEX_PURCHASE_PICKUP'
              ? 'Pickup'
              : ''}
        <MaterialTile ticker={condition.MaterialTicker} className="h-6 w-10" />
        <span className="text-foreground">
          x {condition.MaterialAmount.toLocaleString()}{' '}
        </span>
        <span className="text-sm text-muted-foreground">
          @ {condition.Address}
        </span>
      </div>
    )
  }
  return (
    <div className="text-muted-foreground">
      {capitalize(condition.Type).replaceAll('_', ' ')}
    </div>
  )
}
