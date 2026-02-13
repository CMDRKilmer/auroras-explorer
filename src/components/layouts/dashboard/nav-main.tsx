import {
  isMatch,
  Link,
  useMatches,
  useMatchRoute,
  useRouterState,
} from '@tanstack/react-router'
import { type ComponentType, useMemo } from 'react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: ComponentType
    category?: string
  }[]
}) {
  const matches = useMatches()

  const groupedItems = useMemo(() => {
    const grouped = Object.groupBy(items, item => item.category ?? 'Other')

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }))
  }, [items])

  return groupedItems.map(group => {
    if (!group.items) return null
    return (
      <SidebarGroup key={group.category}>
        <SidebarGroupLabel>{group.category}</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {group.items.map(item => {
              const isActive = matches.some(
                match => match.pathname === item.url,
              )

              return (
                <Link to={item.url} key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
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
