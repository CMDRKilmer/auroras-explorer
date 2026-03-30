import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { externalTools, tools } from './tools'

export const ToolsGallery: FC<{ tools: typeof tools }> = ({ tools }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {tools.map(item => {
        if (!item.preview) {
          return null
        }
        return (
          <Link
            key={item.url}
            to={item.url}
            className="border border-border rounded-lg hover:outline transition-all flex flex-col gap-2 group overflow-hidden"
            target="_blank"
            rel="noopener"
          >
            <div className="overflow-hidden w-full h-60 rounded-lg bg-muted/50">
              <img
                alt={`preview of ${item.title}`}
                src={item.preview}
                className="w-full h-60 group-hover:scale-110 transition-all"
              />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex items-center">
                <item.icon className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                {item.description}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export const ToolGalleryPage = () => {
  const { t } = useTranslation()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{t('home.welcome')}</h1>
      <p className="mt-4 text-muted-foreground">{t('home.description')}</p>
      <ToolsGallery tools={tools} />

      <h2 className="mt-8 text-xl font-semibold">{t('home.featuredTools')}</h2>
      <p className="mt-4 text-muted-foreground">
        {t('home.featuredToolsDescription')}
      </p>

      <ToolsGallery tools={externalTools} />

      <div className="mt-8 text-sm text-muted-foreground">
        {t('home.contactSuggestion')}
      </div>
    </div>
  )
}
