import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return Response.json({ status: 'error', message: 'CRON_SECRET not configured' }, { status: 500 })
  }

  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${secret}`) {
    return Response.json({ status: 'error', message: 'Unauthorized' }, { status: 401 })
  }

  const timestamp = new Date().toISOString()

  try {
    const payload = await getPayload({ config })

    // Lightweight DB probe — runs a raw SELECT 1 via the postgres pool
    const db = payload.db as { pool?: { query: (sql: string) => Promise<unknown> } }
    if (!db.pool) {
      throw new Error('Database pool not available')
    }
    await db.pool.query('SELECT 1')

    payload.logger.info({ message: `DB health check passed at ${timestamp}` })

    return Response.json({ status: 'ok', timestamp })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)

    return Response.json({ status: 'error', message, timestamp }, { status: 503 })
  }
}
