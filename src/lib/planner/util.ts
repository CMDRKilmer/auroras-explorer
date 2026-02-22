import type { BasePlanner } from './types'

export const parseRecipeId = (recipeId: string) => {
  const [building, recipe] = recipeId.split('#')
  const [inputs, outputs] = recipe.split('=>').map(items =>
    items.split(' ').map(item => {
      const [count, ticker] = item.split('x')
      return {
        count: +count,
        ticker,
      }
    }),
  )
  return {
    building,
    inputs,
    outputs,
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
