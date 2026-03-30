import { useTranslation } from 'react-i18next'
import copy from 'copy-to-clipboard'
import { useCallback, useState, useTransition } from 'react'
import { GameDataLoadingWrapper } from '@/components/common/game-data-loading-wrapper'
import { CommodityExchangeSelect } from '@/components/game/select/cx-select'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { genXitAction } from '@/lib/trade'
import MdiCheck from '~icons/mdi/check'
import MdiContentCopy from '~icons/mdi/content-copy'
import MdiExchange from '~icons/mdi/exchange'
import { useShipmentContext } from './context'
import { ShipmentContextProvider } from './context-provider'
import { ShipmentResultTable } from './result-table'
import { getRows } from './result-table/columns'

const ShipmentPageInner = () => {
  const { t } = useTranslation()
  const {
    fromCX,
    setFromCX,
    toCX,
    setToCX,
    weightCapacity,
    setWeightCapacity,
    volumeCapacity,
    setVolumeCapacity,
    table,
  } = useShipmentContext()
  const [, startTransition] = useTransition()

  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    const acquisitions = getRows(table).map(row => row.original)
    const xitAction = genXitAction(fromCX, acquisitions)
    const ok = copy(JSON.stringify(xitAction))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    }
  }, [fromCX, table])

  return (
    <div className="p-8">
      <div className="flex gap-4 items-end">
        <Field className="w-60">
          <FieldLabel>{t('shipment.sourceCx')}</FieldLabel>
          <CommodityExchangeSelect
            value={fromCX}
            onValueChange={value => {
              startTransition(() => {
                setFromCX(value)
              })
            }}
          />
        </Field>

        <Button
          type="button"
          onClick={() => {
            startTransition(() => {
              setFromCX(toCX)
              setToCX(fromCX)
            })
          }}
          variant="outline"
          size="icon"
        >
          <MdiExchange />
        </Button>

        <Field className="w-60">
          <FieldLabel>{t('shipment.targetCx')}</FieldLabel>
          <CommodityExchangeSelect
            value={toCX}
            onValueChange={value => {
              startTransition(() => {
                setToCX(value)
              })
            }}
          />
        </Field>

        <Field className="w-40">
          <FieldLabel>{t('shipment.weightCapacity')}</FieldLabel>

          <InputGroup>
            <InputGroupInput
              value={weightCapacity}
              onChange={e => {
                startTransition(() => {
                  setWeightCapacity(Number(e.target.value))
                })
              }}
              type="number"
              step={500}
              min={0}
              max={1000000}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>t</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <Field className="w-40">
          <FieldLabel>{t('shipment.volumeCapacity')}</FieldLabel>

          <InputGroup>
            <InputGroupInput
              value={volumeCapacity}
              onChange={e => {
                startTransition(() => {
                  setVolumeCapacity(Number(e.target.value))
                })
              }}
              type="number"
              step={100}
              min={0}
              max={1000000}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>m³</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <div className="text-sm">
            {t('shipment.items', { count: getRows(table).length })}
          </div>
          <Button className="" variant="outline" onClick={handleCopy}>
            {copied ? (
              <>
                <MdiCheck className="size-5!" />
                {t('common.copied')}
              </>
            ) : (
              <>
                <MdiContentCopy className="size-5!" />
                {t('shipment.copyXitAction')}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <ShipmentResultTable />
      </div>
    </div>
  )
}

export const ShipmentPage = () => {
  return (
    <GameDataLoadingWrapper>
      <ShipmentContextProvider>
        <ShipmentPageInner />
      </ShipmentContextProvider>
    </GameDataLoadingWrapper>
  )
}
