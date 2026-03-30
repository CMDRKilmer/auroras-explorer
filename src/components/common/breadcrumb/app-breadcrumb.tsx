import { useQuery } from '@tanstack/react-query'
import { Link, useMatches } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useGroupTools, useNavigates } from '@/hooks/use-navigates'
import { myGroupsQuery } from '@/lib/query/group'

const useGroupName = (groupId: string | undefined) => {
  const { data: groups } = useQuery(myGroupsQuery())
  if (!groupId || groupId === '_') return undefined
  return groups?.find(g => g.fioGroupId === groupId)?.name
}

const useBreadcrumbs = () => {
  const { t } = useTranslation()
  const matches = useMatches()
  const groupTools = useGroupTools()
  const navigates = useNavigates()

  const groupId = useMemo(() => {
    const match = matches.find(m => 'groupId' in m.params)
    return match ? (match.params as { groupId: string }).groupId : undefined
  }, [matches])

  const groupName = useGroupName(groupId)

  return useMemo(() => {
    const crumbs: {
      label: string
      to?: string
      params?: Record<string, string>
    }[] = []

    const leafMatch = matches[matches.length - 1]
    if (!leafMatch || leafMatch.fullPath === '/') return crumbs

    // For group sub-routes: Groups > GroupName > Tool
    if (groupId && groupId !== '_') {
      crumbs.push({ label: t('nav.groups'), to: '/group/' })
      crumbs.push({
        label: groupName ?? groupId,
        to: '/group/{-$groupId}/members/',
        params: { groupId },
      })

      const groupTool = groupTools.find(t => t.url === leafMatch.fullPath)
      if (groupTool) {
        crumbs.push({ label: t(groupTool.titleKey) })
      }
      return crumbs
    }

    // For non-group routes, find the nav item label
    const navItem = navigates.find(n => n.url === leafMatch.fullPath)
    if (navItem) {
      crumbs.push({ label: t(navItem.titleKey) })
    }

    return crumbs
  }, [matches, groupId, groupName, groupTools, navigates, t])
}

export const AppBreadcrumb = () => {
  const breadcrumbs = useBreadcrumbs()

  if (breadcrumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1
          return (
            <BreadcrumbItem key={crumb.label}>
              {i > 0 && <BreadcrumbSeparator />}
              {isLast || !crumb.to ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.to} params={crumb.params}>
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
