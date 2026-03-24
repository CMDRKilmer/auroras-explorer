import { createFileRoute } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import GroupListPage from '@/components/pages/group/group-list-page'

export const Route = createFileRoute('/group/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <RequireAuth>
      <GroupListPage />
    </RequireAuth>
  )
}
