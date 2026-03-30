import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/result'

interface GroupEmptyStateProps {
  onCreate: () => void
}

export const GroupEmptyState: FC<GroupEmptyStateProps> = ({ onCreate }) => {
  const { t } = useTranslation()
  return (
    <EmptyState
      icon={<div className="text-4xl">📦</div>}
      title={t('group.list.empty.title')}
      description={t('group.list.empty.description')}
      action={
        <Button onClick={onCreate}>{t('group.list.empty.createButton')}</Button>
      }
    />
  )
}
