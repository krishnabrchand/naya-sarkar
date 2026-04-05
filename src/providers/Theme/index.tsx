'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'

import type { Theme, ThemeContextType, ThemePreference } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import {
  defaultTheme,
  getImplicitPreference,
  resolveStoredPreference,
  themeLocalStorageKey,
} from './shared'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((themeToSet: ThemePreference | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      document.documentElement.setAttribute('data-theme', defaultTheme)
      setThemeState(defaultTheme)
      return
    }

    if (themeToSet === 'auto') {
      window.localStorage.setItem(themeLocalStorageKey, 'auto')
      const resolved = getImplicitPreference() ?? defaultTheme
      document.documentElement.setAttribute('data-theme', resolved)
      setThemeState(resolved)
      return
    }

    setThemeState(themeToSet)
    window.localStorage.setItem(themeLocalStorageKey, themeToSet)
    document.documentElement.setAttribute('data-theme', themeToSet)
  }, [])

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    const themeToSet = resolveStoredPreference(preference)

    document.documentElement.setAttribute('data-theme', themeToSet)
    setThemeState(themeToSet)
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
