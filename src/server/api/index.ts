import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { config } from '../common/config'
import { listContracts } from '../store/contract'
import { getGroupUserInfos, getGroupUsernames } from '../store/group'

const app = new Hono()

app.use('/*', cors())

app.get('/api/user/:username/contracts', async c => {
  const contracts = await listContracts({
    submitters: [c.req.param('username')],
    order: c.req.query('order'),
    limit: Number(c.req.query('limit')) || 50,
    offset: Number(c.req.query('offset')) || 0,
  })

  return c.json(contracts)
})

app.get('/api/group/:groupId/contracts', async c => {
  const groupId = c.req.param('groupId')
  const usernames = await getGroupUsernames(groupId)
  if (usernames.length === 0) {
    return c.json([])
  }
  const contracts = await listContracts({
    order: c.req.query('order'),
    limit: Number(c.req.query('limit')) || 50,
    offset: Number(c.req.query('offset')) || 0,
    types: c.req.query('types')
      ? (c.req.query('types') as string).split(',')
      : undefined,
    participants: usernames,
  })

  return c.json(contracts)
})

app.get('/api/group/:groupId/users', async c => {
  const groupId = c.req.param('groupId')
  const users = await getGroupUserInfos(groupId)
  return c.json(users)
})

export default {
  port: config.server.port,
  fetch: app.fetch,
}
