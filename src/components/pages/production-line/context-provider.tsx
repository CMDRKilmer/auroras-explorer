import { getRouteApi, useRouter } from '@tanstack/react-router'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { ExplorerContext } from './context'

interface ExplorerHistoryItem {
  mat?: string
  building?: string
}

const routeApi = getRouteApi('/production-line/')

export const ExplorerContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cx, setCx] = useState<string | undefined>('NC1')
  const params = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const router = useRouter()

  const mat = params.material
  const building = params.building

  const [history, setHistory] = useState<ExplorerHistoryItem[]>(() => {
    return [{ mat, building }]
  })

  const [historyIndex, setHistoryIndex] = useState<number>(0)

  const pushHistory = useCallback(
    (item: ExplorerHistoryItem) => {
      if (
        history[historyIndex].mat === item.mat &&
        history[historyIndex].building === item.building
      ) {
        return
      }
      setHistory(prev => [...prev.slice(0, historyIndex + 1), item])
      setHistoryIndex(prev => prev + 1)
    },
    [history, historyIndex],
  )

  useEffect(() => {
    if (params.material == null && params.building == null) {
      navigate({
        search: {
          material: 'AU',
          building: undefined,
        },
      })
      setHistory([{ mat: 'AU', building: undefined }])
      setHistoryIndex(0)
      return
    }
    const isBackNavigation =
      history[historyIndex - 1] &&
      history[historyIndex - 1].mat === params.material &&
      history[historyIndex - 1].building === params.building
    const isForwardNavigation =
      history[historyIndex + 1] &&
      history[historyIndex + 1].mat === params.material &&
      history[historyIndex + 1].building === params.building
    if (isBackNavigation) {
      setHistoryIndex(prev => prev - 1)
    } else if (isForwardNavigation) {
      setHistoryIndex(prev => prev + 1)
    } else {
      pushHistory({
        mat: params.material,
        building: params.building,
      })
    }
  }, [params, navigate, history, historyIndex, pushHistory])

  const setMat = useCallback(
    (mat: string | undefined) => {
      navigate({
        search: {
          material: mat,
          building: undefined,
        },
      })
    },
    [navigate],
  )
  const setBuilding = useCallback(
    (building: string | undefined) => {
      navigate({
        search: {
          material: undefined,
          building: building,
        },
      })
    },
    [navigate],
  )

  const value = useMemo(() => {
    const canBack = historyIndex > 0
    const canForward = historyIndex < history.length - 1
    const back = () => {
      if (canBack) {
        router.history.back()
        setHistoryIndex(prev => prev - 1)
      }
    }
    const forward = () => {
      if (canForward) {
        router.history.forward()
        setHistoryIndex(prev => prev + 1)
      }
    }
    return {
      cx,
      setCx,
      mat,
      setMat,
      building,
      setBuilding,
      canBack,
      canForward,
      back,
      forward,
    }
  }, [
    historyIndex,
    history.length,
    cx,
    mat,
    setMat,
    building,
    setBuilding,
    router.history,
  ])

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  )
}
