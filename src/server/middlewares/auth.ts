import { createMiddleware } from 'hono/factory'
import { isUserInGroup } from '../services/group'
import { verifyToken } from '../services/user'

export const authenticate = () =>
  createMiddleware(async (c, next) => {
    const tokenHeader = c.req.header('Authorization')
    if (tokenHeader) {
      const match = tokenHeader.match(/^Bearer (.+) *$/)
      if (!match) return c.json({ error: 'Unauthorized' }, 401)
      const token = match[1]
      const username = await verifyToken(token)
      if (!username) return c.json({ error: 'Invalid token' }, 401)
      c.set('user', {
        username,
      })
    }

    await next()
  })

export const requireGroupAuth = () =>
  createMiddleware(async (c, next) => {
    const groupId = c.req.param('groupId')
    if (groupId) {
      const user = c.get('user')
      if (!user) return c.json({ error: 'Unauthorized' }, 401)
      if (!isUserInGroup(user.username, groupId)) {
        return c.json({ error: 'Forbidden' }, 403)
      }
    }

    await next()
  })
