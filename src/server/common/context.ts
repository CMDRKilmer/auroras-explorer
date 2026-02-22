import type { User } from '../api/types'
import type { Services } from '../services'
import { AppError } from './error'

export class Context {
  public user?: User

  constructor(public readonly services: Services) {}

  assertUser() {
    if (!this.user) {
      throw new AppError('authentication required').setStatusCode(401)
    }
    return this.user
  }
}
