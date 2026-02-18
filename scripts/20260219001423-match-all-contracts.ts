import { db } from '@/server/common/db'
import { logger } from '@/server/common/logger'
import { matchAndUpdateContractTags } from '@/server/services/contract/match-contract'
import { PriceService } from '@/server/services/price'

const main = async () => {
  const priceService = new PriceService()
  await priceService.init()
  for await (const contract of db('contracts')
    .orderBy('CreatedAt', 'ASC')
    .stream()) {
    const tags = await matchAndUpdateContractTags(
      priceService,
      contract.ContractId,
    )
    logger.info(
      `Contract ${contract.ContractLocalId} matched tags: ${tags.join(', ')}`,
    )
  }
}

main()
  .then(() => {
    console.log('Done')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
