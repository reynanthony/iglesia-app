'use client'

import { useState } from 'react'
import { Newspaper } from 'lucide-react'
import { CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

export const NEXT_CAMPAIGN = '__next__'

const field  = "w-full px-3.5 py-2.5 text-sm focus:outline-none rounded-xl"
const fStyle = { background: CARD, border: `1px solid ${BORDER}`, color: INK } as const

type Mode = 'url' | 'next' | 'publicacion'
type Pub  = { slug: string; title: string }

function detectMode(val: string): Mode {
  if (val === NEXT_CAMPAIGN) return 'next'
  if (val.startsWith('/publicaciones/')) return 'publicacion'
  return 'url'
}

export default function CtaDestinationField({
  defaultValue = '',
  publicaciones = [],
}: {
  defaultValue?: string
  publicaciones?: Pub[]
}) {
  const [mode, setMode] = useState<Mode>(detectMode(defaultValue))
  const [url,  setUrl]  = useState(
    detectMode(defaultValue) === 'url' ? defaultValue : ''
  )
  const [slug, setSlug] = useState(
    defaultValue.startsWith('/publicaciones/')
      ? defaultValue.replace('/publicaciones/', '')
      : (publicaciones[0]?.slug ?? '')
  )

  const ctaValue =
    mode === 'next'        ? NEXT_CAMPAIGN :
    mode === 'publicacion' ? `/publicaciones/${slug}` :
    url

  return (
    <div className="space-y-2">
      <input type="hidden" name="cta_destination" value={ctaValue} />

      <select
        value={mode}
        onChange={e => setMode(e.target.value as Mode)}
        className={field}
        style={fStyle}
      >
        <option value="url">URL o ruta interna</option>
        <option value="publicacion">Publicación editorial</option>
        <option value="next">Ir a siguiente campaña activa</option>
      </select>

      {mode === 'url' && (
        <input
          type="text"
          placeholder="/app/oracion  o  https://..."
          value={url}
          onChange={e => setUrl(e.target.value)}
          className={field}
          style={fStyle}
        />
      )}

      {mode === 'publicacion' && (
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          {publicaciones.map(p => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSlug(p.slug)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-white/5"
              style={{
                background: slug === p.slug ? `${GOLD}1A` : CARD,
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <Newspaper size={13} style={{ color: slug === p.slug ? GOLD : MUTED, flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: slug === p.slug ? INK : MUTED }}>
                  {p.title}
                </p>
                <p className="text-[10px] font-mono truncate" style={{ color: MUTED }}>
                  /publicaciones/{p.slug}
                </p>
              </div>
              {slug === p.slug && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
          {publicaciones.length === 0 && (
            <p className="px-3.5 py-3 text-[12px]" style={{ color: MUTED, background: CARD }}>
              No hay publicaciones activas todavía.
            </p>
          )}
        </div>
      )}

      {mode === 'next' && (
        <p className="text-[11px] leading-relaxed px-1" style={{ color: MUTED }}>
          Al pulsar el botón se mostrará la siguiente campaña activa. Si no hay más, cierra el anuncio.
        </p>
      )}
    </div>
  )
}
