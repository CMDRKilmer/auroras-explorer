import { startCase } from 'es-toolkit/string'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { MaterialSelector } from '@/components/game/material-selector'
import { CommodityExchangeSelect } from '@/components/game/select/cx-select'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGameData } from '@/lib/store'
import { useExplorerContext } from './context'

export const Setting: FC = () => {
  const { t } = useTranslation()
  const { data } = useGameData()
  const { cx, setCx, mat, setMat, building, setBuilding } = useExplorerContext()

  return (
    <div className="flex gap-4">
      <Field className="w-60">
        <FieldLabel>{t('productionLine.commodityExchange')}</FieldLabel>
        <CommodityExchangeSelect
          value={cx}
          onValueChange={value => {
            setCx(value)
          }}
        />
      </Field>

      <Field className="w-50">
        <FieldLabel>{t('productionLine.material')}</FieldLabel>
        <MaterialSelector
          materials={data?.materials || []}
          value={mat}
          onValueChange={value => {
            setMat(value)
          }}
        />
      </Field>

      <Field className="w-60">
        <FieldLabel>{t('productionLine.building')}</FieldLabel>

        <Select
          value={building || ''}
          onValueChange={value => {
            setBuilding(value)
          }}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder={t('productionLine.selectBuilding')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {data?.buildings.map(building => {
                return (
                  <SelectItem key={building.Ticker} value={building.Ticker}>
                    {building.Ticker} ({startCase(building.Name)})
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}
