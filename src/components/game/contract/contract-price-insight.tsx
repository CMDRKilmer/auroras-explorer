import { type FC, useMemo } from 'react'
import type { Contract } from '@/lib/api'
import { ContractMatcher } from '@/lib/game/match-contract'
import { MaterialTile } from '../material-tile'
import { ContractDetail } from './contract-detail'

export const ContractPriceInsight: FC<{ contract: Contract }> = ({
  contract,
}) => {
  const items = useMemo(() => {
    const matcher = new ContractMatcher(contract.Conditions)
    matcher.match()
    if (!['BUYING', 'SELLING'].includes(contract.Type)) return []

    return matcher.tradings
  }, [contract])

  return (
    <div className="flex flex-col gap-4 border rounded p-4">
      <div>{contract.ContractLocalId}</div>
      <div>
        {items.length} {contract.Conditions.length}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {items.map(item => {
          return (
            <div key={item.ticker}>
              <MaterialTile ticker={item.ticker} className="h-6 w-10" />
            </div>
          )
        })}
      </div>

      <div>
        <ContractDetail contract={contract} />

        {contract.Tags.map(tag => (
          <div
            key={tag}
            className="inline-block bg-secondary px-2 py-1 rounded text-xs"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  )
}
