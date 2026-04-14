import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { triggerRemoteRevalidation } from '@/utilities/triggerRemoteRevalidation'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)

  revalidateTag('redirects', 'max')
  void triggerRemoteRevalidation({ tags: ['redirects'], logger: payload.logger })

  return doc
}
