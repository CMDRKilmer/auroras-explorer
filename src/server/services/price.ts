import { FioClient } from '@/lib/fio/client'
import { sleep } from '@/lib/sleep'
import { logger } from '../common/logger'

export class PriceService {
  readonly fioClient = new FioClient()

  avgPriceMap: Record<string, number> = {}

  lastUpdated = 0
  updateInterval = 60 * 60 * 1000 // 1 hour
  running = false

  async updateData() {
    const orders = await this.fioClient.getOrdersData()
    const priceMap: Record<string, number[]> = {}
    for (const order of orders) {
      const { MaterialTicker, PriceAverage } = order
      if (!priceMap[MaterialTicker]) {
        priceMap[MaterialTicker] = []
      }
      if (PriceAverage) {
        priceMap[MaterialTicker].push(PriceAverage)
      }
    }

    for (const ticker in priceMap) {
      const prices = priceMap[ticker]
      const avgPrice =
        prices.reduce((sum, price) => sum + price, 0) / prices.length
      this.avgPriceMap[ticker] = avgPrice
    }
  }

  async init() {
    logger.info('Initializing PriceService...')
    await this.updateData()
    this.running = true
    this.autoUpdate()
  }

  async autoUpdate() {
    while (this.running) {
      const now = Date.now()
      const timeSinceLastUpdate = now - this.lastUpdated
      if (timeSinceLastUpdate < this.updateInterval) {
        await sleep(1000 * 60) // Sleep for 1 minute before checking again
        continue
      }

      try {
        await this.updateData()
        this.lastUpdated = Date.now()
        logger.info('Price data updated successfully')
      } catch (err: unknown) {
        logger.error('Failed to update price data', err)
      }
    }
  }
}
