'use client'

import { locales, type SiteLocale } from '@/i18n/config'
import { localeLabels, pathForLocale } from '@/i18n/switchLocalePath'
import { Languages } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  currentLocale: SiteLocale
  /** Right border before the next control (e.g. search). Omit when search is hidden. */
  showTrailingSeparator?: boolean
}

export const LanguageSwitch: React.FC<Props> = ({
  currentLocale,
  showTrailingSeparator = false,
}) => {
  const pathname = usePathname() || '/'
  const otherLocales = locales.filter((loc) => loc !== currentLocale)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5',
        showTrailingSeparator && 'border-r border-border pr-3 mr-1',
      )}
      role="navigation"
      aria-label="Switch language"
    >
      {otherLocales.map((loc) => {
        const href = pathForLocale(pathname, loc)
        return (
          <Link
            key={loc}
            href={href}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-medium text-foreground transition-colors text-sm',
              'bg-white border border-border',
            )}
            hrefLang={loc}
          >
            <Languages className="size-4 shrink-0 opacity-70" aria-hidden />
            {localeLabels[loc]}
          </Link>
        )
      })}
    </div>
  )
}
