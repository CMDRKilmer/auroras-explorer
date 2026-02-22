import { sValidator } from '@hono/standard-validator'
import Bun from 'bun'
import { type Env, Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { config } from '../common/config'
import { Context } from '../common/context'
import { AppError } from '../common/error'
import { logger } from '../common/logger'
import { authenticate, requireGroupAuth } from '../middlewares/auth'
import { httpLogger } from '../middlewares/logger'
import { Services } from '../services'
import { exchangeFromFioToken } from '../services/user'
import { type ListContractsOptions, listContracts } from '../store/contract'
import { getGroupUserInfos, getGroupUsernames } from '../store/group'
import {
  deleteUserPlanetPlan,
  listGroupPlans,
  setUserPlanetPlan,
} from '../store/plan'
import { SetUserPlanetPlanSchema } from './schema'
import { parseArray, parseRange } from './util'

const createApp = () => {
  const app = new Hono<Env>()

  app.use(cors())
  app.use(compress())
  app.use(httpLogger())
  app.use(authenticate())

  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json({ message: err.message }, err.statusCode)
    }
    if (err instanceof HTTPException) {
      return err.getResponse()
    }
    logger.error('Unexpected error', err)
    return c.json(
      { message: 'An unexpected error occurred. Please try again.' },
      500,
    )
  })

  return app
}

const setupRoutes = (app: Hono<Env>) => {
  app.get('/ready', c => c.text('OK'))

  app.post('/api/token/exchange', async c => {
    const { fioToken } = await c.req.json()
    if (!fioToken) {
      return c.json({ error: 'No FIO token provided' }, 400)
    }
    const token = await exchangeFromFioToken(fioToken)
    return c.json({ token })
  })

  app.get('/api/identity', async c => {
    const user = c.get('user')
    return c.json(user)
  })

  // app.get('/api/user/:username/contracts', async c => {
  //   const contracts = await listUserContracts({
  //     submitters: [c.req.param('username')],
  //     order: c.req.query('order'),
  //     limit: Number(c.req.query('limit')) || 50,
  //     offset: Number(c.req.query('offset')) || 0,
  //   })

  //   return c.json(contracts)
  // })

  app.use('/api/group/:groupId/*', requireGroupAuth())

  app.get('/api/group/:groupId/contracts', async c => {
    const groupId = c.req.param('groupId')
    const usernamesParam = parseArray(c.req.query('usernames'))
    const usernames = await getGroupUsernames(groupId)
    if (usernames.length === 0) {
      return c.json([])
    }

    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('page_size')) || 50

    const opts: ListContractsOptions = {
      order: c.req.query('order'),
      limit: pageSize,
      offset: pageSize * (page - 1),
      types: parseArray(c.req.query('types')),
      statuses: parseArray(c.req.query('statuses')),
      participants: usernames.map(u => u.toUpperCase()),
      tags: parseArray(c.req.query('tags')),
      time: parseRange(c.req.query('time')),
    }

    if (usernamesParam) {
      opts.participants = usernamesParam.map(u => u.toUpperCase())
      opts.explicit = true
    }

    const contracts = await listContracts(opts)

    return c.json(contracts)
  })

  app.get('/api/group/:groupId/users', async c => {
    const groupId = c.req.param('groupId')
    const users = await getGroupUserInfos(groupId)
    return c.json(users)
  })

  app.get('/api/group/:groupId/plans', async c => {
    const groupId = c.req.param('groupId')
    const opt = {
      limit: Number(c.req.query('limit')) || 50,
      offset: Number(c.req.query('offset')) || 0,
      order: c.req.query('order'),
    }
    const plans = await listGroupPlans(groupId, opt)
    return c.json(plans)
  })

  app.post(
    '/api/group/:groupId/plan',
    sValidator('json', SetUserPlanetPlanSchema),
    async c => {
      const params = c.req.valid('json')
      const groupId = c.req.param('groupId')
      if (params.groupId !== groupId) {
        throw new AppError(
          'Group ID in path and body do not match',
        ).setStatusCode(400)
      }
      const ctx = c.get('ctx')

      const plan = await setUserPlanetPlan(ctx, params)
      return c.json(plan)
    },
  )

  app.delete('/api/group/:groupId/plan/:planId', async c => {
    const groupId = c.req.param('groupId')
    const planId = c.req.param('planId')

    await deleteUserPlanetPlan(groupId, planId)
    return c.json({ success: true })
  })

  return app
}

export const startApiServer = async () => {
  const services = await Services.setup()

  const app = createApp()
  app.use(async (c, next) => {
    const ctx = new Context(services)
    ctx.user = c.get('user')
    c.set('ctx', ctx)
    await next()
  })
  setupRoutes(app)

  const server = Bun.serve({
    port: config.server.port,
    fetch: app.fetch,
  })

  logger.info(`API server started on port ${server.port}`)

  return server
}
