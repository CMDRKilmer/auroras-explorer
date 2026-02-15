import axios, { type AxiosProgressEvent } from 'axios'
import { memoize } from 'es-toolkit'
import type {
  Building,
  CommodityExchange,
  Company,
  Group,
  Material,
  Recipe,
  TradingSummary,
  UserContract,
} from './types'

export * from './types'

const fioBaseUrl = 'https://rest.fnar.net'
export const fioClient = axios.create({
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

export const getUserContracts = async (username: string, token: string) => {
  const res = await fioClient.get<UserContract[]>(
    `/contract/allcontracts/${username}`,
    {
      headers: {
        Authorization: token,
      },
    },
  )

  return res.data
}

export const getGroups = async (token: string) => {
  const res = await fioClient.get<string[]>(`/auth/groups`, {
    headers: {
      Authorization: token,
    },
  })

  return res.data
}

export const getGroup = async (id: string, token: string) => {
  const res = await fioClient.get<Group>(`/auth/group/${id}`, {
    headers: {
      Authorization: token,
    },
  })

  return res.data
}

export const getCompanyByCode = async (code: string) => {
  const res = await fioClient.get<Company>(`/company/code/${code}`)

  return res.data
}

export const getCompanyByUsername = async (username: string) => {
  const res = await fioClient.get<Company>(`/user/${username}`)

  return res.data
}
