import type { Order, TradingSummary } from './types'

export const filterTradingsByExchangePairs = (
  orders: TradingSummary[],
  from: string,
  to: string,
) => {
  const inputTradings = orders.filter(o => {
    return o.ExchangeCode === from && o.SellingOrders.length > 0
  })
  const outputTradings = orders.filter(o => {
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
