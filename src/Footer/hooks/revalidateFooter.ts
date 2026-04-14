import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'
import { triggerRemoteRevalidation } from '@/utilities/triggerRemoteRevalidation'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    revalidateTag('global_footer', 'max')
    void triggerRemoteRevalidation({ tags: ['global_footer'], logger: payload.logger })
  }

  return doc
}
