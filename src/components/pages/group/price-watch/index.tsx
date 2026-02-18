import { useQuery } from '@tanstack/react-query'
import type { FC } from 'react'
import { ContractPriceInsight } from '@/components/game/contract/contract-price-insight'
import { ContractTags } from '@/lib/constants'
import { groupContractsQuery } from '@/lib/query/contract'

export const GroupPriceWatchPage: FC<{
  groupId: string
}> = ({ groupId }) => {
  const { data: contracts } = useQuery(
    groupContractsQuery({
      groupId,
      order: '-DateEpochMs',
      page: 1,
      pageSize: 20,
      types: ['BUYING', 'SELLING'],
      tags: [ContractTags.PRICE_NORMAL],
      statuses: ['OPEN', 'FULFILLED', 'PARTIALLY_FULFILLED'],
    }),
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Price Watch</h1>

      <div className="mt-4 flex flex-col gap-4">
        {contracts?.items.map(contract => {
          return (
            <ContractPriceInsight
              key={contract.ContractId}
              contract={contract}
            />
          )
        })}
      </div>
    </div>
  )
}
