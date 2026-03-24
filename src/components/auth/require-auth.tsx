import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import type { FC, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/use-storage'
import { groupUsersQuery } from '@/lib/query/group'
import { useIdentity } from '@/lib/query/user'
import { LoadingPage } from '../common/loading'
import { ResultPage } from '../common/result'
import { LoginForm } from './login-form'

const routeApi = getRouteApi('/group/{-$groupId}')

export const RequireGroupAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const token = useLocalStorage('token')

  const { groupId = '' } = routeApi.useParams()
  const { error } = useQuery(groupUsersQuery(groupId))

  if (!token) {
    return <LoginForm />
  }

  if (error) {
    return (
      <ResultPage
        title="You don't have permission to access this page"
        description={`Current group tools are still in development, only available to invited users.
If you are interested in it, please contact me on Discord.`}
      />
    )
  }

  return <>{children}</>
}

export const RequireAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const token = useLocalStorage('token')

  const identity = useIdentity()

  if (!token) {
    return <LoginForm />
  }

  if (identity.isLoading) {
    return <LoadingPage />
  }

  if (identity.error) {
    return (
      <ResultPage
        title="Authentication Error"
        description={`There was an error fetching your identity. Please try logging in again.`}
      />
    )
  }

  return <>{children}</>
}
