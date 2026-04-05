import { defaultLocale, type SiteLocale } from '@/i18n/config'

/**
 * Public URL path for a CMS page (browser-facing). Default locale has no /ne prefix.
 */
export function publicPathForPage(locale: SiteLocale, slug: string): string {
  const decoded = decodeURIComponent(slug)
  if (decoded === 'home') {
    return locale === defaultLocale ? '/' : `/${locale}`
  }
  const prefix = locale === defaultLocale ? '' : `/${locale}`
  return `${prefix}/${decoded}`.replace(/\/+/g, '/')
}

/**
 * Public URL path for a post.
 */
export function publicPathForPost(locale: SiteLocale, slug: string): string {
  const decoded = decodeURIComponent(slug)
  const prefix = locale === defaultLocale ? '' : `/${locale}`
  return `${prefix}/posts/${decoded}`.replace(/\/+/g, '/')
}
