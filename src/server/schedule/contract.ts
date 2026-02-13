import axios from 'axios'
import { maxBy } from 'es-toolkit'
import { getGroup, getUserContracts } from '@/lib/fio'
import { sleep } from '@/lib/sleep'
import { config } from '../common/config'
import { bulkSaveUserContracts } from '../store/contract'
import { updateSyncStatus } from '../store/status'

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
    console.log('Initializing SaveUserContractTask...')
    const group = await getGroup(config.fio.groupId, config.fio.apiToken)
    const usernames = group.GroupUsers.map(u => u.GroupUserName)
    this.usernames = usernames
    console.log('Found', this.usernames.length, 'users in group', this.groupId)
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

  async saveUserContracts(username: string) {
    try {
      const contracts = await getUserContracts(username, this.token)
      await bulkSaveUserContracts(contracts)
      const syncStatus = {
        username,
        lastContSubmitAt: maxBy(contracts, c => new Date(c.Timestamp).valueOf())
          ?.Timestamp,
        lastContSyncAt: new Date(),
        lastContSyncStatus: 'SUCCESS',
      }

      await updateSyncStatus(syncStatus)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        await updateSyncStatus({
          username,
          lastContSyncAt: new Date(),
          lastContSyncStatus: 'NO_PERMISSION',
        })
      }
    }
  }

  async executeSaveUserContractTask() {
    for (const username of this.usernames) {
      try {
        console.log(new Date().toLocaleString())
        console.log('Saving contracts for user', username)
        await this.saveUserContracts(username)
        console.log('Saved contracts for user', username)
      } catch (error) {
        console.error('Error saving contracts for user', username, error)
      }
    }
  }
}
