import axios, { type AxiosProgressEvent } from 'axios'
import type {
  Building,
  CommodityExchange,
  Material,
  Recipe,
  TradingSummary,
} from './types'

export * from './types'

const fioBaseUrl = 'https://rest.fnar.net'
const fioClient = axios.create({
  baseURL: fioBaseUrl,
  timeout: 30000,
})

export interface LoadDataOptions {
  onProgress?: (progressEvent?: AxiosProgressEvent) => void
}

const createDataLoader = <T>(uri: string) => {
  return async (opt: LoadDataOptions = {}) => {
    const res = await fioClient.get<T>(uri, {
      onDownloadProgress: opt.onProgress,
    })
    return res.data
  }
}

export const getOrdersData =
  createDataLoader<TradingSummary[]>('/exchange/full')

export const getAllMaterials = createDataLoader<Material[]>(
  '/material/allmaterials',
)

export const getAllRecipes = createDataLoader<Recipe[]>('/recipes/allrecipes')

export const getAllExchanges = createDataLoader<CommodityExchange[]>(
  '/global/comexexchanges',
)

export const getAllBuildings = createDataLoader<Building[]>(
  '/building/allbuildings',
)
