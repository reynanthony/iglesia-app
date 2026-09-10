import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSiteSettings } from '@/lib/site-settings'

export const runtime = 'edge'

const BG = '#101217'
const CARD = '#181A22'
const BORDER = '#292E3B'
const MUTED = '#8B92A2'
const GOLD = '#C79A2A'
const INK = '#FFFFFF'

function excerpt(text: string, max: number) {
  const clean = text.trim().replace(/\s+/g, ' ')
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const { siteName } = await getSiteSettings()

  let authorName = 'Comunidad'
  let content = 'Una comunidad de fe viva donde encontrarás amor, propósito y familia.'

  if (id) {
    try {
      const supabase = createServiceClient()
      const { data } = await supabase
        .from('posts')
        .select('content, profiles(full_name)')
        .eq('id', id)
        .single()
      if (data) {
        authorName = (data.profiles as unknown as { full_name?: string } | null)?.full_name ?? 'Comunidad'
        if (data.content) content = data.content
      }
    } catch { /* usa el texto genérico */ }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: BG,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 12, background: CARD,
              border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width={18} height={18} viewBox="0 0 48 48" fill="none">
              <rect x="21.5" y="9" width="5" height="30" rx="2.5" fill={GOLD} />
              <rect x="9" y="18" width="30" height="5" rx="2.5" fill={GOLD} />
            </svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: INK, letterSpacing: -0.5 }}>
            {siteName}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 980 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: 3 }}>
            {authorName} · Comunidad
          </span>
          <span style={{ fontSize: 40, fontWeight: 800, color: INK, lineHeight: 1.3 }}>
            {excerpt(content, 180)}
          </span>
        </div>

        <span style={{ fontSize: 16, color: MUTED, fontWeight: 600, letterSpacing: 1 }}>
          Comunidad de Fe
        </span>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
