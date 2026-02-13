import { IconInnerShadowTop } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
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
import { useLocalStorage } from '@/hooks/use-storage'
import { formatTime } from '@/lib/format'
import TablerBrandDiscord from '~icons/tabler/brand-discord'
import { NavMain } from './nav-main'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dataUpdatedAt = useLocalStorage<number>('ct-orders')
  const navigates = useNavigates()

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
            <div>Data Updated:</div>
            <span>{formatTime(dataUpdatedAt ?? 0)}</span>
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
        {/* <NavUser
          user={{
            name: 'Charlie Nguyen',
            email: 'var(--action-hover)',
            avatar: 'https://i.pravatar.cc/150?u=charlie.n',
          }}
        /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
