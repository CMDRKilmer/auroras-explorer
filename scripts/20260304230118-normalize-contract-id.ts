import { db } from '@/server/common/db'
import { logger } from '@/server/common/logger'
import { normalizeContractId } from '@/server/store/contract'

const main = async () => {
  for await (const contract of db('contracts')
    .orderBy('CreatedAt', 'ASC')
    .stream()) {
    if (!contract.ContractId.includes('-')) {
      continue
    }
    await db.transaction(async trx => {
      const existing = await trx('contracts')
        .where('ContractId', contract.ContractId)
        .first()
      if (
        new Date(existing.Timestamp).valueOf() >
        new Date(contract.Timestamp).valueOf()
      ) {
        logger.info(`Skipping contract with id ${contract.ContractId}`)
        return
      }
      await db('contracts')
        .insert({
          ...contract,
          ContractId: normalizeContractId(contract.ContractId),
          UpdatedAt: new Date(),
        })
        .onConflict('ContractId')
        .merge()
      logger.info(
        `Normalized contract id ${contract.ContractId} to ${normalizeContractId(contract.ContractId)}`,
      )
    })
    await db('contracts').delete().where('ContractId', contract.ContractId)
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
