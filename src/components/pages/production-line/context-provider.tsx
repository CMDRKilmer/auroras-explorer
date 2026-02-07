import { type FC, useMemo, useState } from 'react'
import { ExplorerContext } from './context'

interface ExplorerHistoryItem {
  mat?: string
  building?: string
}

export const ExplorerContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cx, setCx] = useState<string | undefined>('NC1')
  const [mat, setMat] = useState<string | undefined>('AU')
  const [building, setBuilding] = useState<string | undefined>(undefined)
  const [history, setHistory] = useState<ExplorerHistoryItem[]>(() => {
    return [{ mat, building }]
  })
  const [historyIndex, setHistoryIndex] = useState<number>(0)
  const value = useMemo(() => {
    const pushHistory = (item: ExplorerHistoryItem) => {
      if (
        history[historyIndex].mat === item.mat &&
        history[historyIndex].building === item.building
      ) {
        return
      }
      setHistory(prev => [...prev.slice(0, historyIndex + 1), item])
      setHistoryIndex(prev => prev + 1)
    }
    const canBack = historyIndex > 0
    const canForward = historyIndex < history.length - 1
    const back = () => {
      if (canBack) {
        const item = history[historyIndex - 1]
        setMat(item.mat)
        setBuilding(item.building)
        setHistoryIndex(prev => prev - 1)
      }
    }
    const forward = () => {
      if (canForward) {
        const item = history[historyIndex + 1]
        setMat(item.mat)
        setBuilding(item.building)
        setHistoryIndex(prev => prev + 1)
      }
    }
    return {
      cx,
      setCx,
      mat,
      setMat: (mat: string | undefined) => {
        pushHistory({ mat: mat, building: undefined })
        setMat(mat)
        setBuilding(undefined)
      },
      building,
      setBuilding: (building: string | undefined) => {
        pushHistory({ mat: undefined, building: building })
        setMat(undefined)
        setBuilding(building)
      },
      canBack,
      canForward,
      back,
      forward,
    }
  }, [cx, mat, building, history, historyIndex])

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  )
}
