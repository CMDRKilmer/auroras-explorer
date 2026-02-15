import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import type { Contract } from '@/lib/api/types'
import { formatTimeAdvanced } from '@/lib/format'
import { cn } from '@/lib/utils'
import MdiCheck from '~icons/mdi/check'
import MdiClose from '~icons/mdi/close'
import { ConditionBrief } from './condition-brief'

export const ContractDetail: FC<{
  row: Row<Contract>
}> = ({ row }) => {
  const contract = row.original
  return (
    <tr>
      <td colSpan={100} className="bg-secondary p-4">
        <span className="text-secondary-foreground">
          Created: {formatTimeAdvanced(contract.DateEpochMs)}
        </span>
        <div className="mt-2 flex flex-col gap-1">
          {contract.Conditions.map(condition => {
            const username =
              condition.Party === 'PROVIDER'
                ? contract.ProviderUsername
                : contract.CustomerUsername

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

                <span className={cn('text-muted-foreground', 'w-30 truncate')}>
                  {username}
                </span>

                <ConditionBrief condition={condition} />
              </div>
            )
          })}
        </div>
      </td>
    </tr>
  )
}
