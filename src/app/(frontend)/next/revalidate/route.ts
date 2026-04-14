import { revalidatePath, revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

type RevalidatePayload = {
  paths?: unknown
  tags?: unknown
}

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return Response.json({ status: 'error', message: 'REVALIDATE_SECRET not configured' }, { status: 500 })
  }

  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${secret}`) {
    return Response.json({ status: 'error', message: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as RevalidatePayload
  const paths = [...new Set(parseStringArray(body.paths))]
  const tags = [...new Set(parseStringArray(body.tags))]

  for (const path of paths) {
    revalidatePath(path)
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }

  return Response.json({
    status: 'ok',
    revalidated: {
      paths,
      tags,
    },
  })
}
