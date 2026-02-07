import { createContext, useContext } from 'react'

export const ExplorerContext = createContext<{
  cx?: string
  setCx: (cx?: string) => void
  mat?: string
  setMat: (mat?: string) => void
  building?: string
  setBuilding: (building?: string) => void
  canBack?: boolean
  canForward?: boolean
  back: () => void
  forward: () => void
}>({
  setCx: () => {},
  setMat: () => {},
  setBuilding: () => {},
  back: () => {},
  forward: () => {},
})

export const useExplorerContext = () => {
  return useContext(ExplorerContext)
}
