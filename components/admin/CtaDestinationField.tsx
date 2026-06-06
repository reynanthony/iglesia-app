'use client'

import { useState } from 'react'

export const NEXT_CAMPAIGN = '__next__'

const field  = "w-full px-3.5 py-2.5 text-sm focus:outline-none rounded-xl"
const fStyle = { background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' } as const

export default function CtaDestinationField({ defaultValue = '' }: { defaultValue?: string }) {
  const [mode, setMode] = useState<'url' | 'next'>(defaultValue === NEXT_CAMPAIGN ? 'next' : 'url')
  const [url, setUrl]   = useState(defaultValue === NEXT_CAMPAIGN ? '' : defaultValue)

  return (
    <div className="space-y-2">
      <input type="hidden" name="cta_destination" value={mode === 'next' ? NEXT_CAMPAIGN : url} />

      <select
        value={mode}
        onChange={e => setMode(e.target.value as 'url' | 'next')}
        className={field}
        style={fStyle}
      >
        <option value="url">URL o ruta interna</option>
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

      {mode === 'next' && (
        <p className="text-[11px] leading-relaxed px-1" style={{ color: 'rgba(246,243,235,0.35)' }}>
          Al pulsar el botón se mostrará la siguiente campaña activa. Si no hay más, cierra el anuncio.
        </p>
      )}
    </div>
  )
}
