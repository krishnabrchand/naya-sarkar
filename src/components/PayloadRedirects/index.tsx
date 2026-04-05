import type React from 'react'
import type { Page, Post } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { prefixLocalizedPath } from '@/utilities/prefixLocalizedPath'
import type { SiteLocale } from '@/i18n/config'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
  locale: SiteLocale
}

export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url, locale }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((r) => r.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    const ref = redirectItem.to?.reference
    if (ref?.relationTo && ref.value) {
      const payload = await getPayload({ config: configPromise })
      let slug: string | undefined

      if (typeof ref.value === 'string') {
        const doc = await payload.findByID({
          collection: ref.relationTo,
          id: ref.value,
          locale,
        })
        slug = (doc as Page | Post | undefined)?.slug
      } else if (typeof ref.value === 'object' && ref.value && 'slug' in ref.value) {
        slug = (ref.value as { slug?: string }).slug
      }

      if (slug) {
        const path =
          ref.relationTo === 'pages'
            ? slug === 'home'
              ? '/'
              : `/${slug}`
            : `/posts/${slug}`
        redirect(prefixLocalizedPath(locale, path))
      }
    }
  }

  if (disableNotFound) return null

  notFound()
}
