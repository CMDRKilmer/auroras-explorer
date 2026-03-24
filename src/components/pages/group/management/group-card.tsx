import { Link } from '@tanstack/react-router'
import { SettingsIcon } from 'lucide-react'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { useGroupTools } from '@/hooks/use-navigates'
import type { Group } from '@/lib/api/types'

export const GroupCard: FC<{
  group: Group
  onEdit: (group: Group) => void
}> = ({ group, onEdit }) => {
  const groupTools = useGroupTools()

  return (
    <div className="flex flex-col gap-2 px-4 py-2 border rounded-md group">
      <div className="flex items-center gap-4">
        <span className="font-medium text-xl">{group.name}</span>
        <span className="text-muted-foreground">
          FIO Group: {group.fioGroupId}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <Button variant="ghost" onClick={() => onEdit(group)}>
            <SettingsIcon />
            Edit
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        {groupTools.map(tool => {
          return (
            <Button key={tool.title} variant="outline" size="sm" asChild>
              <Link
                to={tool.url}
                params={{
                  groupId: group.fioGroupId,
                }}
              >
                {tool.icon && <tool.icon className="mr-1 size-4" />}
                {tool.title}
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
