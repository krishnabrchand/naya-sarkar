import { defaultLocale, type SiteLocale } from '@/i18n/config'

/** Build the same page URL in `target` locale (default = unprefixed, English = /en/...). */
export function pathForLocale(pathname: string, target: SiteLocale): string {
  const noQuery = pathname.split('?')[0] || '/'

  if (target === defaultLocale) {
    if (noQuery === '/en') return '/'
    if (noQuery.startsWith('/en/')) {
      return `/${noQuery.slice(4)}`
    }
    return noQuery
  }

  if (noQuery === '/en' || noQuery.startsWith('/en/')) {
    return noQuery
  }
  if (noQuery === '/') {
    return '/en'
  }
  return `/en${noQuery}`
}

export const localeLabels: Record<SiteLocale, string> = {
  ne: 'नेपाली',
  en: 'English',
}
