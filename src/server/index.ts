import { config } from './common/config'
import { SaveUserContractTask } from './schedule/contract'

export const main = async () => {
  const task = new SaveUserContractTask(config.fio.groupId, config.fio.apiToken)

  await task.run()
}

main()
  .then(() => {
    console.log('done')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
