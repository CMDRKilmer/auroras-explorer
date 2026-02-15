import type { FC } from 'react'
import './loading.css'
import { cn } from '@/lib/utils'

export const Loading = () => {
  return <span className="loading-spinner"></span>
}

export const LoadingPage: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        className,
      )}
    >
      <Loading />
    </div>
  )
}
