import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import { locales, type SiteLocale } from '@/i18n/config'
import { publicPathForPost } from '@/i18n/publicPath'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      for (const loc of locales) {
        const locale = loc as SiteLocale
        const path = publicPathForPost(locale, doc.slug)
        payload.logger.info(`Revalidating post at path: ${path}`)
        revalidatePath(path)
      }
      revalidateTag('posts-sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      for (const loc of locales) {
        const locale = loc as SiteLocale
        const oldPath = publicPathForPost(locale, previousDoc.slug)
        payload.logger.info(`Revalidating old post at path: ${oldPath}`)
        revalidatePath(oldPath)
      }
      revalidateTag('posts-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    for (const loc of locales) {
      const locale = loc as SiteLocale
      if (doc?.slug) {
        revalidatePath(publicPathForPost(locale, doc.slug))
      }
    }
    revalidateTag('posts-sitemap', 'max')
  }

  return doc
}
