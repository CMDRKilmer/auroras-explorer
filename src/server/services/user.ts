import { memoize, toSnakeCaseKeys } from 'es-toolkit'
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from 'jose'
import { FioClient } from '@/lib/fio/client'
import { config } from '../common/config'
import { db } from '../common/db'
import { AppError } from '../common/error'

export const getPrivateKey = memoize(() => {
  return importPKCS8(config.jwt.privateKey, 'ES384')
})

export const getPublicKey = memoize(() => {
  return importSPKI(config.jwt.publicKey, 'ES384')
})

const genToken = async (username: string) => {
  return await new SignJWT()
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime('30d')
    .setProtectedHeader({ alg: 'ES384' })
    .sign(await getPrivateKey())
}

export const verifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, await getPublicKey())
  return payload.sub
}

export const exchangeFromFioToken = async (fioToken: string) => {
  const username = await new FioClient(fioToken).getLoginInfo().catch(() => {
    throw new AppError('Invalid FIO token')
  })

  await db('users')
    .insert(
      toSnakeCaseKeys({
        username,
        fioToken,
        updatedAt: new Date(),
      }),
    )
    .onConflict('username')
    .merge()

  return await genToken(username)
}
