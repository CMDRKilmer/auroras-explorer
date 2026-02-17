import axios from 'axios'
import { getItem, setItem } from '@/hooks/use-storage'
import { AppError } from '@/server/common/error'
import { config } from '../config'

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
})

apiClient.interceptors.request.use(config => {
  const token = getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      setItem('token', undefined)
    }
    if (error.response.data) {
      const err = new AppError(error.response.data.message)
      err.setStatusCode(error.response.status)
      return Promise.reject(err)
    }
    return Promise.reject(error)
  },
)

export * from './types'
