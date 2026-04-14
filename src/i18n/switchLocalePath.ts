import { defaultLocale, locales, type SiteLocale } from '@/i18n/config'

/** Build the same page URL in `target` locale (default = unprefixed, English = /en/...). */
export function pathForLocale(pathname: string, target: SiteLocale): string {
  const noQuery = pathname.split('?')[0] || '/'
  const segments = noQuery.split('/').filter(Boolean)
  const first = segments[0]
  const hasLocalePrefix = first ? (locales as readonly string[]).includes(first) : false
  const restPath = hasLocalePrefix ? `/${segments.slice(1).join('/')}` : noQuery
  const normalizedPath = restPath === '/' ? '/' : restPath.replace(/\/+/g, '/')
  const isHomePath = normalizedPath === '/home' || normalizedPath === '/home/'
  const canonicalPath = isHomePath ? '/' : normalizedPath

  if (target === defaultLocale) {
    return canonicalPath
  }

  if (canonicalPath === '/') {
    return `/${target}`
  }

  return `/${target}${canonicalPath}`.replace(/\/+/g, '/')
}

export const localeLabels: Record<SiteLocale, string> = {
  ne: 'नेपाली',
  en: 'English',
}
