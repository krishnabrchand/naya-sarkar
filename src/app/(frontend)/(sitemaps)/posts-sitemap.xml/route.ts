import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { locales, type SiteLocale } from '@/i18n/config'
import { publicPathForPost } from '@/i18n/publicPath'

const getPostsSitemap = unstable_cache(
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
      const results = await payload.find({
        collection: 'posts',
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

      for (const post of results.docs ?? []) {
        if (!post?.slug) continue
        combined.push({
          loc: `${base}${publicPathForPost(locale, post.slug)}`,
          lastmod: post.updatedAt || dateFallback,
        })
      }
    }

    return combined
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
