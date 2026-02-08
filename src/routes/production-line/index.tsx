import { createFileRoute } from '@tanstack/react-router'
import { type } from 'arktype'
import { ProductionLineExplorerPage } from '@/components/pages/production-line/explorer'

const searchParamsSchema = type({
  material: 'string?',
  building: 'string?',
})

export const Route = createFileRoute('/production-line/')({
  component: RouteComponent,
  validateSearch: searchParamsSchema,
})

function RouteComponent() {
  return <ProductionLineExplorerPage />
}
