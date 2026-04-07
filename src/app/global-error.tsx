'use client'
import NextError from 'next/error'
import { usePathname } from 'next/navigation'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const pathname = usePathname()
  const locale = pathname?.split('/')?.[1] == 'en' ? 'en' : 'ne'
  return (
    <html lang={locale}>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
