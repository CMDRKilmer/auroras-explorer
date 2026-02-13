import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { config } from '../common/config'
import { listContracts } from '../store/contract'

const app = new Hono()

app.use('/*', cors())

app.get('/api/contracts', async c => {
  const contracts = await listContracts({
    usernames: c.req.query('usernames')?.split(',') || [],
    order: c.req.query('order'),
    limit: Number(c.req.query('limit')) || 50,
    offset: Number(c.req.query('offset')) || 0,
  })

  return c.json(contracts)
})

export default {
  port: config.server.port,
  fetch: app.fetch,
}
