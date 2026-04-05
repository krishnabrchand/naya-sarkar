import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { enablePublicSiteSearch } from '@/config/siteFeatures'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { defaultLocale, locales, type SiteLocale } from '@/i18n/config'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q: string
  }>
}

function resolveLocale(raw: string): SiteLocale {
  return (locales as readonly string[]).includes(raw) ? (raw as SiteLocale) : defaultLocale
}

export default async function Page({ searchParams: searchParamsPromise, params: paramsPromise }: Args) {
  if (!enablePublicSiteSearch) {
    notFound()
  }

  const { q: query } = await searchParamsPromise
  const { locale: rawLocale } = await paramsPromise
  const locale = resolveLocale(rawLocale)
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    locale,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  if (!enablePublicSiteSearch) {
    return { title: 'Not Found' }
  }
  return {
    title: `Payload Website Template Search`,
  }
}
