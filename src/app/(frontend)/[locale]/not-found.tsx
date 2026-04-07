import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFoundString } from './string-translation'

export default async function NotFound() {
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'ne'
  const heading = notFoundString.title[locale as keyof typeof notFoundString.title]
  const message = notFoundString.message[locale as keyof typeof notFoundString.message]
  const buttonText = notFoundString.buttonText[locale as keyof typeof notFoundString.buttonText]
  return (
    <div className="container py-28">
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
