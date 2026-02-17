import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
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

export class FioClient {
  fioBaseUrl = 'https://rest.fnar.net'

  httpClient: AxiosInstance

  constructor(public token?: string) {
    const headers: Record<string, string> = {}
    if (this.token) {
      headers.Authorization = this.token
    }
    this.httpClient = axios.create({
      baseURL: this.fioBaseUrl,
      timeout: 30000,
      headers,
    })
  }

  createLoader<T>(uri: string) {
    return async (opt: AxiosRequestConfig = {}) => {
      const res = await this.httpClient.get<T>(uri, opt)
      return res.data
    }
  }

  createMethod<T, Args extends unknown[]>(
    fn: (...args: Args) => Omit<AxiosRequestConfig, 'method'>,
  ) {
    return async (...args: [...Args, AxiosRequestConfig?]) => {
      const opt = args.pop() as AxiosRequestConfig
      const res = await this.httpClient.request<T>({
        method: 'GET',
        ...fn(...(args as unknown as Args)),
        ...opt,
      })
      return res.data
    }
  }

  getOrdersData = this.createLoader<TradingSummary[]>('/exchange/full')
  getAllMaterials = this.createLoader<Material[]>('/material/allmaterials')
  getAllRecipes = this.createLoader<Recipe[]>('/recipes/allrecipes')
  getAllExchanges = this.createLoader<CommodityExchange[]>(
    '/global/comexexchanges',
  )
  getAllBuildings = this.createLoader<Building[]>('/building/allbuildings')
  getLoginInfo = this.createLoader<string>('/auth')
  getUserContracts = this.createMethod<UserContract[], [username: string]>(
    (username: string) => ({
      url: `/contract/allcontracts/${username}`,
    }),
  )
  getGroups = this.createLoader<string[]>('/auth/groups')
  getGroup = this.createMethod<Group, [groupId: string]>((groupId: string) => ({
    url: `/group/${groupId}`,
  }))
  getCompanyByCode = this.createMethod<Company, [companyCode: string]>(
    (companyCode: string) => ({
      url: `/company/${companyCode}`,
    }),
  )
  getCompanyByUsername = this.createMethod<Company, [username: string]>(
    (username: string) => ({
      url: `/user/${username}`,
    }),
  )
}
