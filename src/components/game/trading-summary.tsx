import { snakeCase } from 'es-toolkit'
import { type FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getTradingSummariesByMaterial } from '@/lib/calculation'
import { useGameData } from '@/lib/store'
import { Spinner } from '../ui/spinner'

export const TradingSummary: FC<{ ticker: string; thin?: boolean }> = ({
  ticker,
  thin,
}) => {
  const { t } = useTranslation()
  const { data } = useGameData()
  const orders = useMemo(() => {
    if (!data) return
    const orders = getTradingSummariesByMaterial(data, ticker)
    if (thin) return orders.slice(0, 4)
    return orders
  }, [data, ticker, thin])

  const formatNumber = useCallback(
    (num: number) => {
      if (thin) {
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
        if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
      }
      return num.toLocaleString()
    },
    [thin],
  )

  const maxAsk = useMemo(() => {
    if (!orders) return 0
    return Math.max(...orders.map(o => o.Ask || 0))
  }, [orders])
  const minAsk = useMemo(() => {
    if (!orders) return 0
    return Math.min(...orders.map(o => o.Ask || Infinity))
  }, [orders])
  const maxBid = useMemo(() => {
    if (!orders) return 0
    return Math.max(...orders.map(o => o.Bid || 0))
  }, [orders])
  const minBid = useMemo(() => {
    if (!orders) return 0
    return Math.min(...orders.map(o => o.Bid || Infinity))
  }, [orders])

  if (!orders) return null

  return (
    <Table className="font-mono">
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          {orders.map(order => (
            <TableHead key={order.ExchangeCode}>{order.ExchangeCode}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{t('game.ask')}</TableCell>
          {orders.map(order => (
            <TableCell key={order.ExchangeCode}>
              {order.Ask ? (
                <span
                  className="text-sm text-destructive"
                  style={{
                    opacity:
                      maxAsk === minAsk
                        ? 1
                        : 0.5 +
                          (0.5 * (maxAsk - order.Ask)) / (maxAsk - minAsk),
                  }}
                >
                  ${formatNumber(order.Ask)}
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>{t('game.bid')}</TableCell>
          {orders.map(order => (
            <TableCell key={order.ExchangeCode}>
              {order.Bid ? (
                <span
                  className="text-sm text-success"
                  style={{
                    opacity:
                      maxBid === minBid
                        ? 1
                        : 0.5 +
                          (0.5 * (order.Bid - minBid)) / (maxBid - minBid),
                  }}
                >
                  ${formatNumber(order.Bid)}
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>{t('game.supply')}</TableCell>
          {orders.map(order => (
            <TableCell key={order.ExchangeCode}>
              {formatNumber(order.Supply)}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>{t('game.demand')}</TableCell>
          {orders.map(order => (
            <TableCell key={order.ExchangeCode}>
              {formatNumber(order.Demand)}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}

export const TradingSummaryTooltip: FC<{
  ticker: string
  children: React.ReactNode
}> = ({ ticker, children }) => {
  const { t } = useTranslation()
  const { data, isLoading } = useGameData()

  const material = data?.materialsByTicker[ticker]

  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="min-w-180">
        {isLoading ? (
          <div className="flex items-center justify-center h-10 gap-4">
            <Spinner /> {t('common.loading')}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-lg font-bold capitalize">
                {material
                  ? snakeCase(material.Name).replaceAll('_', ' ')
                  : ticker}
              </div>
            </div>
            <TradingSummary ticker={ticker} />
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
