import { useQuery } from '@tanstack/react-query'
import { ContractTable } from '@/components/game/contract/contract-table'
import { groupContractsQuery } from '@/lib/query/contract'
import { useGroupContractsPageContext } from './context'
import { GroupContractsPageContextProvider } from './context-provider'
import { Settings } from './settings'

const GroupContractsPageInner = () => {
  const { usernames } = useGroupContractsPageContext()

  const {
    data: contracts,
    isLoading,
    error,
  } = useQuery(
    groupContractsQuery({
      groupId: '873386',
      order: '-DateEpochMs',
      types: ['TRADING', 'BUYING', 'SELLING', 'SHIPMENT'],
      usernames: usernames.length > 0 ? usernames : undefined,
    }),
  )

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contracts</h1>

      <Settings />

      {isLoading && <p>Loading contracts...</p>}
      {error && (
        <p className="text-red-500">Error: {(error as Error).message}</p>
      )}
      {contracts && (
        <div>
          <ContractTable contracts={contracts.items} />
        </div>
      )}
    </div>
  )
}

export const GroupContractsPage = () => {
  return (
    <GroupContractsPageContextProvider>
      <GroupContractsPageInner />
    </GroupContractsPageContextProvider>
  )
}
