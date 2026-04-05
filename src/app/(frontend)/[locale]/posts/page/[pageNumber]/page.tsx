import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { defaultLocale, locales, type SiteLocale } from '@/i18n/config'

export const revalidate = 600

function resolveLocale(raw: string): SiteLocale {
  return (locales as readonly string[]).includes(raw) ? (raw as SiteLocale) : defaultLocale
}

type Args = {
  params: Promise<{
    locale: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber, locale: rawLocale } = await paramsPromise
  const locale = resolveLocale(rawLocale)

  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    locale,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Website Template Posts Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages: { pageNumber: string }[] = []

  for (const locale of locales) {
    const { totalDocs } = await payload.count({
      collection: 'posts',
      overrideAccess: false,
      locale,
    })

    const totalPages = Math.ceil(totalDocs / 12) || 1

    for (let i = 1; i <= totalPages; i++) {
      if (!pages.some((p) => p.pageNumber === String(i))) {
        pages.push({ pageNumber: String(i) })
      }
    }
  }

  return pages
}
