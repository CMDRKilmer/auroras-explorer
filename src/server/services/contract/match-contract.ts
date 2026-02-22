import { ContractTags } from '@/lib/constants'
import { ContractMatcher } from '@/lib/game/match-contract'
import { db } from '@/server/common/db'
import { logger } from '@/server/common/logger'
import type { UserContractConditionPO } from '@/server/store/type'
import type { PriceService } from '../price'

export const matchContractTags = async (
  priceService: PriceService,
  sortedConditions: UserContractConditionPO[],
) => {
  const matcher = new ContractMatcher(sortedConditions)
  matcher.match()

  const tags = new Set<string>()
  if (matcher.type === 'SHIPMENT') {
    for (const shipment of matcher.shipments) {
      const pricePerTon = shipment.totalPrice / shipment.weight
      if (pricePerTon < 1) {
        tags.add(ContractTags.PRICE_TOO_LOW)
      }
    }
  } else if (matcher.type === 'SELLING' || matcher.type === 'BUYING') {
    for (const trading of matcher.tradings) {
      const pricePerUnit = trading.totalPrice / trading.quantity
      if (pricePerUnit < 3) {
        tags.add(ContractTags.PRICE_TOO_LOW)
      } else {
        const avgPrice = priceService.avgPriceMap[trading.ticker]
        if (!avgPrice) {
          tags.add(ContractTags.UNKNOWN_MATERIAL)
        } else {
          const priceRatio = pricePerUnit / avgPrice
          if (priceRatio > 2) {
            tags.add(ContractTags.PRICE_TOO_HIGH)
          }
        }
      }
    }
  } else if (!matcher.type) {
    tags.add(ContractTags.NO_MATCH)
  }

  if (tags.size === 0) {
    tags.add(ContractTags.PRICE_NORMAL)
  }

  return [...tags]
}

export const matchAndUpdateContractTags = async (
  priceService: PriceService,
  contractId: string,
  dryRun = false,
) => {
  const contract = await db('contracts').where('ContractId', contractId).first()
  if (!contract) {
    throw new Error(`Contract with id ${contractId} not found`)
  }
  const conditions = await db('fio_user_contract_conditions')
    .where('ContractId', contractId)
    .where('UserNameSubmitted', contract.LastSubmittedBy)
  const sortedConditions = conditions.sort(
    (a, b) => a.ConditionIndex - b.ConditionIndex,
  )

  const tags = await matchContractTags(priceService, sortedConditions)

  if (!dryRun) {
    await db('contracts').where('ContractId', contractId).update({
      Tags: tags,
      UpdatedAt: new Date(),
    })
  }

  logger.debug(`Contract ${contractId} matched with tags: ${tags.join(', ')}`)

  return tags
}
