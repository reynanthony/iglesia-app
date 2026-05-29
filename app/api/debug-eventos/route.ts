import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url   = process.env.STRAPI_URL
  const token = process.env.STRAPI_API_TOKEN

  if (!url || !token) return NextResponse.json({ ok: false, error: 'Variables no encontradas' })

  try {
    // Fetch with image relation expanded
    const [r1, r2] = await Promise.all([
      fetch(`${url}/items/eventos?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch(`${url}/items/eventos?limit=5&fields=*,imagen.*`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
    ])
    const [plain, expanded] = await Promise.all([r1.json(), r2.json()])
    return NextResponse.json({ plain: plain.data, expanded: expanded.data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message })
  }
}
