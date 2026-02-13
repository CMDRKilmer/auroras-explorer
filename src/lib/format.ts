import Dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

Dayjs.extend(localizedFormat)
Dayjs.extend(relativeTime)
Dayjs.extend(duration)

export const dayjs = Dayjs

export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

export const formatTime = (date: Dayjs.ConfigType): string => {
  return dayjs(date).format('LLL')
}

export const formatTimeAdvanced = (date: Dayjs.ConfigType): string => {
  const time = dayjs(date)
  if (time.isBefore(dayjs().subtract(5, 'day'))) {
    return time.format('LL')
  }
  return dayjs(date).fromNow()
}

export const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(2)}KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(2)}MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)}GB`
}

export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
  return formatted
}
