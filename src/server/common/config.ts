import dotenv from 'dotenv'

dotenv.config()

export const config = {
  db: process.env.DB || '',
  fio: {
    apiToken: process.env.FIO_API_TOKEN || '',
    groupId: process.env.FIO_GROUP_ID || '',
  },
  server: {
    port: Number(process.env.PORT) || 11111,
  },
}
