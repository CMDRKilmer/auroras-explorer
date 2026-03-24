import { createFileRoute, Outlet } from '@tanstack/react-router'
import { RequireGroupAuth } from '@/components/auth/require-auth'
import { GroupSelector } from '@/components/pages/group/management/group-selector'

export const Route = createFileRoute('/group/{-$groupId}')({
  component: RouteComponent,
})

function RouteComponent() {
  const { groupId } = Route.useParams()

  if (!groupId || groupId === '_') {
    return <GroupSelector />
  }

  return (
    <RequireGroupAuth>
      <Outlet />
    </RequireGroupAuth>
  )
}
