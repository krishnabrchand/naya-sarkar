import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { defaultLocale, locales, type SiteLocale } from '@/i18n/config'
import { publicPathForPost } from '@/i18n/publicPath'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const out: { locale: SiteLocale; slug: string }[] = []

  for (const locale of locales) {
    const posts = await payload.find({
      collection: 'posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      locale,
      select: {
        slug: true,
      },
    })

    for (const doc of posts.docs ?? []) {
      if (doc.slug) {
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

function resolveLocale(raw: string): SiteLocale {
  return (locales as readonly string[]).includes(raw) ? (raw as SiteLocale) : defaultLocale
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug = '' } = await paramsPromise
  const locale = resolveLocale(rawLocale)
  const decodedSlug = decodeURIComponent(slug)
  const url = publicPathForPost(locale, decodedSlug)
  const post = await queryPostBySlug({ slug: decodedSlug, locale, draft })

  if (!post) return <PayloadRedirects locale={locale} url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound locale={locale} url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((p) => typeof p === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale: rawLocale, slug = '' } = await paramsPromise
  const locale = resolveLocale(rawLocale)
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug, locale, draft })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(
  async ({ slug, locale, draft }: { slug: string; locale: SiteLocale; draft: boolean }) => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      locale,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)
