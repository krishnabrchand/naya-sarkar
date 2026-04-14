import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'
import { locales, type SiteLocale } from '@/i18n/config'
import { publicPathForPage } from '@/i18n/publicPath'
import { triggerRemoteRevalidation } from '@/utilities/triggerRemoteRevalidation'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
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
        const path = publicPathForPage(locale, doc.slug === 'home' ? 'home' : doc.slug)
        payload.logger.info(`Revalidating page at path: ${path}`)
        revalidatePath(path)
        pathsToRevalidate.push(path)
      }
      revalidateTag('pages-sitemap', 'max')
      tagsToRevalidate.push('pages-sitemap')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      for (const loc of locales) {
        const locale = loc as SiteLocale
        const oldPath = publicPathForPage(
          locale,
          previousDoc.slug === 'home' ? 'home' : previousDoc.slug,
        )
        payload.logger.info(`Revalidating old page at path: ${oldPath}`)
        revalidatePath(oldPath)
        pathsToRevalidate.push(oldPath)
      }
      revalidateTag('pages-sitemap', 'max')
      tagsToRevalidate.push('pages-sitemap')
    }

    void triggerRemoteRevalidation({
      paths: pathsToRevalidate,
      tags: tagsToRevalidate,
      logger: payload.logger,
    })
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const pathsToRevalidate: string[] = []
    for (const loc of locales) {
      const locale = loc as SiteLocale
      const slug = doc?.slug ?? 'home'
      const path = publicPathForPage(locale, slug === 'home' ? 'home' : slug)
      revalidatePath(path)
      pathsToRevalidate.push(path)
    }
    revalidateTag('pages-sitemap', 'max')

    void triggerRemoteRevalidation({
      paths: pathsToRevalidate,
      tags: ['pages-sitemap'],
    })
  }

  return doc
}
