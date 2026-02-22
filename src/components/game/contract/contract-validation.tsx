import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { type FC, useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Contract } from '@/lib/api'
import { validateContract } from '@/lib/game/validate-contract'
import { groupPlansQuery } from '@/lib/query/group'
import { useGameData } from '@/lib/store'
import MaterialSymbolsFmdBadRounded from '~icons/material-symbols/fmd-bad-rounded'
import MdiCheck from '~icons/mdi/check'
import MdiQuestionMarkCircleOutline from '~icons/mdi/question-mark-circle-outline'

export const ContractValidation: FC<{
  contract: Contract
}> = ({ contract }) => {
  const { data } = useGameData()
  const { groupId = '' } = useParams({
    strict: false,
  })
  const { data: plans } = useQuery(groupPlansQuery(groupId))

  const result = useMemo(() => {
    if (!data || !plans) return
    return validateContract(data, contract, plans)
  }, [data, contract, plans])

  if (!result) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {result.matchPlan ? (
            <Tooltip>
              <TooltipTrigger>
                <MdiCheck className="text-green-500" />
              </TooltipTrigger>
              <TooltipContent>This contract matches the plan.</TooltipContent>
            </Tooltip>
          ) : result.hasPlan ? (
            <Tooltip>
              <TooltipTrigger>
                <MaterialSymbolsFmdBadRounded className="text-destructive" />
              </TooltipTrigger>
              <TooltipContent>
                This contract does not match the plan.
              </TooltipContent>
            </Tooltip>
          ) : result.isRequest ? (
            <Tooltip>
              <TooltipTrigger>
                <MdiQuestionMarkCircleOutline className="text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                This contract is looks like a supply request but there is no
                plan for the location. You can set up a plan for this location
                in the plan tab.
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <span className="text-muted-foreground">-</span>
              </TooltipTrigger>
              <TooltipContent>
                This contract does not seem to be a request for supply.
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
