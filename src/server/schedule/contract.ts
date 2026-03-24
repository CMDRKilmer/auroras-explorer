import async from 'async'
import axios from 'axios'
import { maxBy } from 'es-toolkit'
import { FioClient } from '@/lib/fio/client'
import { formatDuration } from '@/lib/format'
import { sleep } from '@/lib/sleep'
import { logger } from '../common/logger'
import type { PriceService } from '../services/price'
import { bulkSaveUserContracts } from '../store/contract'
import { updateUserGroups } from '../store/group'
import { type SyncStatus, updateSyncStatus } from '../store/status'

export interface GroupSyncConfig {
  name: string
  fioGroupId: string
  fioApiToken: string
}

export class SaveUserContractTask {
  usernames: string[] = []
  lastExecutedAt = 0
  executeInterval = 10 * 60 * 1000 // 10 minutes
  fioClient: FioClient

  get tag() {
    return `${this.group.name}(${this.group.fioGroupId})`
  }

  constructor(
    public group: GroupSyncConfig,
    public priceService: PriceService,
  ) {
    this.fioClient = new FioClient(group.fioApiToken)
  }

  async refreshGroupUsers() {
    const group = await this.fioClient.getGroup(this.group.fioGroupId)
    const usernames = group.GroupUsers.map(u => u.GroupUserName)
    this.usernames = usernames
    await updateUserGroups(this.group.fioGroupId, this.usernames)
    logger.info(`[${this.tag}] Refreshed ${this.usernames.length} users`)
  }

  async execute() {
    await this.refreshGroupUsers()
    this.lastExecutedAt = Date.now()
    await this.executeSaveUserContractTask()
  }

  needsExecution() {
    return (
      this.lastExecutedAt === 0 ||
      Date.now() - this.lastExecutedAt >= this.executeInterval
    )
  }

  async saveUserContracts(username: string, signal?: AbortSignal) {
    try {
      const contracts = await async.retry(
        {
          times: 5,
          interval: (attemptCount: number) => 1000 * 2 ** attemptCount,
          errorFilter: (err: unknown) => {
            if (axios.isAxiosError(err)) {
              return err.response?.status !== 401
            }
            return true
          },
        },
        async () => {
          return await this.fioClient.getUserContracts(username, { signal })
        },
      )
      const result = await bulkSaveUserContracts(this.priceService, contracts)
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
        `[${this.tag}] Saved contracts for ${username}: ${JSON.stringify(result)}`,
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

      logger.error(
        `[${this.tag}] Failed to save contracts for ${username}`,
        err,
      )

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
        if (timeout) break
        logger.info(`[${this.tag}] Saving contracts for ${username}`)
        const result = await this.saveUserContracts(
          username,
          abortController.signal,
        ).catch(err => {
          logger.error(
            `[${this.tag}] Error in saveUserContracts for ${username}`,
            err,
          )
          return null
        })

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
          `[${this.tag}] Finished sync, stats: ${JSON.stringify(statistics)} Time: ${formatDuration(Date.now() - startTime)}`,
        )
      }),
      sleep(5 * 60 * 1000).then(() => {
        timeout = true
        abortController.abort()
        logger.warn(
          `[${this.tag}] Sync timed out after 5 minutes. Stats: ${JSON.stringify(statistics)}`,
        )
      }),
    ])
  }
}
