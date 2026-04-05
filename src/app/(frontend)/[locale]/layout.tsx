import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { defaultLocale, isLocale, locales, type SiteLocale } from '@/i18n/config'
import React from 'react'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params
  const locale: SiteLocale = isLocale(raw) ? raw : defaultLocale

  return (
    <>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </>
  )
}
