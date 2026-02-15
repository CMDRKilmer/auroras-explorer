import { getConnInfo } from 'hono/bun'
import { createMiddleware } from 'hono/factory'
import { logger } from '../common/logger'

export const httpLogger = () =>
  createMiddleware(async (c, next) => {
    const start = Date.now()
    await next()
    logger.info('processed', {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: Date.now() - start,
      ua: c.req.header('User-Agent') || '',
      ip:
        c.req.header('X-Forwarded-For') ||
        c.req.header('CF-Connecting-IP') ||
        getConnInfo(c).remote.address ||
        '',
      success: c.error == null,
      params: c.req.param(),
      query: c.req.query(),
    })

    if (c.error) {
      logger.error('unhandled error', c.error)
    }
  })
