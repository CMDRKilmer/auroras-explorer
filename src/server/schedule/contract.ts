import async from 'async'
import axios from 'axios'
import { maxBy } from 'es-toolkit'
import { getGroup, getUserContracts } from '@/lib/fio'
import { formatDuration } from '@/lib/format'
import { sleep } from '@/lib/sleep'
import { config } from '../common/config'
import { logger } from '../common/logger'
import { bulkSaveUserContracts } from '../store/contract'
import { updateUserGroups } from '../store/group'
import { type SyncStatus, updateSyncStatus } from '../store/status'

export class SaveUserContractTask {
  usernames: string[] = []
  lastExecutedAt = 0
  running = false
  executeInterval = 10 * 60 * 1000 // 10 minutes

  constructor(
    public groupId: string,
    public token: string,
  ) {}

  async init() {
    logger.info('Initializing SaveUserContractTask...')
    const group = await getGroup(config.fio.groupId, config.fio.apiToken)
    const usernames = group.GroupUsers.map(u => u.GroupUserName)
    this.usernames = usernames
    await updateUserGroups(this.groupId, this.usernames)
    logger.info(`Found ${this.usernames.length} users in group ${this.groupId}`)
  }

  async run() {
    if (this.running) return
    this.running = true
    await this.init()
    while (this.running) {
      const now = Date.now()
      if (
        this.lastExecutedAt === 0 ||
        now - this.lastExecutedAt >= this.executeInterval
      ) {
        this.lastExecutedAt = now
        await this.executeSaveUserContractTask()
      }
      await sleep(60 * 1000) // check every minute
    }
  }

  async saveUserContracts(username: string, signal?: AbortSignal) {
    try {
      const contracts = await async.retry(
        {
          times: 5,
          interval: (attemptCount: number) => 1000 * 2 ** attemptCount, // Exponential backoff: 2s, 4s, 8s, 16s, 32s
          errorFilter: (err: unknown) => {
            if (axios.isAxiosError(err)) {
              // Retry for all errors except 401 Unauthorized, which indicates no permission to access the user's contracts
              return err.response?.status !== 401
            }
            return true
          },
        },
        async () => {
          return await getUserContracts(username, this.token, signal)
        },
      )
      const result = await bulkSaveUserContracts(contracts)
      const syncStatus: Partial<SyncStatus> = {
        username,
        lastContSyncAt: new Date(),
        lastContSyncStatus: 'SUCCESS',
      }

      const lastContSubmitTimestamp = maxBy(contracts, c =>
        new Date(c.Timestamp).valueOf(),
      )?.Timestamp

      if (lastContSubmitTimestamp) {
        syncStatus.lastContSubmitAt = new Date(lastContSubmitTimestamp)
      }

      await updateSyncStatus(syncStatus)
      logger.info(
        `Successfully saved contracts for user ${username}, result: ${JSON.stringify(result)}`,
      )

      return result
    } catch (err) {
      if (axios.isAxiosError(err)) {
        await updateSyncStatus({
          username,
          lastContSyncAt: new Date(),
          lastContSyncStatus:
            err.response?.status === 401
              ? 'NO_PERMISSION'
              : err.message.includes('timeout')
                ? 'TIMEOUT'
                : 'FETCH_ERROR',
        })
        return
      }

      logger.error(`Failed to save contracts for user ${username}`, err)

      await updateSyncStatus({
        username,
        lastContSyncAt: new Date(),
        lastContSyncStatus: 'ERROR',
      })
    }
  }

  async executeSaveUserContractTask() {
    const startTime = Date.now()
    const statistics = {
      totalUsers: this.usernames.length,
      successCount: 0,
      errorCount: 0,
      contractsCount: 0,
      conditionsCount: 0,
      normalizedContractsCount: 0,
    }

    let timeout = false

    const abortController = new AbortController()

    const task = async () => {
      for (const username of this.usernames) {
        if (timeout) {
          break
        }
        logger.info(`Saving contracts for user ${username}`)
        const result = await this.saveUserContracts(
          username,
          abortController.signal,
        ).catch(err => {
          logger.error(`Error in saveUserContracts for user ${username}`, err)
          return null
        })
        logger.info(`Saved contracts for user ${username}`)

        if (result) {
          statistics.successCount++
          statistics.contractsCount += result.savedContractsCount
          statistics.conditionsCount += result.savedConditionsCount
          statistics.normalizedContractsCount +=
            result.normalizedAndSavedContractsCount
        } else {
          statistics.errorCount++
        }
      }
    }

    await Promise.race([
      task().then(() => {
        logger.info(
          `Finished executing SaveUserContractTask, statistics: ${JSON.stringify(
            statistics,
          )} Time taken: ${formatDuration(Date.now() - startTime)}`,
        )
      }),
      sleep(5 * 60 * 1000).then(() => {
        timeout = true
        abortController.abort()
        logger.warn(
          `SaveUserContractTask execution timed out after 5 minutes. Current statistics: ${JSON.stringify(
            statistics,
          )}`,
        )
      }),
    ])
  }
}
