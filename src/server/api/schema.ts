import { type } from 'arktype'

export const SetUserPlanetPlanSchema = type({
  username: 'string?',
  groupId: 'string',
  planetId: 'string',
  planId: 'string',
})

export type SetUserPlanetPlanSchema = typeof SetUserPlanetPlanSchema.infer

export const CreateOrUpdateGroupSchema = type({
  fioGroupId: 'string',
  fioApiToken: 'string?',
  useMyToken: 'boolean?',
  name: 'string',
})

export type CreateOrUpdateGroupSchema = typeof CreateOrUpdateGroupSchema.infer
