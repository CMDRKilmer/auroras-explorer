import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/motion-tabs'
import { useGroupContractsPageContext } from './context'

const views = [
  {
    title: 'All Contracts',
    type: 'All',
    status: 'All',
  },
  {
    title: 'Price Watch',
    type: 'Trading',
    status: 'All',
  },
]

export const ContractsPageViews = () => {
  const { setType, setStatus } = useGroupContractsPageContext()
  const [view, setView] = useState(views[0].title)

  return (
    <Tabs
      value={view}
      onValueChange={value => {
        setView(value)
        const view = views.find(view => view.title === value)
        if (!view) return

        setType(view.type)
        setStatus(view.status)
      }}
    >
      <TabsList>
        {views.map(view => {
          return (
            <TabsTrigger key={view.title} value={view.title}>
              {view.title}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
