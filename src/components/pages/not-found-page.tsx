import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'

export const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">{t('errors.notFound')}</h2>
        <Button
          asChild
          size="lg"
          className="rounded-lg text-base mt-6"
          variant="outline"
        >
          <Link className="rounded-lg text-base" to="/" replace>
            {t('errors.goHome')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
