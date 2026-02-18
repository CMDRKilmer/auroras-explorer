import { snakeCase } from 'es-toolkit'
import { type FC, useMemo } from 'react'
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

export const TradingSummary: FC<{ ticker: string }> = ({ ticker }) => {
  const { data } = useGameData()
  const orders = useMemo(() => {
    if (!data) return
    return getTradingSummariesByMaterial(data.orders, ticker)
  }, [data, ticker])

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
          <TableCell>Ask</TableCell>
          {orders.map(order => (
            <TableCell key={order.ExchangeCode}>
              {order.Ask ? (
                <span className="text-sm text-destructive">
                  ${order.Ask?.toLocaleString()}
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Bid</TableCell>
          {orders.map(order => (
            <TableCell key={order.ExchangeCode}>
              {order.Bid ? (
                <span className="text-sm text-success">
                  ${order.Bid?.toLocaleString()}
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Supply</TableCell>
          {orders.map(order => (
            <TableCell key={order.ExchangeCode}>
              {order.Supply?.toLocaleString()}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Demand</TableCell>
          {orders.map(order => (
            <TableCell key={order.ExchangeCode}>
              {order.Demand?.toLocaleString()}
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
  const { data } = useGameData()

  const material = data?.materialsByTicker[ticker]

  if (!material) return <>{children}</>

  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="min-w-180">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-lg font-bold capitalize">
            {snakeCase(material.Name).replaceAll('_', ' ')}
          </div>
        </div>
        <TradingSummary ticker={ticker} />
      </HoverCardContent>
    </HoverCard>
  )
}
