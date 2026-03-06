import { IconInnerShadowTop } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { Time } from '@/components/common/time'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useNavigates } from '@/hooks/use-navigates'
import { setItem, useLocalStorage } from '@/hooks/use-storage'
import { queryClient } from '@/lib/query'
import { identityQuery, useIdentity } from '@/lib/query/user'
import MdiLogoutVariant from '~icons/mdi/logout-variant'
import TablerBrandDiscord from '~icons/tabler/brand-discord'
import { NavMain } from './nav-main'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dataUpdatedAt = useLocalStorage<number>('ct:orders')
  const navigates = useNavigates()
  const identity = useIdentity()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">
                  Auroras Explorer
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigates} />
      </SidebarContent>
      <SidebarFooter>
        <div className="text-muted-foreground flex flex-col text-xs gap-4">
          <div>
            <span>Data Updated:</span> <Time time={dataUpdatedAt ?? 0} />
          </div>
          <span>
            Data Source:{' '}
            <a
              href="https://fio.fnar.net/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              FIO API
            </a>
          </span>
          <div>
            <div>Feedback Welcome!</div>
            <a
              href="https://discord.gg/BMtwkgUY6D"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 underline"
            >
              <TablerBrandDiscord className="inline-block" /> PrUn Community
              Tools #auroras-explorer
            </a>
          </div>
        </div>

        {identity.data && (
          <div className="mt-4 text-xs text-muted-foreground gap-1 flex items-center">
            Logged in as
            <span className="underline">{identity.data.username}</span>
            <Button
              type="button"
              className="ml-4 underline cursor-pointer"
              onClick={() => {
                setItem('token', undefined)
                queryClient.invalidateQueries(identityQuery())
              }}
              size="xs"
              variant="ghost"
            >
              <MdiLogoutVariant />
              logout
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
