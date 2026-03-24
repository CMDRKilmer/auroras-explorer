import { PlusIcon, UsersIcon } from 'lucide-react'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const GroupEmptyState: FC<{
  onCreate: () => void
}> = ({ onCreate }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <UsersIcon className="text-muted-foreground mb-3 size-10" />
        <p className="text-muted-foreground mb-4 text-sm">
          You don't have any groups yet.
        </p>
        <Button variant="outline" onClick={onCreate}>
          <PlusIcon className="mr-1.5 size-4" />
          Create your first group
        </Button>
      </CardContent>
    </Card>
  )
}
