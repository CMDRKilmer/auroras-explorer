import { capitalize } from 'es-toolkit'
import type { FC } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { UserContract, UserContractCondition } from '@/lib/fio'
import { formatTimeAdvanced } from '@/lib/format'
import { cn } from '@/lib/utils'
import MdiCheck from '~icons/mdi/check'
import MdiClose from '~icons/mdi/close'
import { MaterialTile } from '../material-tile'
import { ContractStatus, DueDateBadge } from './compoents'

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

const ConditionBrief: FC<{
  condition: UserContractCondition
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

export const ContractList: FC<{ contracts: UserContract[] }> = ({
  contracts,
}) => {
  // accordion card showing contract details with border and hover effect
  return (
    <Accordion type="multiple">
      {contracts.map(contract => {
        return (
          <AccordionItem
            key={contract.ContractLocalId}
            value={contract.ContractLocalId}
          >
            <AccordionTrigger className="flex items-center gap-4 hover:no-underline cursor-pointer">
              <div className="flex flex-col">
                <div>
                  <span className="font-mono text-gray-500 tracking-wider mr-2 no-underline">
                    {contract.ContractLocalId}
                  </span>
                  <ContractStatus status={contract.Status} />
                </div>

                <div>
                  <span className="font-semibold">
                    <span className="opacity-80">{contract.PartnerName}</span>

                    {contract.PartnerCompanyCode && (
                      <span className="text-muted-foreground ml-2">
                        ({contract.PartnerCompanyCode})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex-1" />

              <DueDateBadge dueDateMs={contract.DueDateEpochMs} />
            </AccordionTrigger>
            <AccordionContent className="py-4 border-t">
              <span className="text-secondary-foreground">
                Created: {formatTimeAdvanced(contract.DateEpochMs)}
              </span>
              <div className="mt-2 flex flex-col gap-1">
                {contract.Conditions.map(condition => {
                  const username =
                    condition.Party === contract.Party
                      ? contract.UserNameSubmitted
                      : contract.PartnerName

                  return (
                    <div
                      key={condition.ConditionId}
                      className="flex items-center gap-2"
                    >
                      <span className="text-muted-foreground w-8">
                        #{condition.ConditionIndex}
                      </span>

                      <span>
                        {condition.Status === 'FULFILLED' ? (
                          <MdiCheck className="text-green-500" />
                        ) : (
                          <MdiClose className="text-gray-500" />
                        )}
                      </span>

                      <span
                        className={cn(
                          condition.Party === contract.Party
                            ? 'text-gray-500'
                            : 'text-muted-foreground',
                          'w-30 truncate',
                        )}
                      >
                        {username}
                      </span>

                      <ConditionBrief condition={condition} />
                    </div>
                  )
                })}
              </div>

              {/* <pre className="mt-4">
                {JSON.stringify(omit(contract, ['Conditions']), null, 2)}
              </pre> */}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
