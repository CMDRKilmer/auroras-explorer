import { useTranslation } from 'react-i18next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/motion-tabs'
import { ContractTags } from '@/lib/constants'
import { defaultColumnVisibility } from './column-visibility'
import { useGroupContractsPageContext } from './context'

export const ContractPageTabs = () => {
  const { t } = useTranslation()
  const { setType, setTags, setStatus, table } = useGroupContractsPageContext()

  const tabs: {
    value: string
    label: string
    view: Record<string, boolean>
    type?: string
    status?: string
    tags?: string[]
  }[] = [
    {
      value: 'all',
      label: t('group.contracts.all'),
      view: defaultColumnVisibility,
      type: 'All',
      status: 'All',
    },
    {
      value: 'supply',
      label: t('group.contracts.supplyRequest'),
      view: {
        ...defaultColumnVisibility,
        Items: true,
        Location: true,
        Valid: true,
      },
      type: 'Trading',
      status: 'Valid',
      tags: [ContractTags.PRICE_TOO_LOW],
    },
    {
      value: 'shipment',
      label: t('group.contracts.shipment'),
      view: {
        ...defaultColumnVisibility,
        Location: true,
      },
      type: 'Shipment',
      status: 'All',
    },
  ]

  return (
    <Tabs className="mb-4">
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => {
              table.setColumnVisibility(tab.view)
              table.resetPageIndex()
              if (tab.type) {
                setType(tab.type)
              }
              if (tab.status) {
                setStatus(tab.status)
              }
              setTags(tab.tags || [])
            }}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
