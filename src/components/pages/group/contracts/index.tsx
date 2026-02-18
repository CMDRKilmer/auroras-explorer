import { isHotkeyPressed } from 'react-hotkeys-hook'
import { DataTable } from '@/components/common/data-table'
import { LoadingPage } from '@/components/common/loading'
import { Pagination } from '@/components/common/pagination'
import { ContractDetailInDataTable } from '@/components/game/contract/contract-detail'
import { useGroupContractsPageContext } from './context'
import { GroupContractsPageContextProvider } from './context-provider'
import { Settings } from './settings'

const GroupContractsPageInner = () => {
  const { contractsQuery, table, pagination } = useGroupContractsPageContext()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contracts</h1>

      <Settings />

      {contractsQuery.isLoading && (
        <div>
          <LoadingPage className="min-h-125" />
        </div>
      )}
      {contractsQuery.error && (
        <p className="text-red-500">Error: {contractsQuery.error.message}</p>
      )}
      {contractsQuery.data && (
        <div>
          <DataTable
            table={table}
            collapsibleContent={ContractDetailInDataTable}
            onRowClick={(e, row) => {
              if (isHotkeyPressed('backquote')) {
                e.preventDefault()
                console.log(row.original)
              }
            }}
          />

          <div className="h-4" />

          <Pagination table={table} pagination={pagination} />
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
