import { type FC, type ReactNode, useMemo, useState } from 'react'
import { GroupContractsPageContext } from './context'

export const GroupContractsPageContextProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [usernames, setUsernames] = useState<string[]>([])

  const value = useMemo(() => {
    return {
      usernames,
      setUsernames,
    }
  }, [usernames])

  return (
    <GroupContractsPageContext.Provider value={value}>
      {children}
    </GroupContractsPageContext.Provider>
  )
}
