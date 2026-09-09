'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Search, Loader2, X } from 'lucide-react'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

type UserResult = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  bio: string | null
  role: string | null
}

const roleBadge: Record<string, { bg: string; text: string; label: string }> = {
  admin:     { bg: 'rgba(248,113,113,0.10)',        text: '#F87171',                 label: 'Admin' },
  pastor:    { bg: `${GOLD}1F`,         text: GOLD,                 label: 'Pastor' },
  moderador: { bg: 'rgba(134,155,126,0.12)',         text: '#869B7E',                 label: 'Mod' },
  lider:     { bg: 'rgba(255,255,255,0.06)', text: MUTED,  label: 'Líder' },
}

export default function BuscarPage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = useRef(createClient()).current
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!query.trim()) {
      setUsers([])
      setLoading(false)
      return
    }

    setLoading(true)
    timerRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, bio, role')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(20)
      setUsers((data as UserResult[]) ?? [])
      setLoading(false)
    }, 300)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  return (
    <div style={{ background: BG, minHeight: '100%' }}>
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3" style={{ color: MUTED }}>
            — Comunidad
          </p>
          <h1 className="font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: INK }}>
            Buscar personas.
          </h1>
        </div>

        {/* Buscador */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-8 transition"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}
        >
          {loading
            ? <Loader2 size={16} style={{ color: GOLD, flexShrink: 0 }} className="animate-spin" />
            : <Search size={16} style={{ color: '#4A7A8E', flexShrink: 0 }} />
          }
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre o @usuario..."
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
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse" style={{ background: CARD }}>
                <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: BORDER }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded-full w-32" style={{ background: BORDER }} />
                  <div className="h-2.5 rounded-full w-20" style={{ background: CARD }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && query && users.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <svg width="72" height="64" viewBox="0 0 72 64" fill="none" aria-hidden className="mb-5">
              <circle cx="20" cy="24" r="10" stroke={GOLD} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
              <circle cx="20" cy="24" r="5" fill={GOLD} fillOpacity="0.15"/>
              <circle cx="52" cy="24" r="10" stroke={GOLD} strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
              <circle cx="52" cy="24" r="5" fill={GOLD} fillOpacity="0.15"/>
              <circle cx="36" cy="20" r="12" stroke={GOLD} strokeWidth="2" strokeOpacity="0.6" fill="none"/>
              <circle cx="36" cy="20" r="6" fill={GOLD} fillOpacity="0.25"/>
              <path d="M29 42 Q36 56 43 42" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.25" fill="none" strokeLinecap="round"/>
              <path d="M11 44 Q16 54 24 48" stroke={GOLD} strokeWidth="1" strokeOpacity="0.18" fill="none" strokeLinecap="round"/>
              <path d="M61 44 Q56 54 48 48" stroke={GOLD} strokeWidth="1" strokeOpacity="0.18" fill="none" strokeLinecap="round"/>
            </svg>
            <p className="font-bold mb-1" style={{ color: INK }}>Sin resultados</p>
            <p className="text-sm" style={{ color: MUTED }}>No encontramos a &quot;{query}&quot; en la comunidad</p>
          </div>
        )}

        {/* Sin query */}
        {!loading && !query && (
          <div className="text-center py-16 flex flex-col items-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden className="mb-4">
              <circle cx="24" cy="24" r="14" stroke={BORDER} strokeWidth="2" fill="none"/>
              <line x1="34" y1="34" x2="48" y2="48" stroke={BORDER} strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="7" stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
            </svg>
            <p className="text-sm" style={{ color: MUTED }}>Escribe un nombre o @usuario para buscar</p>
          </div>
        )}

        {/* Resultados */}
        {!loading && users.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: MUTED }}>
              {users.length} resultado{users.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: BORDER }}>
              {users.map((user) => {
                const badge = roleBadge[user.role ?? '']
                return (
                  <Link
                    key={user.id}
                    href={`/app/perfil/${user.username}`}
                    className="flex items-center gap-4 px-5 py-4 transition group"
                    style={{ background: CARD }}
                  >
                    <div
                      className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
                      style={{ background: BORDER, color: GOLD }}
                    >
                      {user.avatar_url
                        ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        : user.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate transition" style={{ color: INK }}>
                        {user.full_name}
                      </p>
                      <p className="text-[12px] truncate" style={{ color: MUTED }}>@{user.username}</p>
                    </div>
                    {badge && (
                      <span
                        className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex-shrink-0"
                        style={{ background: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
