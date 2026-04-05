'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { prefixLocalizedPath } from '@/utilities/prefixLocalizedPath'
import type { SiteLocale } from '@/i18n/config'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  locale: SiteLocale
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, locale }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const homeHref = prefixLocalizedPath(locale, '/')

  return (
    <header
      className="relative z-20 border-b border-border "
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="py-8 flex justify-between">
          <Link href={homeHref}>
            <Logo loading="eager" priority="high" />
          </Link>
          <HeaderNav data={data} locale={locale} />
        </div>
      </div>
    </header>
  )
}
