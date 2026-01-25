import type { Material, TradingSummary } from './types'

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
