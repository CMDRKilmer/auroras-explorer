import type { BasePlanner } from './types'

export const parseRecipeId = (recipeId: string) => {
  const [building, recipe] = recipeId.split('#')
  const [a, b] = recipe.split('=>').map(items =>
    items.split(' ').map(item => {
      const [a, b] = item.split('x')
      if (b) {
        // if 2nd part is present, it means the item is in the format of "COUNTxTICKER", e.g. "2xFEO"
        return {
          count: +a,
          ticker: b,
        }
      }
      // otherwise, it means the item is in the format of "TICKER", e.g. "FEO"
      return {
        count: 0,
        ticker: a,
      }
    }),
  )

  return {
    building,
    // following two fields are not always present, e.g. for mining recipe
    // so we default them to empty array to avoid dealing with undefined later
    inputs: b ? a : [],
    outputs: b ? b : a,
  }
}

export const getPlanInfo = (plan: BasePlanner) => {
  const inputs = new Set<string>()
  const outputs = new Set<string>()
  const buildings = new Set<string>()

  for (const building of plan.baseplanner_data.buildings) {
    for (const recipe of building.active_recipes) {
      const r = parseRecipeId(recipe.recipeid)
      buildings.add(r.building)
      for (const input of r.inputs) {
        inputs.add(input.ticker)
      }
      for (const output of r.outputs) {
        outputs.add(output.ticker)
      }
    }
  }

  return {
    buildings: Array.from(buildings),
    inputs: Array.from(inputs),
    outputs: Array.from(outputs),
  }
}

export const getPlanIdFromLink = (url?: string | undefined) => {
  const re =
    /^https?:\/\/prunplanner\.org\/shared\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/
  const match = url?.match(re)
  return match?.[1]
}

export const getPlanLinkFromId = (planId: string) => {
  return `https://prunplanner.org/shared/${planId}`
}
