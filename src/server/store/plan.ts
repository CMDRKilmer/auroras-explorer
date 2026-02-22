import { toCamelCaseKeys } from 'es-toolkit'
import { typeid } from 'typeid-js'
import type { GroupPlan, UserPlan } from '@/lib/api'
import { getSharedPlan } from '@/lib/planner'
import { getPlanInfo } from '@/lib/planner/util'
import type { SetUserPlanetPlanSchema } from '../api/schema'
import type { Context } from '../common/context'
import { db } from '../common/db'
import { AppError } from '../common/error'
import {
  handleOrderBy,
  handlePaginationOptions,
  type PaginationOptions,
} from '../common/paging'

export const listGroupPlans = async (
  groupId: string,
  opt: PaginationOptions,
) => {
  const query = db({ up: 'user_plans' })
    .where('up.group_id', groupId)
    .orderBy('up.created_at', 'desc')
    .leftJoin({ gp: 'group_plans' }, 'gp.plan_id', 'up.plan_id')

  handleOrderBy(query, opt.order, ['created_at', 'updated_at', 'name'])
  handlePaginationOptions(query, opt)

  const plans = await query.select(
    'up.*',
    'gp.plan_name',
    'gp.buildings',
    'gp.inputs',
    'gp.outputs',
  )

  return plans.map(plan => toCamelCaseKeys(plan) as UserPlan)
}

export const addGroupPlan = async (
  ctx: Context,
  params: Omit<SetUserPlanetPlanSchema, 'username'>,
) => {
  const plan = await getSharedPlan(params.planId).catch(err => {
    throw new AppError('Failed to fetch plan from planner API', {
      cause: err,
    })
  })

  if (plan.baseplanner.planet_id !== params.planetId) {
    throw new AppError('Planet ID does not match the plan data')
  }

  const planInfo = getPlanInfo(plan.baseplanner)

  const [groupPlan] = await db('group_plans')
    .insert({
      id: typeid('gp').toString(),
      group_id: params.groupId,
      planet_id: params.planetId,
      plan_id: params.planId,
      plan_name: plan.baseplanner.name,
      data: plan.baseplanner,
      buildings: planInfo.buildings,
      inputs: planInfo.inputs,
      outputs: planInfo.outputs,
      updated_at: new Date(),
      created_by: ctx.assertUser().username,
      updated_by: ctx.assertUser().username,
    })
    .onConflict(['group_id', 'plan_id'])
    .merge([
      'planet_id',
      'plan_id',
      'plan_name',
      'data',
      'buildings',
      'inputs',
      'outputs',
      'updated_at',
      'updated_by',
    ])
    .returning('*')

  return toCamelCaseKeys(groupPlan) as GroupPlan
}

export const setUserPlanetPlan = async (
  ctx: Context,
  params: SetUserPlanetPlanSchema,
) => {
  const groupPlan = await addGroupPlan(ctx, params)

  const [userPlan] = await db('user_plans')
    .insert({
      id: typeid('up').toString(),
      username: params.username,
      group_id: params.groupId,
      planet_id: params.planetId,
      plan_id: params.planId,
      updated_at: new Date(),
      created_by: ctx.assertUser().username,
      updated_by: ctx.assertUser().username,
    })
    .onConflict(['username', 'planet_id'])
    .merge(['plan_id', 'updated_at', 'updated_by'])
    .returning('*')

  return { ...groupPlan, ...toCamelCaseKeys(userPlan) } as UserPlan
}

export const deleteUserPlanetPlan = async (groupId: string, planId: string) => {
  await db('user_plans').where({ id: planId, group_id: groupId }).delete()
}
