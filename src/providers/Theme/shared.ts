import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'

export const defaultTheme: Theme = 'light'

export const getImplicitPreference = (): Theme | null => {
  const mediaQuery = '(prefers-color-scheme: dark)'
  const mql = window.matchMedia(mediaQuery)
  const hasImplicitPreference = typeof mql.matches === 'boolean'

  if (hasImplicitPreference) {
    return mql.matches ? 'dark' : 'light'
  }

  return null
}

/** Resolve `data-theme` from localStorage value (default: light; `auto` follows OS). */
export const resolveStoredPreference = (stored: string | null): Theme => {
  if (stored === 'light' || stored === 'dark') return stored
  if (stored === 'auto') {
    return getImplicitPreference() ?? defaultTheme
  }
  return defaultTheme
}
