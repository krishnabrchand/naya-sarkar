import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { triggerRemoteRevalidation } from '@/utilities/triggerRemoteRevalidation'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    revalidateTag('global_header', 'max')
    void triggerRemoteRevalidation({ tags: ['global_header'], logger: payload.logger })
  }

  return doc
}
