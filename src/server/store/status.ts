import { toCamelCaseKeys, toSnakeCaseKeys } from 'es-toolkit'
import { db } from '../common/db'

export interface SyncStatus {
  username: string | null
  lastContSubmitAt: Date | null
  lastContSyncAt: Date | null
  lastContSyncStatus: string | null
  createdAt: Date
  updatedAt: Date
}

export const updateSyncStatus = async (data: Partial<SyncStatus>) => {
  const result = await db('sync_task_status')
    .insert(
      toSnakeCaseKeys({
        ...data,
        updatedAt: new Date(),
      }),
    )
    .onConflict('username')
    .merge()
    .returning('*')
  return toCamelCaseKeys(result[0]) as SyncStatus
}

export const bulkGetSyncStatus = async (usernames: string[]) => {
  const rows = await db('sync_task_status')
    .whereIn('username', usernames)
    .select('*')
  return rows.map(r => toCamelCaseKeys(r) as SyncStatus)
}
