import { isHotkeyPressed } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/common/data-table'
import { inspect } from '@/components/common/dialog'
import { LoadingPage } from '@/components/common/loading'
import { Pagination } from '@/components/common/pagination'
import { ContractDetailInDataTable } from '@/components/game/contract/contract-detail'
import { useGroupContractsPageContext } from './context'
import { GroupContractsPageContextProvider } from './context-provider'
import { Settings } from './settings'
import { ContractPageTabs } from './tabs'

const GroupContractsPageInner = () => {
  const { t } = useTranslation()
  const { contractsQuery, table, pagination } = useGroupContractsPageContext()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('group.contracts.title')}</h1>

      <ContractPageTabs />

      <Settings />

      {contractsQuery.isLoading && (
        <div>
          <LoadingPage className="min-h-125" />
        </div>
      )}
      {contractsQuery.error && (
        <p className="text-red-500">
          {t('common.error')}: {contractsQuery.error.message}
        </p>
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
                inspect(row.original)
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
