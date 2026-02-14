import fs from 'node:fs/promises'
import { memoize, pick } from 'es-toolkit'
import { type Company, getCompanyByCode } from '@/lib/fio'
import { db } from '../common/db'

const savedCompanyFields = [
  'UserDataId',
  'UserId',
  'UserName',
  'SubscriptionLevel',
  'Tier',
  'Team',
  'Pioneer',
  'Moderator',
  'CreatedEpochMs',
  'CompanyId',
  'CompanyName',
  'CompanyCode',
  'CountryId',
  'CountryCode',
  'CountryName',
  'CorporationId',
  'CorporationName',
  'CorporationCode',
  'OverallRating',
  'ActivityRating',
  'ReliabilityRating',
  'StabilityRating',
  'HeadquartersNaturalId',
  'HeadquartersLevel',
  'HeadquartersBasePermits',
  'HeadquartersUsedBasePermits',
  'AdditionalBasePermits',
  'AdditionalProductionQueueSlots',
  'RelocationLocked',
  'NextRelocationTimeEpochMs',
  'UserNameSubmitted',
  'Timestamp',
] as const

const getFromFileCache = async (code: string): Promise<Company | undefined> => {
  const cacheFilePath = `./tmp/company_cache/${code}.json`
  const exists = await fs
    .stat(cacheFilePath)
    .then(() => true)
    .catch(() => false)

  if (!exists) return

  const data = await fs
    .readFile(cacheFilePath, 'utf-8')
    .then(data => JSON.parse(data))
    .catch(() => {})

  if (!data) return

  return data
}

export const getCompanyByCodeWithCache = memoize(async (code: string) => {
  const company = await db('fio_user_companies')
    .where('CompanyCode', code)
    .first()

  if (company) {
    return company
  }

  const data = await getFromFileCache(code).then(data => {
    if (data) return data
    return getCompanyByCode(code)
  })

  await db('fio_user_companies')
    .insert({
      ...pick(data, savedCompanyFields),
      UsernameUpper: data.UserName.toUpperCase(),
      UpdatedAt: new Date(),
    })
    .onConflict('UserDataId')
    .merge()

  return data
})
