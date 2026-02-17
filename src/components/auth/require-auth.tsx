import type { FC, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/use-storage'
import { LoginForm } from './login-form'

export const RequireAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const token = useLocalStorage('token')
  if (!token) {
    return <LoginForm />
  }

  return <>{children}</>
}
