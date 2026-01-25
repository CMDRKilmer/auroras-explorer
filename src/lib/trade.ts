import { assert } from './assert'
import type { DataStore } from './fio/store'
import { filterTradingsByExchangePairs } from './fio/util'

export interface Acquisition {
  materialId: string
  materialTicker: string
  count: number
  costPerItem: number
  totalCost: number
  sellingPricePerItem: number
  totalSellingPrice: number
  profit: number
  totalWeight: number
  totalVolume: number
}

export interface AcquisitionSummary {
  acquisitions: Acquisition[]
  totalProfit: number
  totalWeight: number
  totalVolume: number
}

export const getBestAcquisitions = (
  dataStore: DataStore,
  from: string,
  to: string,
  weightCapacity: number,
  volumeCapacity: number,
): AcquisitionSummary => {
  const tradings = filterTradingsByExchangePairs(dataStore.orders, from, to)
  for (const trading of Object.values(tradings)) {
    trading.buyingOrders = trading.buyingOrders
      .toSorted((a, b) => a.ItemCost - b.ItemCost)
      .toReversed()
    trading.sellingOrders = trading.sellingOrders.toSorted(
      (a, b) => a.ItemCost - b.ItemCost,
    )
  }
  const itemsInfo = dataStore.materialsByTicker

  let weightLeftCapacity = weightCapacity
  let volumeLeftCapacity = volumeCapacity

  const acquisitions: Acquisition[] = []

  const getBestAcquisition = () => {
    let bestProfit = 0
    let bestAcquisition: Acquisition | null = null
    for (const ticker in tradings) {
      const trading = tradings[ticker]
      const itemInfo = itemsInfo[ticker]
      assert(trading)
      assert(itemInfo)
      const highestBuyingOrder = trading.buyingOrders[0]
      if (!highestBuyingOrder) continue
      const lowestSellingOrder = trading.sellingOrders[0]
      if (!lowestSellingOrder) continue
      const value = highestBuyingOrder.ItemCost - lowestSellingOrder.ItemCost
      const itemCount = Math.min(
        highestBuyingOrder.ItemCount,
        lowestSellingOrder.ItemCount,
      )
      const affordableCount = Math.min(
        itemInfo.Weight * itemCount > weightLeftCapacity
          ? Math.floor(weightLeftCapacity / itemInfo.Weight)
          : itemCount,
        itemInfo.Volume * itemCount > volumeLeftCapacity
          ? Math.floor(volumeLeftCapacity / itemInfo.Volume)
          : itemCount,
      )
      if (affordableCount <= 0) {
        continue
      }
      if (value * affordableCount <= bestProfit) {
        continue
      }
      bestProfit = value * affordableCount
      const acquisition: Acquisition = {
        materialId: itemInfo.MaterialId,
        materialTicker: itemInfo.Ticker,
        count: affordableCount,
        costPerItem: highestBuyingOrder.ItemCost,
        totalCost: highestBuyingOrder.ItemCost * affordableCount,
        sellingPricePerItem: lowestSellingOrder.ItemCost,
        totalSellingPrice: lowestSellingOrder.ItemCost * affordableCount,
        profit: value * affordableCount,
        totalWeight: itemInfo.Weight * affordableCount,
        totalVolume: itemInfo.Volume * affordableCount,
      }
      bestAcquisition = acquisition
    }
    return bestAcquisition
  }

  let totalProfit = 0
  let totalWeight = 0
  let totalVolume = 0

  while (weightLeftCapacity > 0 && volumeLeftCapacity > 0) {
    const acquisition = getBestAcquisition()
    if (!acquisition) {
      break
    }
    acquisitions.push(acquisition)
    weightLeftCapacity -= acquisition.totalWeight
    volumeLeftCapacity -= acquisition.totalVolume
    totalProfit += acquisition.profit
    totalWeight += acquisition.totalWeight
    totalVolume += acquisition.totalVolume
    const trading = tradings[acquisition.materialTicker]
    assert(trading)
    const highestBuyingOrder = trading.buyingOrders[0]
    const lowestSellingOrder = trading.sellingOrders[0]
    assert(highestBuyingOrder)
    assert(lowestSellingOrder)
    highestBuyingOrder.ItemCount -= acquisition.count
    lowestSellingOrder.ItemCount -= acquisition.count
    if (highestBuyingOrder.ItemCount <= 0) {
      trading.buyingOrders.shift()
    }
    if (lowestSellingOrder.ItemCount <= 0) {
      trading.sellingOrders.shift()
    }
  }

  return {
    acquisitions,
    totalProfit,
    totalWeight,
    totalVolume,
  }
}

export const formatCurrency = (amount: number): string => {
  return `$${(amount << 0).toLocaleString('en-US')}`
}

export const formatAcquisitionSummary = (
  summary: AcquisitionSummary,
): string => {
  let result = 'Acquisition Summary:\n'
  for (const acq of summary.acquisitions) {
    const cols: string[] = ['-']
    cols.push(acq.materialTicker.padEnd(3, ' '))
    cols.push(`x${acq.count.toString().padEnd(5, ' ')}`)
    cols.push(`income:${formatCurrency(acq.totalCost)}`)
    cols.push(`(${formatCurrency(acq.costPerItem)})`)
    cols.push(`cost:${formatCurrency(acq.totalSellingPrice)}`)
    cols.push(`(${formatCurrency(acq.sellingPricePerItem)})`)
    cols.push(`profit=${formatCurrency(acq.profit)}`)
    cols.push(`W:${acq.totalWeight.toFixed(2)}T`)
    cols.push(`V:${acq.totalVolume.toFixed(2)}m³`)
    result += `${cols.join(' ')}\n`
  }
  result += `Total Profit: ${summary.totalProfit.toFixed(2)}\n`
  result += `Total Weight: ${summary.totalWeight.toFixed(2)}T\n`
  result += `Total Volume: ${summary.totalVolume.toFixed(2)}m³\n`
  return result
}

export const findSupplyShortage = (dataStore: DataStore, filterEx: string) => {
  const tradings = dataStore.orders.filter(o => {
    return (
      o.ExchangeCode === filterEx &&
      o.SellingOrders.length === 0 &&
      o.BuyingOrders.length > 0
    )
  })

  return tradings.toSorted((a, b) => a.Bid - b.Bid).toReversed()
}
