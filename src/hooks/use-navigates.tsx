import ProductionLinePreviewImg from '@/assets/images/production-line-preview.webp'
import ShipmentPreviewImg from '@/assets/images/shipment-preview.webp'
import HugeiconsCargoShip from '~icons/hugeicons/cargo-ship'
import MdiAccountGroupOutline from '~icons/mdi/account-group-outline'
import MdiCompassOutline from '~icons/mdi/compass-outline'
import MdiDollar from '~icons/mdi/dollar'
import MdiFileDocumentOutline from '~icons/mdi/file-document-outline'
import MdiInvoiceListOutline from '~icons/mdi/invoice-list-outline'
import MdiListBoxOutline from '~icons/mdi/list-box-outline'
import MdiPlannerOutline from '~icons/mdi/planner-outline'

export const useGroupTools = () => {
  return [
    {
      title: 'Group Members',
      url: '/group/{-$groupId}/members/',
      icon: MdiAccountGroupOutline,
      category: 'Group Tools',
    },
    {
      title: 'Group Contracts',
      url: '/group/{-$groupId}/contracts/',
      icon: MdiInvoiceListOutline,
      category: 'Group Tools',
    },
    {
      title: 'Price Watch',
      url: '/group/{-$groupId}/price-watch/',
      icon: MdiDollar,
      category: 'Group Tools',
    },
    {
      title: 'Group Plan',
      url: '/group/{-$groupId}/plan/',
      icon: MdiPlannerOutline,
      category: 'Group Tools',
    },
  ]
}

export const useNavigates = () => {
  const groupTools = useGroupTools()

  return [
    {
      title: 'Shipment',
      url: '/shipment/',
      icon: HugeiconsCargoShip,
      preview: ShipmentPreviewImg,
      description:
        'Calculation of optimal transportation plans for commodities between exchanges.',
      category: 'Explorer Tools',
    },
    {
      title: 'Production Line',
      url: '/production-line/',
      icon: MdiCompassOutline,
      preview: ProductionLinePreviewImg,
      description: 'Visualization of production lines and their dependencies.',
      category: 'Explorer Tools',
    },
    {
      title: 'Catalog',
      url: '/catalog/',
      icon: MdiFileDocumentOutline,
      description: 'Browse all materials in the game and their details.',
      category: 'Explorer Tools',
    },
    {
      title: 'Group List',
      url: '/group/',
      icon: MdiListBoxOutline,
      category: 'Group Tools',
    },
    ...groupTools,
  ]
}
