import { createFileRoute } from '@tanstack/react-router'
import { GroupMembersPage } from '@/components/pages/group/members'

export const Route = createFileRoute('/group/{-$groupId}/members/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GroupMembersPage />
}
