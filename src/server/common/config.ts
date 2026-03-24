import dotenv from 'dotenv'

dotenv.config()

export const config = {
  db: process.env.DB || '',
  server: {
    port: Number(process.env.PORT) || 11111,
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY || '',
    publicKey: process.env.JWT_PUBLIC_KEY || '',
  },
}
