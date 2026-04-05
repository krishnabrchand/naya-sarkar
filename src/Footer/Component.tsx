import { getCachedGlobal } from '@/utilities/getGlobals'
import { prefixLocalizedPath } from '@/utilities/prefixLocalizedPath'
import type { SiteLocale } from '@/i18n/config'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { themeSelector } from '@/config/siteFeatures'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer({ locale }: { locale: SiteLocale }) {
  const footerData: Footer = await getCachedGlobal('footer', 1, locale)()

  const navItems = footerData?.navItems || []
  const homeHref = prefixLocalizedPath(locale, '/')

  return (
    <footer className="mt-auto border-t border-border bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href={homeHref}>
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          {themeSelector ? <ThemeSelector /> : null}
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
