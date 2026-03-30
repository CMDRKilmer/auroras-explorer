import { type FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  calculateRecipeDailyProfit,
  getInfraNeedsForBuilding,
} from '@/lib/calculation'
import type { Recipe } from '@/lib/fio'
import { formatDuration } from '@/lib/format'
import { useGameData } from '@/lib/store'
import { cn } from '@/lib/utils'
import { MaterialTile } from '../../game/material-tile'
import { useExplorerContext } from './context'

export const RecipePreview: FC<{ recipe: Recipe }> = ({ recipe }) => {
  const { t } = useTranslation()
  const { data } = useGameData()
  const { cx, setMat, setBuilding } = useExplorerContext()
  const dailyProfit = useMemo(() => {
    if (!data || !cx) return
    return calculateRecipeDailyProfit(data, recipe, cx)
  }, [data, cx, recipe])

  const intraNeeds = useMemo(() => {
    if (!data) return []
    return getInfraNeedsForBuilding(data, recipe.BuildingTicker)
  }, [data, recipe])

  return (
    <div className="flex flex-col px-2 py-1 gap-1 rounded-md bg-secondary text-secondary-foreground cursor-default">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline text-sm text-muted-foreground">
          <button
            type="button"
            className="text-accent-foreground hover:underline cursor-pointer"
            onClick={() => {
              setMat(undefined)
              setBuilding(recipe.BuildingTicker)
            }}
          >
            {recipe.BuildingTicker}
          </button>
          <div className="flex text-xs gap-1 pl-2">
            {intraNeeds.map(need => {
              return (
                <span key={need.ticker}>
                  {need.ticker}
                  <sub>x{need.amount.toPrecision(1)}</sub>
                </span>
              )
            })}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDuration(recipe.TimeMs)}
        </div>
      </div>
      <div className="flex gap-1 items-center">
        {recipe.Inputs.map(input => {
          return (
            <div key={input.Ticker}>
              <MaterialTile
                ticker={input.Ticker}
                number={input.Amount}
                className="cursor-pointer hover:outline-2"
                onClick={() => setMat(input.Ticker)}
              />
            </div>
          )
        })}

        <div>{t('productionLine.recipe.arrow')}</div>

        {recipe.Outputs.map(output => {
          return (
            <div key={output.Ticker}>
              <MaterialTile
                ticker={output.Ticker}
                number={output.Amount}
                className="cursor-pointer hover:outline-2"
                onClick={() => setMat(output.Ticker)}
              />
            </div>
          )
        })}
      </div>

      <div className="text-sm text-muted-foreground">
        {t('productionLine.recipe.profit')}{' '}
        {dailyProfit ? (
          <>
            <span
              className={cn(
                dailyProfit
                  ? dailyProfit > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                  : '',
              )}
            >
              ${dailyProfit.toLocaleString()}
            </span>
            {t('productionLine.recipe.perDay')}
          </>
        ) : (
          t('productionLine.recipe.na')
        )}
      </div>
    </div>
  )
}
