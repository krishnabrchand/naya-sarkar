import type { PayloadRequest, TypedLocale } from 'payload'

import { defaultLocale, type SiteLocale } from '@/i18n/config'
import { publicPathForPage, publicPathForPost } from '@/i18n/publicPath'

type Props = {
  collection: 'pages' | 'posts'
  slug: string
  req: PayloadRequest
  locale?: TypedLocale | null
}

export const generatePreviewPath = ({ collection, slug, locale }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  const raw = (locale as string | undefined) ?? defaultLocale
  const loc = (raw === 'all' ? defaultLocale : raw) as SiteLocale

  const contentPath =
    collection === 'pages'
      ? publicPathForPage(loc, slug)
      : publicPathForPost(loc, slug)

  const encodedParams = new URLSearchParams({
    slug: encodeURIComponent(slug),
    collection: String(collection),
    path: contentPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  return `/next/preview?${encodedParams.toString()}`
}
