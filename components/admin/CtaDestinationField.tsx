'use client'

import { useState } from 'react'
import { Newspaper } from 'lucide-react'

export const NEXT_CAMPAIGN = '__next__'

const field  = "w-full px-3.5 py-2.5 text-sm focus:outline-none rounded-xl"
const fStyle = { background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' } as const

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
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #0D3352' }}>
          {publicaciones.map(p => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSlug(p.slug)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-white/5"
              style={{
                background: slug === p.slug ? 'rgba(118,171,174,0.10)' : '#0B2D47',
                borderBottom: '1px solid #0D3352',
              }}
            >
              <Newspaper size={13} style={{ color: slug === p.slug ? '#76ABAE' : 'rgba(246,243,235,0.30)', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: slug === p.slug ? '#F6F3EB' : 'rgba(246,243,235,0.55)' }}>
                  {p.title}
                </p>
                <p className="text-[10px] font-mono truncate" style={{ color: 'rgba(246,243,235,0.30)' }}>
                  /publicaciones/{p.slug}
                </p>
              </div>
              {slug === p.slug && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke="#76ABAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
          {publicaciones.length === 0 && (
            <p className="px-3.5 py-3 text-[12px]" style={{ color: 'rgba(246,243,235,0.35)', background: '#0B2D47' }}>
              No hay publicaciones activas todavía.
            </p>
          )}
        </div>
      )}

      {mode === 'next' && (
        <p className="text-[11px] leading-relaxed px-1" style={{ color: 'rgba(246,243,235,0.35)' }}>
          Al pulsar el botón se mostrará la siguiente campaña activa. Si no hay más, cierra el anuncio.
        </p>
      )}
    </div>
  )
}
