import { useQuery } from '@tanstack/react-query'
import { Link, useMatchRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRightIcon, UsersIcon } from 'lucide-react'
import type { FC } from 'react'
import { LoadingPage } from '@/components/common/loading'
import { Button } from '@/components/ui/button'
import { useGroupTools } from '@/hooks/use-navigates'
import { myGroupsQuery } from '@/lib/query/group'

export const GroupSelector: FC = () => {
  const { t } = useTranslation()
  const groupsQuery = useQuery(myGroupsQuery())
  const groups = groupsQuery.data ?? []
  const groupTools = useGroupTools()
  const matchRoute = useMatchRoute()

  const currentTool = groupTools.find(tool =>
    matchRoute({ to: tool.url, fuzzy: true }),
  )

  if (groupsQuery.isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="w-full flex justify-center">
      <div className="p-6 flex-1 max-w-xl flex flex-col gap-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {currentTool ? t(currentTool.titleKey) : t('nav.groupTools')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select a group to continue.
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <UsersIcon className="text-muted-foreground size-10" />
            <p className="text-muted-foreground text-sm">
              You don't have any groups yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {groups.map(group => (
              <Button
                key={group.id}
                variant="outline"
                className="justify-start h-auto py-3"
                asChild
              >
                <Link
                  to={currentTool?.url ?? '/group/{-$groupId}/contracts/'}
                  params={{ groupId: group.fioGroupId }}
                >
                  <UsersIcon className="mr-2 size-4 shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{group.name}</span>
                    <span className="text-muted-foreground text-xs">
                      FIO Group: {group.fioGroupId}
                    </span>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        )}

        <Button variant="ghost" asChild>
          <Link to="/group/{-$groupId}" params={{ groupId: '' }}>
            {t('nav.groupList')}
            <ArrowRightIcon className="mr-1 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
