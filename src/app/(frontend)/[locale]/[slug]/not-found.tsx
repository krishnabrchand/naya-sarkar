'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { notFoundString } from '../string-translation'

export default function NotFound() {
  const params = useParams()
  const locale = params?.locale === 'en' ? 'en' : 'ne'

  const heading = notFoundString.title[locale]
  const message = notFoundString.message[locale]
  const buttonText = notFoundString.buttonText[locale]

  return (
    <div className="container py-20">
      <div className="mx-auto bg-gray-100 p-8 sm:p-12 rounded-lg border border-gray-200 max-w-md">
        <div className="prose max-w-none">
          <h1 className="text-5xl font-bold">{heading}</h1>
          <p className="text-lg mb-4">{message}</p>
        </div>
        <Button asChild variant="default">
          <Link href="/">{buttonText}</Link>
        </Button>
      </div>
    </div>
  )
}
