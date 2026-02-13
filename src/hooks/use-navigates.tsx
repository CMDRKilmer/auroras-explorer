import ProductionLinePreviewImg from '@/assets/images/production-line-preview.webp'
import ShipmentPreviewImg from '@/assets/images/shipment-preview.webp'
import HugeiconsCargoShip from '~icons/hugeicons/cargo-ship'
import MdiCompassOutline from '~icons/mdi/compass-outline'
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
      title: 'Group Contracts',
      url: '/group/contracts/',
      icon: MdiInvoiceListOutline,
      category: 'Group Tools',
    },
  ]
}
