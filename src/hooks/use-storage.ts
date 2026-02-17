import { useEffect, useState } from 'react'

export const getItem = <T>(key: string): T | undefined => {
  try {
    if (typeof window === 'undefined') {
      return
    }

    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
  } catch (_err) {
    // ignore error
    return
  }
}

export const setItem = (key: string, value: unknown) => {
  try {
    if (typeof window === 'undefined') {
      return
    }

    if (value === undefined) {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, JSON.stringify(value))
    }

    window.dispatchEvent(new StorageEvent('storage', { key }))
  } catch (_err) {
    // ignore error
  }
}

export const useLocalStorage = <T>(key: string): T | undefined => {
  const [value, setValue] = useState(() => getItem<T>(key))

  useEffect(() => {
    addEventListener('storage', event => {
      if (event.key === key) {
        setValue(getItem(key))
      }
    })
  }, [key])

  return value
}
