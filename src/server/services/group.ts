import { db } from '../common/db'

export const isUserInGroup = (username: string, groupId: string) => {
  return db('user_groups')
    .where({ group_id: groupId, username })
    .first()
    .then(r => !!r)
}
