import { useQuery } from '@tanstack/react-query'
import { ContractList } from '@/components/game/contract/contract-list'
import { userContractsQuery } from '@/lib/query/contract'

export const GroupContractsPage = () => {
  const {
    data: contracts,
    isLoading,
    error,
  } = useQuery(
    userContractsQuery({
      usernames: ['IVY_EXE'],
      order: '-DateEpochMs',
    }),
  )

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Group Contracts</h1>
      {isLoading && <p>Loading contracts...</p>}
      {error && (
        <p className="text-red-500">Error: {(error as Error).message}</p>
      )}
      {contracts && (
        <div>
          <ContractList contracts={contracts} />
        </div>
      )}
    </div>
  )
}
