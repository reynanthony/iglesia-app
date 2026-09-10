import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const BG   = '#101217'
const GOLD = '#C79A2A'

export async function GET() {
  const rays = Array.from({ length: 7 }, (_, i) => {
    const angle = (200 + i * 9) * (Math.PI / 180)
    const len = 2400
    return {
      x1: 1360, y1: 220,
      x2: 1360 + Math.cos(angle) * len,
      y2: 220 + Math.sin(angle) * len,
      opacity: 0.05 - i * 0.005,
    }
  })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex',
          position: 'relative', background: BG, overflow: 'hidden',
        }}
      >
        {/* Resplandor dorado — arriba a la derecha, mismo punto focal que
            el degradado decorativo que ya tiene el hero en el código */}
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex',
            background: `radial-gradient(ellipse 65% 85% at 82% 22%, rgba(199,154,42,0.55), transparent 62%)`,
          }}
        />
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex',
            background: `radial-gradient(ellipse 45% 55% at 15% 95%, rgba(199,154,42,0.10), transparent 65%)`,
          }}
        />

        {/* Rayos de luz — quietos, muy sutiles, abriéndose desde el resplandor */}
        <svg width="1600" height="900" viewBox="0 0 1600 900" style={{ position: 'absolute', inset: 0 }}>
          {rays.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke={GOLD} strokeWidth={3} strokeOpacity={Math.max(r.opacity, 0.01)} />
          ))}
        </svg>

        {/* Grano/textura leve para que no quede una imagen plana */}
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex', opacity: 0.5,
            background: `radial-gradient(circle at 30% 60%, rgba(255,255,255,0.02), transparent 40%)`,
          }}
        />
      </div>
    ),
    {
      width: 1600,
      height: 900,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
  )
}
