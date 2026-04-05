import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { defaultLocale, locales, type SiteLocale } from '@/i18n/config'

const prefixedLocales = locales.filter((l) => l !== defaultLocale) as SiteLocale[]

function withLocaleHeader(response: NextResponse, locale: string): NextResponse {
  response.headers.set('x-locale', locale)
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/next') ||
    pathname.startsWith('/_next') ||
    pathname.match(/sitemap\.xml$/) ||
    pathname === '/robots.txt'
  ) {
    return withLocaleHeader(NextResponse.next(), defaultLocale)
  }

  if (pathname.includes('.') && !pathname.startsWith('/.')) {
    return withLocaleHeader(NextResponse.next(), defaultLocale)
  }

  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]

  // Canonical: strip /ne from URL (default locale is unprefixed)
  if (first === defaultLocale) {
    const rest = segments.slice(1).join('/')
    const target = rest ? `/${rest}` : '/'
    return NextResponse.redirect(new URL(target, request.url))
  }

  // /en/... — non-default locale in URL
  if (first && prefixedLocales.includes(first as SiteLocale)) {
    return withLocaleHeader(NextResponse.next(), first)
  }

  // Unprefixed path — default locale; rewrite internally to /ne/... for [locale] routes
  const rewritePath = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  const res = NextResponse.rewrite(new URL(rewritePath, request.url))
  return withLocaleHeader(res, defaultLocale)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
