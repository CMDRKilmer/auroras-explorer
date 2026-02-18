import ProductionLinePreviewImg from '@/assets/images/production-line-preview.webp'
import ShipmentPreviewImg from '@/assets/images/shipment-preview.webp'
import HugeiconsCargoShip from '~icons/hugeicons/cargo-ship'
import MdiAccountGroupOutline from '~icons/mdi/account-group-outline'
import MdiCompassOutline from '~icons/mdi/compass-outline'
import MdiDollar from '~icons/mdi/dollar'
import MdiInvoiceListOutline from '~icons/mdi/invoice-list-outline'

export const useNavigates = () => {
  return [
    {
      title: 'Shipment',
      url: '/shipment',
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
      title: 'Group Members',
      url: '/group/873386/members/',
      icon: MdiAccountGroupOutline,
      category: 'Group Tools',
    },
    {
      title: 'Group Contracts',
      url: '/group/873386/contracts/',
      icon: MdiInvoiceListOutline,
      category: 'Group Tools',
    },
    {
      title: 'Price Watch',
      url: '/group/873386/price-watch/',
      icon: MdiDollar,
      category: 'Group Tools',
    },
  ]
}
