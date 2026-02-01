import { queryOptions, useQuery } from '@tanstack/react-query'
import { createStore, useStore } from 'zustand'
import * as fio from '@/lib/fio'
import { getDataWithCache } from './fs'

export interface GameData {
  materials: fio.Material[]
  materialsByTicker: Record<string, fio.Material>
  orders: fio.TradingSummary[]
  recipes: fio.Recipe[]
  exchanges: fio.CommodityExchange[]
  buildings: fio.Building[]
  buildingsByTicker: Record<string, fio.Building>
}

interface DataLoadingState {
  progress: number
  rate: number
  setProgress: (progress: number) => void
  setRate: (rate: number) => void
}

const dataLoadingStateStore = createStore<DataLoadingState>(set => ({
  progress: 0,
  rate: 0,
  setProgress: (progress: number) => set({ progress }),
  setRate: (rate: number) => set({ rate }),
}))

export const useDataLoadingState = () => useStore(dataLoadingStateStore)

interface LoaderConfig<T = unknown> {
  key: string
  fn: (opt?: fio.LoadDataOptions) => Promise<T>
  expiryMs?: number
  apply: (g: GameData, data: T) => void
}

const loaders: LoaderConfig[] = []

const addLoader = <T>(config: LoaderConfig<T>) => {
  loaders.push(config as LoaderConfig)
}

addLoader({
  key: 'orders',
  fn: fio.getOrdersData,
  expiryMs: 1000 * 60 * 5, // 5 minutes
  apply: (g, data) => {
    g.orders = data
  },
})

addLoader({
  key: 'materials',
  fn: fio.getAllMaterials,
  apply: (g, data) => {
    g.materials = data.toSorted((a, b) => a.Ticker.localeCompare(b.Ticker))
    g.materialsByTicker = {}
    for (const material of data) {
      g.materialsByTicker[material.Ticker] = material
    }
  },
})

addLoader({
  key: 'recipes',
  fn: fio.getAllRecipes,
  apply: (g, data) => {
    g.recipes = data
  },
})

addLoader({
  key: 'exchanges',
  fn: fio.getAllExchanges,
  apply: (g, data) => {
    g.exchanges = data
  },
})

addLoader({
  key: 'buildings',
  fn: fio.getAllBuildings,
  apply: (g, data) => {
    g.buildings = data.toSorted((a, b) => a.Ticker.localeCompare(b.Ticker))
    g.buildingsByTicker = {}
    for (const building of data) {
      g.buildingsByTicker[building.Ticker] = building
    }
  },
})

const loadGameData = async (): Promise<GameData> => {
  const dataStore: GameData = {
    materials: [],
    materialsByTicker: {},
    orders: [],
    recipes: [],
    exchanges: [],
    buildings: [],
    buildingsByTicker: {},
  }

  await Promise.all(
    loaders.map(async ({ key, fn, apply, expiryMs }) => {
      const opt: fio.LoadDataOptions = {
        onProgress(event) {
          console.log('progress', { key, event })
        },
      }
      const data = await getDataWithCache(() => fn(opt), key, { expiryMs })
      apply(dataStore, data)
    }),
  )

  return dataStore
}

const gameDataQuery = queryOptions({
  queryKey: ['gameData'],
  queryFn: loadGameData,
  staleTime: Infinity,
})

export const useGameData = () => useQuery(gameDataQuery)
