import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { defaultLocale, locales, type SiteLocale } from '@/i18n/config'
import { publicPathForPage } from '@/i18n/publicPath'

export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const out: { locale: SiteLocale; slug: string }[] = []

  for (const locale of locales) {
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      locale,
      select: {
        slug: true,
      },
    })

    for (const doc of pages.docs ?? []) {
      if (doc.slug && doc.slug !== 'home') {
        out.push({ locale, slug: doc.slug })
      }
    }
  }

  return out
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug = 'home' } = await paramsPromise
  const locale = (locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as SiteLocale)
    : defaultLocale

  const decodedSlug = decodeURIComponent(slug)
  const url = publicPathForPage(locale, decodedSlug === 'home' ? 'home' : decodedSlug)

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects locale={locale} url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound locale={locale} url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: rawLocale, slug = 'home' } = await paramsPromise
  const locale = (locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as SiteLocale)
    : defaultLocale
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: SiteLocale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
