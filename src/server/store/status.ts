import { toCamelCaseKeys, toSnakeCaseKeys } from 'es-toolkit'
import { db } from '../common/db'

export interface SyncStatus {
  username: string
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
