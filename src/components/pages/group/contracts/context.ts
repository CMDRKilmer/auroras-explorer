import { createContext, useContext } from 'react'

export const GroupContractsPageContext = createContext<{
  usernames: string[]
  setUsernames: (usernames: string[]) => void
}>({
  usernames: [],
  setUsernames: () => {},
})

export const useGroupContractsPageContext = () => {
  return useContext(GroupContractsPageContext)
}
