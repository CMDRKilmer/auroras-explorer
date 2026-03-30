import type { FC, ReactNode } from 'react'

export const ResultPage: FC<{
  title?: string
  description?: ReactNode
}> = ({ title, description }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-prose">
        <h1 className="text-2xl font-bold">{title}</h1>

        <div className="text-muted-foreground mt-8 whitespace-pre-wrap">
          {description}
        </div>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-prose gap-4">
        {icon && <div className="text-4xl">{icon}</div>}
        {title && <h1 className="text-2xl font-bold">{title}</h1>}
        {description && (
          <div className="text-muted-foreground whitespace-pre-wrap">
            {description}
          </div>
        )}
        {action}
      </div>
    </div>
  )
}
