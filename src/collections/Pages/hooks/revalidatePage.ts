import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'
import { defaultLocale, locales, type SiteLocale } from '@/i18n/config'
import { publicPathForPage } from '@/i18n/publicPath'
import { triggerRemoteRevalidation } from '@/utilities/triggerRemoteRevalidation'

const addPagePathForRevalidation = (paths: string[], locale: SiteLocale, slug: string): void => {
  const path = publicPathForPage(locale, slug)
  revalidatePath(path)
  paths.push(path)

  if (slug === 'home' && locale === defaultLocale) {
    const internalLocaleRoot = `/${defaultLocale}`
    revalidatePath(internalLocaleRoot)
    paths.push(internalLocaleRoot)
  }
}

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
        const slug = doc.slug === 'home' ? 'home' : doc.slug
        payload.logger.info(`Revalidating page at path: ${publicPathForPage(locale, slug)}`)
        addPagePathForRevalidation(pathsToRevalidate, locale, slug)
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
        addPagePathForRevalidation(
          pathsToRevalidate,
          locale,
          previousDoc.slug === 'home' ? 'home' : previousDoc.slug,
        )
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
      addPagePathForRevalidation(pathsToRevalidate, locale, slug === 'home' ? 'home' : slug)
    }
    revalidateTag('pages-sitemap', 'max')

    void triggerRemoteRevalidation({
      paths: pathsToRevalidate,
      tags: ['pages-sitemap'],
    })
  }

  return doc
}
