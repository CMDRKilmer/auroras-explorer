import { useTranslation } from 'react-i18next'
import { Link, useMatches } from '@tanstack/react-router'
import { type ComponentType, useMemo } from 'react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const PLACEHOLDER_GROUP_ID = '_'

export function NavMain({
  items,
}: {
  items: {
    titleKey: string
    url: string
    icon?: ComponentType
    categoryKey: string
  }[]
}) {
  const { t } = useTranslation()
  const matches = useMatches()

  const groupId = useMemo(() => {
    const match = matches.find(match => 'groupId' in match.params)
    if (match) {
      return (match.params as { groupId: string }).groupId
    }
  }, [matches])

  const groupedItems = useMemo(() => {
    const grouped = Object.groupBy(
      items,
      item => item.categoryKey ?? 'nav.other',
    )

    return Object.entries(grouped).map(([categoryKey, items]) => ({
      categoryKey,
      items,
    }))
  }, [items])

  return groupedItems.map(group => {
    if (!group.items) return null
    return (
      <SidebarGroup key={group.categoryKey}>
        <SidebarGroupLabel>{t(group.categoryKey)}</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {group.items.map(item => {
              const isActive = matches.some(
                match => match.fullPath === item.url,
              )
              const translatedTitle = t(item.titleKey)

              return (
                <Link
                  to={item.url}
                  key={item.titleKey}
                  params={{ groupId: groupId ?? PLACEHOLDER_GROUP_ID }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={translatedTitle}
                    >
                      {item.icon && <item.icon />}
                      <span>{translatedTitle}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  })
}
