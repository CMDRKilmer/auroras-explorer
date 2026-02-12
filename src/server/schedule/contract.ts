import { getGroup, getUserContracts } from '@/lib/fio'
import { sleep } from '@/lib/sleep'
import { config } from '../common/config'
import { bulkSaveUserContracts } from '../store/contract'

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
    const group = await getGroup(config.fio.groupId, config.fio.apiToken)
    const usernames = group.GroupUsers.map(u => u.GroupUserName)
    this.usernames = usernames
  }

  async run() {
    this.running = true
    while (this.running) {
      const now = Date.now()
      if (now - this.lastExecutedAt >= this.executeInterval) {
        this.lastExecutedAt = now
        await this.executeSaveUserContractTask()
      }
      await sleep(60 * 1000) // check every minute
    }
  }

  async saveUserContracts(username: string) {
    const contracts = await getUserContracts(username, this.token)
    await bulkSaveUserContracts(contracts)
  }

  async executeSaveUserContractTask() {
    for (const username of this.usernames) {
      try {
        console.log(new Date().toISOString())
        console.log('Saving contracts for user', username)
        await this.saveUserContracts(username)
        console.log('Saved contracts for user', username)
      } catch (error) {
        console.error('Error saving contracts for user', username, error)
      }
    }
  }
}
