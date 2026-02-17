import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class AppError extends Error {
  statusCode: ContentfulStatusCode = 403

  setStatusCode(code: ContentfulStatusCode) {
    this.statusCode = code
    return this
  }
}
