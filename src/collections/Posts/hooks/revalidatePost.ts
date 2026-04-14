import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import { locales, type SiteLocale } from '@/i18n/config'
import { publicPathForPost } from '@/i18n/publicPath'
import { triggerRemoteRevalidation } from '@/utilities/triggerRemoteRevalidation'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const pathsToRevalidate: string[] = []
    const tagsToRevalidate: string[] = []

    if (doc._status === 'published') {
      for (const loc of locales) {
        const locale = loc as SiteLocale
        const path = publicPathForPost(locale, doc.slug)
        payload.logger.info(`Revalidating post at path: ${path}`)
        revalidatePath(path)
        pathsToRevalidate.push(path)
      }
      revalidateTag('posts-sitemap', 'max')
      tagsToRevalidate.push('posts-sitemap')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      for (const loc of locales) {
        const locale = loc as SiteLocale
        const oldPath = publicPathForPost(locale, previousDoc.slug)
        payload.logger.info(`Revalidating old post at path: ${oldPath}`)
        revalidatePath(oldPath)
        pathsToRevalidate.push(oldPath)
      }
      revalidateTag('posts-sitemap', 'max')
      tagsToRevalidate.push('posts-sitemap')
    }

    void triggerRemoteRevalidation({
      paths: pathsToRevalidate,
      tags: tagsToRevalidate,
      logger: payload.logger,
    })
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const pathsToRevalidate: string[] = []
    for (const loc of locales) {
      const locale = loc as SiteLocale
      if (doc?.slug) {
        const path = publicPathForPost(locale, doc.slug)
        revalidatePath(path)
        pathsToRevalidate.push(path)
      }
    }
    revalidateTag('posts-sitemap', 'max')

    void triggerRemoteRevalidation({
      paths: pathsToRevalidate,
      tags: ['posts-sitemap'],
    })
  }

  return doc
}
