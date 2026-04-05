'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
import type { SiteLocale } from '@/i18n/config'

import { LanguageSwitch } from '@/Header/LanguageSwitch'
import { CMSLink } from '@/components/Link'
import { enablePublicSiteSearch } from '@/config/siteFeatures'
import { prefixLocalizedPath } from '@/utilities/prefixLocalizedPath'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType; locale: SiteLocale }> = ({
  data,
  locale,
}) => {
  const navItems = data?.navItems || []
  const searchHref = prefixLocalizedPath(locale, '/search')

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <LanguageSwitch
        currentLocale={locale}
        showTrailingSeparator={enablePublicSiteSearch}
      />
      {enablePublicSiteSearch && (
        <Link href={searchHref}>
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
      )}
    </nav>
  )
}
