import { useTranslation } from 'react-i18next'
import { AppBreadcrumb } from '@/components/common/breadcrumb/app-breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconBrandGithub, IconLanguage } from '@tabler/icons-react'

export function SiteHeader() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const toggleLanguage = (lang: 'en' | 'zh') => {
    i18n.changeLanguage(lang)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <AppBreadcrumb />

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={currentLang === 'en' ? '切换语言' : 'Switch Language'}
              >
                <IconLanguage className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => toggleLanguage('en')}
                className={currentLang === 'en' ? 'bg-accent' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleLanguage('zh')}
                className={currentLang === 'zh' ? 'bg-accent' : ''}
              >
                中文
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" asChild size="icon">
            <a
              href="https://github.com/illustrix/auroras-explorer"
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconBrandGithub className="size-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
