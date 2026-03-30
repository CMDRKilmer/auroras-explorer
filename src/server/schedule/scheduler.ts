import pg from 'pg'
import { sleep } from '@/lib/sleep'
import { config } from '../common/config'
import { db } from '../common/db'
import { logger } from '../common/logger'
import { PriceService } from '../services/price'
import { type GroupSyncConfig, SaveUserContractTask } from './contract'

const loadGroupsFromDb = async (): Promise<GroupSyncConfig[]> => {
  const rows = await db('groups').select(
    'name',
    'fio_group_id',
    'fio_api_token',
  )
  return rows.map(r => ({
    name: r.name,
    fioGroupId: r.fio_group_id,
    fioApiToken: r.fio_api_token,
  }))
}

const listenForGroupChanges = (
  onChanged: (fioGroupId: string | null) => void,
) => {
  const client = new pg.Client(config.db)

  const connect = async () => {
    await client.connect()
    await client.query('LISTEN groups_changed')
    logger.info('Listening for groups_changed notifications')

    client.on('notification', msg => {
      logger.info(`Received groups_changed notification: ${msg.payload}`)
      onChanged(msg.payload || null)
    })

    client.on('error', err => {
      logger.error('LISTEN client error', err)
    })
  }

  return { connect, client }
}

export class Scheduler {
  tasks = new Map<string, SaveUserContractTask>()
  priceService = new PriceService()
  running = false
  pendingSync = new Set<string>()

  async init() {
    await this.priceService.init()
    await this.refreshGroups()
  }

  async refreshGroups() {
    const groups = await loadGroupsFromDb()
    const currentIds = new Set(groups.map(g => g.fioGroupId))

    // Remove tasks for deleted groups
    for (const id of this.tasks.keys()) {
      if (!currentIds.has(id)) {
        logger.info(`Removing task for deleted group ${id}`)
        this.tasks.delete(id)
      }
    }

    // Add/update tasks for new/changed groups
    for (const group of groups) {
      const existing = this.tasks.get(group.fioGroupId)
      if (!existing || existing.group.fioApiToken !== group.fioApiToken) {
        logger.info(`Adding/updating task for group ${group.fioGroupId}`)
        this.tasks.set(
          group.fioGroupId,
          new SaveUserContractTask(group, this.priceService),
        )
      }
    }

    logger.info(`Scheduler managing ${this.tasks.size} groups`)
  }

  async syncGroup(fioGroupId: string) {
    const task = this.tasks.get(fioGroupId)
    if (!task) {
      logger.warn(`No task found for group ${fioGroupId}, refreshing groups`)
      await this.refreshGroups()
      const newTask = this.tasks.get(fioGroupId)
      if (!newTask) {
        logger.warn(`Group ${fioGroupId} still not found after refresh`)
        return
      }
      await newTask.execute()
      return
    }
    await task.execute()
  }

  async handleGroupChanged(fioGroupId: string | null) {
    if (fioGroupId) {
      this.pendingSync.add(fioGroupId)
    }
    await this.refreshGroups()
  }

  async startListener() {
    const listener = listenForGroupChanges(fioGroupId => {
      this.handleGroupChanged(fioGroupId)
    })
    await listener.connect()
  }

  async run() {
    this.running = true
    while (this.running) {
      // Process pending syncs triggered by NOTIFY
      if (this.pendingSync.size > 0) {
        const pending = [...this.pendingSync]
        this.pendingSync.clear()
        for (const fioGroupId of pending) {
          logger.info(`Processing pending sync for group ${fioGroupId}`)
          await this.syncGroup(fioGroupId).catch(err => {
            logger.error(`Error syncing group ${fioGroupId}`, err)
          })
        }
      }

      // Run periodic syncs for groups that are due
      for (const [fioGroupId, task] of this.tasks) {
        if (task.needsExecution()) {
          logger.info(`Periodic sync for group ${fioGroupId}`)
          await task.execute().catch(err => {
            logger.error(`Error in periodic sync for group ${fioGroupId}`, err)
          })
        }
      }

      await sleep(60 * 1000)
    }
  }
}
