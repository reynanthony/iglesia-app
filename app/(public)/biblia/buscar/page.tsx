'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Loader2, X } from 'lucide-react'
import { searchBibleText } from '@/app/actions/bible-search'
import type { BibleSearchHit } from '@/lib/bible-content'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

export default function BuscarBibliaPage() {
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<BibleSearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (query.trim().length < 3) {
      setHits([])
      setLoading(false)
      return
    }

    setLoading(true)
    timerRef.current = setTimeout(async () => {
      const results = await searchBibleText(query)
      setHits(results)
      setLoading(false)
    }, 300)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <Link href="/biblia"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.30em] mb-5 transition hover:opacity-70"
            style={{ color: MUTED }}>
            <ArrowLeft size={11} /> Biblia
          </Link>
          <h1 className="font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: INK }}>
            Buscar en la Biblia.
          </h1>
        </div>

        {/* Buscador */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-8 transition"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}
        >
          {loading
            ? <Loader2 size={16} style={{ color: GOLD, flexShrink: 0 }} className="animate-spin" />
            : <Search size={16} style={{ color: MUTED, flexShrink: 0 }} />
          }
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Palabra o frase (mín. 3 letras)…"
            autoComplete="off"
            autoFocus
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: INK }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 transition hover:bg-[#292E3B]"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} style={{ color: MUTED }} />
            </button>
          )}
        </div>

        {/* Skeleton loader */}
        {loading && (
          <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: BORDER }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-5 py-4 animate-pulse space-y-2" style={{ background: CARD }}>
                <div className="h-2.5 rounded-full w-24" style={{ background: BORDER }} />
                <div className="h-3 rounded-full w-full" style={{ background: BORDER }} />
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && query.trim().length >= 3 && hits.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden className="mb-4">
              <circle cx="24" cy="24" r="14" stroke={GOLD} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
              <line x1="34" y1="34" x2="48" y2="48" stroke={GOLD} strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round"/>
            </svg>
            <p className="font-bold mb-1" style={{ color: INK }}>Sin resultados</p>
            <p className="text-sm" style={{ color: MUTED }}>No encontramos &quot;{query}&quot; en el texto (RVR1960)</p>
          </div>
        )}

        {/* Sin query / query muy corta */}
        {!loading && query.trim().length < 3 && (
          <div className="text-center py-16 flex flex-col items-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden className="mb-4">
              <circle cx="24" cy="24" r="14" stroke={BORDER} strokeWidth="2" fill="none"/>
              <line x1="34" y1="34" x2="48" y2="48" stroke={BORDER} strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="7" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
            </svg>
            <p className="text-sm" style={{ color: MUTED }}>Escribe al menos 3 letras para buscar</p>
          </div>
        )}

        {/* Resultados */}
        {!loading && hits.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: MUTED }}>
              {hits.length} resultado{hits.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: BORDER }}>
              {hits.map((hit) => (
                <Link
                  key={`${hit.bookId}-${hit.chapter}-${hit.verse}`}
                  href={`/biblia/lectura/${hit.bookId}/${hit.chapter}?verse=${hit.verse}`}
                  className="block px-5 py-4 transition"
                  style={{ background: CARD }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1.5" style={{ color: GOLD }}>
                    {hit.ref}
                  </p>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: INK }}>
                    {hit.text}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
