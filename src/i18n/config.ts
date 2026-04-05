/** Site locales — keep in sync with `localization` in payload.config.ts */
export const defaultLocale = 'ne'

export const locales = ['ne', 'en'] as const

export type SiteLocale = (typeof locales)[number]

export function isLocale(value: string): value is SiteLocale {
  return (locales as readonly string[]).includes(value)
}
