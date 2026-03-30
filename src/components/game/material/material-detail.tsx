import chroma from 'chroma-js'
import { uniq } from 'es-toolkit'
import { type FC, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getRecipesByInput,
  getRecipesByOutput,
} from '@/components/pages/production-line/graph'
import { formatMaterialName } from '@/lib/game/format'
import { useGameData } from '@/lib/store'
import { cn } from '@/lib/utils'
import { getMaterialCategoryTheme } from '../material-category'
import { MaterialTileBase } from '../material-tile'
import { TradingSummary } from '../trading-summary'

export interface MaterialDetailProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ticker?: string
  decorator?: React.ReactNode
}

const _MaterialDetail: FC<MaterialDetailProps> = ({
  ticker,
  decorator,
  className,
  ...props
}) => {
  const { t } = useTranslation()
  const { data } = useGameData()
  const mat = ticker ? data?.materialsByTicker[ticker] : undefined

  const densityColor = useMemo(() => {
    if (!mat) return
    const density = mat.Weight / mat.Volume
    if (density < 1) {
      return chroma.scale(['#00ffff', '#ffff00'])(density)
    }
    return chroma.scale(['#ffff00', '#ff0000'])(Math.min((density - 1) / 5, 1))
  }, [mat])

  const recipes = useMemo(() => {
    if (!data?.recipes || !ticker) return {}
    return {
      cur: getRecipesByOutput(data.recipes, ticker),
      fur: getRecipesByInput(data.recipes, ticker),
    } as const
  }, [data, ticker])

  if (!mat || !ticker) return null

  const produceBuilding = uniq(
    recipes.cur?.map(recipe => recipe.BuildingTicker) || [],
  )

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <div className="flex w-full gap-4 items-center">
        <MaterialTileBase ticker={ticker} />

        <div
          className={cn(
            'flex flex-col flex-1',
            getMaterialCategoryTheme(mat.CategoryName),
          )}
          style={{
            background: 'transparent',
          }}
        >
          <div className="text-lg font-bold capitalize">
            {formatMaterialName(mat.Name)}
          </div>
        </div>

        {decorator}
      </div>

      <div className="flex-1">
        {mat.Weight.toFixed(1)}t/
        {mat.Volume.toFixed(1)}m³
        <span className="ml-2" style={{ color: densityColor?.hex() }}>
          ρ={(mat.Weight / mat.Volume).toFixed(2)}
        </span>
      </div>

      <div className="">
        <TradingSummary ticker={ticker} thin />
      </div>

      <div>
        <div>
          <div className="text-sm font-bold mb-2">{t('game.producedBy')}</div>
          <div className="flex flex-col gap-2">
            {produceBuilding?.map(building => (
              <div
                key={building}
                className="text-sm text-muted-foreground cursor-pointer hover:underline"
              >
                {building}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const MaterialDetail = memo(_MaterialDetail)
