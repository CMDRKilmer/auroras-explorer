import { getAllMaterials, getOrdersData } from '.'
import type { Material, TradingSummary } from './types'

export interface DataStore {
  materialsByTicker: Record<string, Material>
  orders: TradingSummary[]
}

export const loadData = async (): Promise<DataStore> => {
  const [materials, orders] = await Promise.all([
    getAllMaterials(),
    getOrdersData(),
  ])

  const dataStore: DataStore = {
    materialsByTicker: {},
    orders,
  }

  for (const material of materials) {
    dataStore.materialsByTicker[material.Ticker] = material
  }

  return dataStore
}
