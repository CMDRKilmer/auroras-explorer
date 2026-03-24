import { db } from '../common/db'

export const updateUserGroups = async (
  groupId: string,
  usernames: string[],
) => {
  const toInsert = usernames.map(username => ({
    group_id: groupId,
    username,
    updated_at: new Date(),
  }))

  await db('user_groups')
    .insert(toInsert)
    .onConflict(['group_id', 'username'])
    .merge()

  await db('user_groups')
    .delete()
    .where({ group_id: groupId })
    .whereNotIn('username', usernames)
}

export const getGroupUsernames = async (groupId: string) => {
  const rows = await db('user_groups')
    .where({ group_id: groupId })
    .select('username')
  return rows.map(r => r.username as string)
}

export const getGroupUserInfos = async (groupId: string) => {
  const rows = await db('user_groups as ug')
    .where({ group_id: groupId })
    .select('*')
    .leftJoin('fio_user_companies AS c', 'ug.username', 'c.UsernameUpper')
    .leftJoin('sync_task_status AS s', 'ug.username', 's.username')

  return rows.map(r => {
    return {
      key: r.username,
      username: r.UserName,
      companyName: r.CompanyName,
      companyCode: r.CompanyCode,
      lastContSubmitAt: r.last_cont_submit_at,
      lastContSyncAt: r.last_cont_sync_at,
      lastContSyncStatus: r.last_cont_sync_status,
    }
  })
}
