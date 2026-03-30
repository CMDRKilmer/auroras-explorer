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
import MdiSwapHorizontal from '~icons/mdi/swap-horizontal'

export const useGroupTools = () => {
  return [
    {
      titleKey: 'nav.groupMembers',
      url: '/group/{-$groupId}/members/',
      icon: MdiAccountGroupOutline,
      categoryKey: 'nav.groupTools',
    },
    {
      titleKey: 'nav.groupContracts',
      url: '/group/{-$groupId}/contracts/',
      icon: MdiInvoiceListOutline,
      categoryKey: 'nav.groupTools',
    },
    {
      titleKey: 'nav.priceWatch',
      url: '/group/{-$groupId}/price-watch/',
      icon: MdiDollar,
      categoryKey: 'nav.groupTools',
    },
    {
      titleKey: 'nav.groupPlan',
      url: '/group/{-$groupId}/plan/',
      icon: MdiPlannerOutline,
      categoryKey: 'nav.groupTools',
    },
  ]
}

export const useNavigates = () => {
  const groupTools = useGroupTools()

  return [
    {
      titleKey: 'nav.shipment',
      url: '/shipment/',
      icon: HugeiconsCargoShip,
      preview: ShipmentPreviewImg,
      description:
        'Calculation of optimal transportation plans for commodities between exchanges.',
      categoryKey: 'nav.explorerTools',
    },
    {
      titleKey: 'nav.productionLine',
      url: '/production-line/',
      icon: MdiCompassOutline,
      preview: ProductionLinePreviewImg,
      description: 'Visualization of production lines and their dependencies.',
      categoryKey: 'nav.explorerTools',
    },
    {
      titleKey: 'nav.catalog',
      url: '/catalog/',
      icon: MdiFileDocumentOutline,
      description: 'Browse all materials in the game and their details.',
      categoryKey: 'nav.explorerTools',
    },
    {
      titleKey: 'nav.groupList',
      url: '/group/',
      icon: MdiListBoxOutline,
      categoryKey: 'nav.groupTools',
    },
    ...groupTools,
    {
      titleKey: 'nav.configTransform',
      url: '/config-transform/',
      icon: MdiSwapHorizontal,
      description: 'Transform 3rd party config JSON into target format.',
      categoryKey: 'nav.miscTools',
    },
  ]
}
