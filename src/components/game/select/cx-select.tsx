import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGameData } from '@/lib/store'

interface CommodityExchangeSelectProps {
  value?: string
  onValueChange: (value: string) => void
}

export const CommodityExchangeSelect: FC<CommodityExchangeSelectProps> = ({
  value: cx,
  onValueChange: setCx,
}) => {
  const { t } = useTranslation()
  const { data } = useGameData()

  return (
    <Select value={cx} onValueChange={value => setCx(value)}>
      <SelectTrigger className="w-full max-w-xs">
        <SelectValue placeholder={t('game.selectCommodityExchange')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data?.exchanges.map(exchange => {
            return (
              <SelectItem
                key={exchange.ExchangeCode}
                value={exchange.ExchangeCode}
              >
                {exchange.ExchangeCode} ({exchange.LocationName})
              </SelectItem>
            )
          }) ?? (
            <SelectItem value="loading" disabled>
              {t('game.loading')}
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
