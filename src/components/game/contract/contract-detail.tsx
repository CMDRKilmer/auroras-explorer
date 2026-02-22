import type { Row } from '@tanstack/react-table'
import type { FC } from 'react'
import type { Contract } from '@/lib/api/types'
import { formatTimeAdvanced } from '@/lib/format'
import { cn } from '@/lib/utils'
import MdiArrowRight from '~icons/mdi/arrow-right'
import MdiCheck from '~icons/mdi/check'
import MdiClose from '~icons/mdi/close'
import { ContractType } from './components'
import { ConditionBrief } from './condition-brief'

export const ContractDetail: FC<{
  contract: Contract
}> = ({ contract }) => {
  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <ContractType type={contract.Type} />

        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="font-semibold">
            <span className="text-gray-500">{contract.ProviderUsername}</span>
            {contract.ProviderCompanyName ? (
              <span className="pl-2 font-normal text-muted-foreground">
                <span className="text-slate-500">
                  {contract.ProviderCompanyName}
                </span>{' '}
                <span className="text-xs">
                  ({contract.ProviderCompanyCode})
                </span>
              </span>
            ) : null}
          </span>
          <MdiArrowRight />
          <span className="font-semibold">
            <span className="text-gray-500">{contract.CustomerUsername}</span>
            {contract.CustomerCompanyName ? (
              <span className="pl-2 font-normal text-muted-foreground">
                <span className="text-slate-500">
                  {contract.CustomerCompanyName}
                </span>{' '}
                <span className="text-xs">
                  ({contract.CustomerCompanyCode})
                </span>
              </span>
            ) : null}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-secondary-foreground">
          Created: {formatTimeAdvanced(contract.DateEpochMs)}
        </span>
        <span>Updated: {formatTimeAdvanced(contract.Timestamp)}</span>
        {contract.DueDateEpochMs && (
          <span>Due: {formatTimeAdvanced(contract.DueDateEpochMs)}</span>
        )}
      </div>

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
                #{condition.ConditionIndex + 1}
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
    </>
  )
}

export const ContractDetailInDataTable: FC<{
  row: Row<Contract>
}> = ({ row }) => {
  const contract = row.original

  return (
    <tr>
      <td colSpan={100} className="bg-secondary p-4">
        <ContractDetail contract={contract} />
      </td>
    </tr>
  )
}
