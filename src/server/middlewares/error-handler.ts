import { createMiddleware } from 'hono/factory'
import { AppError } from '../common/error'
import { logger } from '../common/logger'

export const errorHandler = () =>
  createMiddleware(async (c, next) => {
    await next()

    if (c.error instanceof AppError) {
      return c.json({ message: c.error.message }, c.error.statusCode)
    }

    logger.error('unhandled error', c.error)

    return c.json({ message: 'Internal Server Error' }, 500)
  })
