import { defaultLocale } from '@/i18n/config'

/** Prefix a path for links. Default locale has no /ne prefix; English uses /en. */
export function prefixLocalizedPath(locale: string, path: string): string {
  if (!path) return path
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:')
  ) {
    return path
  }

  const [pathname, ...rest] = path.split('?')
  const query = rest.length > 0 ? `?${rest.join('?')}` : ''

  if (pathname === '/' || pathname === '') {
    if (locale === defaultLocale) {
      return query ? `/${query}` : '/'
    }
    return `/${locale}${query}`
  }

  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`

  if (locale === defaultLocale) {
    return `${normalized}${query}`
  }

  const base = `/${locale}${normalized}`.replace(/\/+/g, '/')
  return `${base}${query}`
}
