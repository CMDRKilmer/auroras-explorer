import os from 'node:os'
import { createLogger, format } from 'winston'
import ConsoleTransport from 'winston-humanize-console-transport'

const { combine, timestamp } = format

export const logger = createLogger({
  level: 'debug',
  defaultMeta: { pid: process.pid, host: os.hostname() },
  format: combine(timestamp()),
  transports: [new ConsoleTransport()],
})
