import { memoize, pick } from 'es-toolkit'
import { FioClient } from '@/lib/fio/client'
import { db } from '../common/db'
import type { CompanyPO } from './type'

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

export const getCompanyWithCache = memoize(
  async ({
    code,
    username,
  }: {
    code?: string
    username?: string
  }): Promise<CompanyPO | undefined> => {
    if (!code && !username) return

    const query = db('fio_user_companies')

    if (code) {
      query.where('CompanyCode', code)
    }

    if (username) {
      query.where('UsernameUpper', username)
    }

    const company = query.first()

    if (company) {
      return company
    }

    const fioClient = new FioClient()

    const data = code
      ? await fioClient.getCompanyByCode(code)
      : username
        ? await fioClient.getCompanyByUsername(username)
        : undefined

    if (!data) return

    const result = await db('fio_user_companies')
      .insert({
        ...pick(data, savedCompanyFields),
        UsernameUpper: data.UserName.toUpperCase(),
        UpdatedAt: new Date(),
      })
      .onConflict('UserDataId')
      .merge()
      .returning('*')

    return result[0]
  },
)

export const getCompanyByUsernames = async (
  usernames: string[],
): Promise<CompanyPO[]> => {
  return db('fio_user_companies')
    .select('*')
    .whereIn(
      'UsernameUpper',
      usernames.map(u => u.toUpperCase()),
    )
}
