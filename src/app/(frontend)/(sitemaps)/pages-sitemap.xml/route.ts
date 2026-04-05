import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { enablePublicSiteSearch } from '@/config/siteFeatures'
import { locales, type SiteLocale } from '@/i18n/config'
import { publicPathForPage } from '@/i18n/publicPath'
import { prefixLocalizedPath } from '@/utilities/prefixLocalizedPath'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const base = SITE_URL.replace(/\/$/, '')
    const dateFallback = new Date().toISOString()
    const combined: { loc: string; lastmod: string }[] = []

    for (const loc of locales) {
      const locale = loc as SiteLocale
      if (enablePublicSiteSearch) {
        combined.push({
          loc: `${base}${prefixLocalizedPath(locale, '/search')}`,
          lastmod: dateFallback,
        })
      }

      combined.push({
        loc: `${base}${prefixLocalizedPath(locale, '/posts')}`,
        lastmod: dateFallback,
      })

      const results = await payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        locale,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      })

      for (const page of results.docs ?? []) {
        if (!page?.slug) continue
        combined.push({
          loc: `${base}${publicPathForPage(locale, page.slug === 'home' ? 'home' : page.slug)}`,
          lastmod: page.updatedAt || dateFallback,
        })
      }
    }

    return combined
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
