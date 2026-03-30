import type { PopoverProps } from '@radix-ui/react-popover'
import { startCase } from 'es-toolkit/string'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { Material } from '@/lib/fio'
import { cn } from '@/lib/utils'

interface MaterialSelectorProps extends PopoverProps {
  materials: Material[]
  value?: string
  onValueChange?: (value: string) => void
}

export function MaterialSelector({
  materials,
  value: selected,
  onValueChange: setSelected,
  ...props
}: MaterialSelectorProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)

  const groupedMaterials = React.useMemo(() => {
    if (!materials) return []
    const materialsByCategory = Object.groupBy(
      materials,
      material => material.CategoryName,
    )
    const result: {
      value: string
      items: Material[]
    }[] = []
    for (const [category, mats] of Object.entries(materialsByCategory)) {
      if (!mats) continue
      result.push({
        value: category,
        items: mats,
      })
    }
    return result
  }, [materials])

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={t('game.selectAMaterial')}
          className="justify-between"
        >
          {selected ? selected : t('game.selectAMaterial')}
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command
          loop
          filter={(value, search, keywords) => {
            if (value === search) return 1
            if (value.toLowerCase() === search.toLowerCase()) return 0.95
            if (value.toLowerCase().startsWith(search.toLowerCase())) return 0.9
            if (value.toLowerCase().includes(search.toLowerCase())) return 0.7
            if (
              keywords?.some(keyword =>
                keyword.toLowerCase().includes(search.toLowerCase()),
              )
            )
              return 0.5
            return 0
          }}
        >
          <CommandList className="h-(--cmdk-list-height) max-h-100">
            <CommandInput placeholder={t('game.searchMaterials')} />
            <CommandEmpty>{t('game.noMaterialFound')}</CommandEmpty>
            {groupedMaterials.map(category => (
              <CommandGroup key={category.value} heading={category.value}>
                {category.items?.map(material => (
                  <MaterialItem
                    key={material.Ticker}
                    material={material}
                    isSelected={selected === material.Ticker}
                    onSelect={() => {
                      setSelected?.(material.Ticker)
                      setOpen(false)
                    }}
                  />
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface MaterialItemProps {
  material: Material
  isSelected: boolean
  onSelect: () => void
}

const MaterialItem = React.forwardRef<HTMLDivElement, MaterialItemProps>(
  function MaterialItem(
    { material, isSelected, onSelect }: MaterialItemProps,
    ref,
  ) {
    return (
      <CommandItem
        key={material.Ticker}
        onSelect={onSelect}
        ref={ref}
        className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
        value={material.Ticker}
        keywords={[material.Ticker, material.Name]}
      >
        {material.Ticker} - {startCase(material.Name)}
        <Check
          className={cn('ml-auto', isSelected ? 'opacity-100' : 'opacity-0')}
        />
      </CommandItem>
    )
  },
)
