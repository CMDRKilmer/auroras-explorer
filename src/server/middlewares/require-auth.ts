import { bearerAuth } from 'hono/bearer-auth'
import { isUserInGroup } from '../services/group'
import { verifyToken } from '../services/user'

export const requireGroupAuth = () =>
  bearerAuth({
    verifyToken: async (token, c) => {
      const groupId = c.req.param('groupId')
      const username = await verifyToken(token)

      if (!username) return false

      return isUserInGroup(username, groupId)
    },
  })
