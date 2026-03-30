import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export const ErrorPage = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">
          {t('errors.genericTitle')}
        </h2>
        <h3 className="mb-1.5 text-3xl font-semibold">{t('errors.generic')}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {t('errors.genericDescription')}
          <a
            href="mailto:inquires@auroras.xyz"
            target="_blank"
            rel="noopener"
            className="underline"
          >
            contact me
          </a>
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-lg text-base"
          variant="outline"
        >
          <Link to="/">{t('errors.goHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
