import { logger } from '../common/logger'
import { Scheduler } from './scheduler'

const main = async () => {
  const scheduler = new Scheduler()
  await scheduler.init()
  await scheduler.startListener()
  await scheduler.run()
}

main().catch(err => {
  logger.error('Scheduler fatal error', err)
  process.exit(1)
})
