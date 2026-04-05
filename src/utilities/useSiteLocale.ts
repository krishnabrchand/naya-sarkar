'use client'

import { useParams } from 'next/navigation'

import { defaultLocale, isLocale, type SiteLocale } from '@/i18n/config'

export function useSiteLocale(): SiteLocale {
  const params = useParams()
  const raw = params?.locale
  return typeof raw === 'string' && isLocale(raw) ? raw : defaultLocale
}
