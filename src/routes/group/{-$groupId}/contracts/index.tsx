import { createFileRoute } from '@tanstack/react-router'
import { GroupContractsPage } from '@/components/pages/group/contracts'

export const Route = createFileRoute('/group/{-$groupId}/contracts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GroupContractsPage />
}
