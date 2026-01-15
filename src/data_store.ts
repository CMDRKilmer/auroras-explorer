import fs from 'node:fs/promises'
import path from 'node:path'
import type { Material, Order, TradingSummary } from './types'

const fioBaseUrl = 'https://rest.fnar.net'

export const getOrdersData = async () => {
  // https://rest.fnar.net/exchange/full
  const res = await fetch(`${fioBaseUrl}/exchange/full`)
  const data = await res.json()
  return data as TradingSummary[]
}

export const getAllMaterials = async () => {
  // https://rest.fnar.net/material/allmaterials
  const res = await fetch(`${fioBaseUrl}/material/allmaterials`)
  const data = await res.json()
  return data as Material[]
}

export class DataStore {
  protected materials: Material[] = []
  protected orders: TradingSummary[] = []

  materialsByTicker: Record<string, Material> = {}

  protected cacheDir = 'tmp'

  async loadData() {
    const materialsCachePath = path.join(this.cacheDir, 'materials.json')
    if (await fs.exists(materialsCachePath)) {
      const data = await fs.readFile(materialsCachePath, 'utf-8')
      this.materials = JSON.parse(data) as Material[]
    } else {
      this.materials = await getAllMaterials()
      await fs.mkdir(this.cacheDir, { recursive: true })
      await fs.writeFile(
        materialsCachePath,
        JSON.stringify(this.materials, null, 2),
      )
    }

    const ordersCachePath = path.join(this.cacheDir, 'orders.json')
    if (await fs.exists(ordersCachePath)) {
      const data = await fs.readFile(ordersCachePath, 'utf-8')
      this.orders = JSON.parse(data) as TradingSummary[]
    } else {
      this.orders = await getOrdersData()
      await fs.mkdir(this.cacheDir, { recursive: true })
      await fs.writeFile(ordersCachePath, JSON.stringify(this.orders, null, 2))
    }

    this.materialsByTicker = {}
    for (const mat of this.materials) {
      this.materialsByTicker[mat.Ticker] = mat
    }
  }

  filterTradingsByExchangePairs(from: string, to: string) {
    const inputTradings = this.orders.filter(o => {
      return o.ExchangeCode === from && o.SellingOrders.length > 0
    })
    const outputTradings = this.orders.filter(o => {
      return o.ExchangeCode === to && o.BuyingOrders.length > 0
    })
    const inputTradingsMap: Record<string, TradingSummary> = {}
    const outputTradingsMap: Record<string, TradingSummary> = {}
    for (const trading of inputTradings) {
      inputTradingsMap[trading.MaterialTicker] = trading
    }
    for (const trading of outputTradings) {
      outputTradingsMap[trading.MaterialTicker] = trading
    }
    const result: Record<
      string,
      { buyingOrders: Order[]; sellingOrders: Order[] }
    > = {}
    for (const ticker of Object.keys(inputTradingsMap)) {
      const buyingOrders = outputTradingsMap[ticker]?.BuyingOrders
      const sellingOrders = inputTradingsMap[ticker]?.SellingOrders
      if (buyingOrders && sellingOrders) {
        result[ticker] = {
          buyingOrders,
          sellingOrders,
        }
      }
    }
    return result
  }
}
