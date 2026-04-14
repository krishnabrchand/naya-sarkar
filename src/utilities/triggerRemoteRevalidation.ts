type Logger = {
  info: (message: string) => void
  warn: (message: string) => void
}

type RemoteRevalidateInput = {
  paths?: string[]
  tags?: string[]
  logger?: Logger
}

const unique = (items: string[] = []): string[] => [...new Set(items.filter(Boolean))]

export async function triggerRemoteRevalidation({
  paths = [],
  tags = [],
  logger,
}: RemoteRevalidateInput): Promise<void> {
  const endpoint = process.env.FRONTEND_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!endpoint || !secret) return

  const normalizedPaths = unique(paths)
  const normalizedTags = unique(tags)

  if (normalizedPaths.length === 0 && normalizedTags.length === 0) return

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${secret}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        paths: normalizedPaths,
        tags: normalizedTags,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      logger?.warn(`Remote revalidation failed: ${response.status} ${response.statusText}`)
      return
    }

    logger?.info(
      `Remote revalidated ${normalizedPaths.length} paths and ${normalizedTags.length} tags`,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger?.warn(`Remote revalidation request error: ${message}`)
  }
}
