import { Tabs, TabsList, TabsTrigger } from '@/components/ui/motion-tabs'
import { ContractTags } from '@/lib/constants'
import { defaultColumnVisibility } from './column-visibility'
import { useGroupContractsPageContext } from './context'

export const ContractPageTabs = () => {
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
      label: 'All Contracts',
      view: defaultColumnVisibility,
      type: 'All',
      status: 'All',
    },
    {
      value: 'supply',
      label: 'Supply Request',
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
      label: 'Shipment',
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
