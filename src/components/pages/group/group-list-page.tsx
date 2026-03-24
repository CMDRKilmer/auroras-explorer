import { useQuery } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { LoadingPage } from '@/components/common/loading'
import { Button } from '@/components/ui/button'
import type { Group } from '@/lib/api/types'
import { myGroupsQuery } from '@/lib/query/group'
import { useIdentity } from '@/lib/query/user'
import { GroupCard } from './management/group-card'
import { GroupEmptyState } from './management/group-empty-state'
import { GroupFormDialog } from './management/group-form-dialog'

const GroupListPage = () => {
  const identity = useIdentity()
  const groupsQuery = useQuery(myGroupsQuery())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group>()

  const openCreate = () => {
    setEditingGroup(undefined)
    setDialogOpen(true)
  }

  const openEdit = (group: Group) => {
    setEditingGroup(group)
    setDialogOpen(true)
  }

  if (groupsQuery.isLoading) {
    return <LoadingPage />
  }

  const groups = groupsQuery.data ?? []

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Groups List</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Hi, {identity.data?.username}. This is a collaboration tool for
            viewing and managing contracts and plans with your group members.
            You can create a group on FIO. Create a token and set it here, then
            you can view the group's contracts and plans, and manage them
            together.
          </p>
        </div>
      </div>

      {groups.length === 0 ? (
        <GroupEmptyState onCreate={openCreate} />
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map(group => (
            <GroupCard key={group.id} group={group} onEdit={openEdit} />
          ))}
        </div>
      )}

      <Button onClick={openCreate} variant="outline">
        <PlusIcon className="mr-1 size-4" />
        New Group
      </Button>

      <GroupFormDialog
        key={editingGroup?.id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        group={editingGroup}
      />
    </div>
  )
}

export default GroupListPage
