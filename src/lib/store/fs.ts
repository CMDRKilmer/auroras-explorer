import { configureSingle, fs as zenFs } from '@zenfs/core'
import { WebAccess } from '@zenfs/dom'
import { getItem, setItem } from '@/hooks/use-storage'
import type { Cache } from '../cache'

const fs = zenFs.promises
let initFsPromise: Promise<void> | null = null

const initFs = async () => {
  const root = await navigator.storage.getDirectory()
  await configureSingle({ backend: WebAccess, handle: root })
}

const ensureFs = () => {
  if (initFsPromise) return initFsPromise
  initFsPromise = initFs()
  return initFsPromise
}

const getCachePath = (key: string) => `/data/${key}.json`
const cacheSetTimeKey = (key: string) => `ct:${key}`
const cacheExpireTimeKey = (key: string) => `ce:${key}`

export const fsCache: Cache = {
  async has(key: string) {
    await ensureFs()
    return await fs.exists(getCachePath(key))
  },
  async get<T>(key: string) {
    await ensureFs()

    const expireTime = getItem<number>(cacheExpireTimeKey(key))
    if (expireTime && Date.now() > expireTime) {
      await fs.unlink(getCachePath(key)).catch(() => {})
      return
    }

    try {
      const cachedData = await fs.readFile(getCachePath(key), {
        encoding: 'utf8',
      })

      return JSON.parse(cachedData) as T
    } catch (_) {
      return
    }
  },
  async set<T>(key: string, value: T, ttl?: number) {
    await ensureFs()
    if (ttl) {
      setItem(cacheExpireTimeKey(key), Date.now() + ttl)
      setItem(cacheSetTimeKey(key), Date.now())
    }

    await fs.mkdir('/data').catch(() => {})
    await fs.writeFile(getCachePath(key), JSON.stringify(value), {
      encoding: 'utf8',
    })
  },
}
