import { type } from 'arktype'

export const SetUserPlanetPlanSchema = type({
  username: 'string?',
  groupId: 'string',
  planetId: 'string',
  planId: 'string',
})

export type SetUserPlanetPlanSchema = typeof SetUserPlanetPlanSchema.infer
