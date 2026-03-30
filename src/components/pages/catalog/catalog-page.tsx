import { groupBy, sortBy } from 'es-toolkit'
import { type ComponentType, useMemo, useState } from 'react'
import { MaterialDetail } from '@/components/game/material/material-detail'
import { getMaterialCategoryTheme } from '@/components/game/material-category'
import { MaterialTileBase } from '@/components/game/material-tile'
import { Button } from '@/components/ui/button'
import { useGameData } from '@/lib/store'
import { cn } from '@/lib/utils'
import CbiMealie from '~icons/cbi/mealie'
import Fa7SolidAtom from '~icons/fa7-solid/atom'
import Fa7SolidBox from '~icons/fa7-solid/box'
import Fa7SolidCloud from '~icons/fa7-solid/cloud'
import Fa7SolidDesktop from '~icons/fa7-solid/desktop'
import Fa7SolidDiamond from '~icons/fa7-solid/diamond'
import Fa7SolidFloppyDisk from '~icons/fa7-solid/floppy-disk'
import Fa7SolidGears from '~icons/fa7-solid/gears'
import Fa7SolidGem from '~icons/fa7-solid/gem'
import Fa7SolidHillRockslide from '~icons/fa7-solid/hill-rockslide'
import Fa7SolidRobot from '~icons/fa7-solid/robot'
import Fa7SolidScroll from '~icons/fa7-solid/scroll'
import Fa7SolidSeedling from '~icons/fa7-solid/seedling'
import Fa7SolidShield from '~icons/fa7-solid/shield'
import Fa7SolidSquare from '~icons/fa7-solid/square'
import Fa7SolidVial from '~icons/fa7-solid/vial'
import MaterialSymbolsBrickRounded from '~icons/material-symbols/brick-rounded'
import MaterialSymbolsCoffeeRounded from '~icons/material-symbols/coffee-rounded'
import MaterialSymbolsMedication from '~icons/material-symbols/medication'
import MdiClose from '~icons/mdi/close'
import MdiWater from '~icons/mdi/water'
import PhGasCanFill from '~icons/ph/gas-can-fill'

const categoriesIconMap: Record<string, ComponentType | null> = {
  'agricultural products': Fa7SolidSeedling,
  alloys: Fa7SolidDiamond,
  chemicals: Fa7SolidVial,
  'consumable bundles': Fa7SolidBox,
  'construction materials': MaterialSymbolsBrickRounded,
  'construction parts': MaterialSymbolsBrickRounded,
  'construction prefabs': MaterialSymbolsBrickRounded,
  'consumables (basic)': CbiMealie,
  'consumables (luxury)': MaterialSymbolsCoffeeRounded,
  drones: Fa7SolidRobot,
  'electronic devices': null,
  'electronic parts': null,
  'electronic pieces': null,
  'electronic systems': Fa7SolidDesktop,
  elements: Fa7SolidAtom,
  'energy systems': null,
  fuels: PhGasCanFill,
  gases: Fa7SolidCloud,
  infrastructure: Fa7SolidGears,
  liquids: MdiWater,
  'medical equipment': MaterialSymbolsMedication,
  metals: Fa7SolidSquare,
  minerals: Fa7SolidGem,
  ores: Fa7SolidHillRockslide,
  plastics: null,
  'ship engines': null,
  'ship kits': null,
  'ship parts': null,
  'ship shields': Fa7SolidShield,
  'software components': Fa7SolidFloppyDisk,
  'software systems': Fa7SolidFloppyDisk,
  'software tools': Fa7SolidFloppyDisk,
  textiles: Fa7SolidScroll,
  'unit prefabs': null,
  utility: null,
}

export const CatalogPage = () => {
  const { data } = useGameData()

  const categories = useMemo(() => {
    if (!data) return
    const categoryMaps = groupBy(
      Object.values(data.materialsByTicker),
      mat => mat.CategoryName,
    )

    return sortBy(Object.entries(categoryMaps), ['0'])
  }, [data])

  const [activeMat, setActiveMat] = useState<string>()

  return (
    <div className="relative w-full flex">
      <div
        className="p-4 overflow-x-hidden grid gap-4 flex-1"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(3rem, 1fr))',
        }}
      >
        {categories?.flatMap(([category, mats]) => {
          const Icon = categoriesIconMap[category]
          return [
            <div
              key={`cate-${category}`}
              className="col-span-2 text-xs capitalize flex items-center px-2 rounded-md transition-all bg-secondary/50 text-muted-foreground h-12"
            >
              {Icon && (
                <span className="mr-2 text-lg">
                  <Icon />
                </span>
              )}
              {category}
            </div>,
            ...mats.map(mat => {
              const active = activeMat === mat.Ticker
              return (
                <div
                  key={mat.Ticker}
                  className={cn(
                    'transition-all overflow-hidden relative',
                    `rounded-md material-tile shadow-xl hover:outline-2`,
                    { 'outline-4': active },
                    getMaterialCategoryTheme(mat.CategoryName),
                  )}
                >
                  <MaterialTileBase
                    ticker={mat.Ticker}
                    onClick={() => setActiveMat(mat.Ticker)}
                  />
                </div>
              )
            }),
          ]
        })}
      </div>

      <div
        className={cn(
          'border-l h-full transition-all',
          activeMat ? 'w-100' : 'w-0',
        )}
      >
        <MaterialDetail
          className="sticky top-4 m-4"
          ticker={activeMat}
          decorator={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveMat(undefined)}
            >
              <MdiClose className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    </div>
  )
}
