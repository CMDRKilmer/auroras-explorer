import { omit, toCamelCaseKeys } from 'es-toolkit'
import { typeid } from 'typeid-js'
import type { Group } from '@/lib/api'
import { FioClient } from '@/lib/fio/client'
import type { CreateOrUpdateGroupSchema } from '../api/schema'
import type { Context } from '../common/context'
import { db } from '../common/db'
import { AppError } from '../common/error'
import { updateUserGroups } from '../store/group'
import { getUserFioApiToken } from './user'

export const isUserInGroup = async (username: string, groupId: string) => {
  return db('user_groups')
    .where({ group_id: groupId, username })
    .first()
    .then(r => !!r)
}

export const createOrUpdateGroup = async (
  ctx: Context,
  params: CreateOrUpdateGroupSchema,
) => {
  const fioApiToken = params.useMyToken
    ? await getUserFioApiToken(ctx.assertUser().username)
    : params.fioApiToken

  if (!fioApiToken) {
    throw new AppError('FIO API token is required').setStatusCode(400)
  }

  const fioClient = new FioClient(fioApiToken)

  const [group, user] = await Promise.all([
    fioClient.getGroup(params.fioGroupId).catch(() => null),
    fioClient.getLoginInfo().catch(() => null),
  ])

  if (!user) {
    throw new AppError('Invalid FIO API token').setStatusCode(400)
  }

  if (!group) {
    throw new AppError('Invalid FIO group ID or API token').setStatusCode(400)
  }

  if (
    !group.GroupAdmins.some(
      admin => admin.GroupAdminUserName === user.toUpperCase(),
    )
  ) {
    throw new AppError('User is not an admin of the FIO group').setStatusCode(
      403,
    )
  }

  await updateUserGroups(
    params.fioGroupId,
    group.GroupUsers.map(u => u.GroupUserName),
  )

  const result = await db('groups')
    .insert({
      id: typeid('group').toString(),
      name: params.name,
      fio_group_id: params.fioGroupId,
      fio_api_token: fioApiToken,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: ctx.assertUser().username,
      updated_by: ctx.assertUser().username,
    })
    .onConflict('fio_group_id')
    .merge(['name', 'fio_api_token', 'updated_at', 'updated_by'])
    .returning('*')

  return formatGroup(result[0])
}

export const formatGroup = (group: object) => {
  return omit(toCamelCaseKeys(group), ['fioApiToken']) as Group
}

export const listMyGroups = async (ctx: Context) => {
  const username = ctx.assertUser().username
  const groups = await db('user_groups')
    .where({ username })
    .select('group_id')
    .then(rows => rows.map(r => r.group_id))
    .then(groupIds =>
      db('groups').whereIn('fio_group_id', groupIds).select('*'),
    )
    .then(groups => groups.map(formatGroup))
  return groups
}
