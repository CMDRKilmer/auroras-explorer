import type { FC, ReactNode } from 'react'
import { formatSize } from '@/lib/format'
import { useDataLoadingState, useGameData } from '@/lib/store'

export const GameDataLoadingWrapper: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isLoading } = useGameData()
  const { progress, rate } = useDataLoadingState()

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-lg font-medium">
        Loading Necessary Data...
        <div
          className="hidden"
          // TODO: show loading progress
        >
          {progress.toFixed(2)}% @ {formatSize(rate)}/s
        </div>
      </div>
    )
  }

  return <>{children}</>
}
