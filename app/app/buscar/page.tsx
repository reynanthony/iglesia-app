'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Search, Loader2, X } from 'lucide-react'

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
  pastor:    { bg: 'rgba(118,171,174,0.12)',         text: '#76ABAE',                 label: 'Pastor' },
  moderador: { bg: 'rgba(134,155,126,0.12)',         text: '#869B7E',                 label: 'Mod' },
  lider:     { bg: 'rgba(246,243,235,0.06)',         text: 'rgba(246,243,235,0.55)',  label: 'Líder' },
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
    <div style={{ background: '#061E30', minHeight: '100vh' }}>
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3" style={{ color: 'rgba(246,243,235,0.40)' }}>
            — Comunidad
          </p>
          <h1 className="font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
            Buscar personas.
          </h1>
        </div>

        {/* Buscador */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-8 transition"
          style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
        >
          {loading
            ? <Loader2 size={16} style={{ color: '#76ABAE', flexShrink: 0 }} className="animate-spin" />
            : <Search size={16} style={{ color: '#4A7A8E', flexShrink: 0 }} />
          }
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre o @usuario..."
            autoComplete="off"
            autoFocus
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: '#F6F3EB' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 transition hover:bg-[#0D3352]"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} style={{ color: 'rgba(246,243,235,0.40)' }} />
            </button>
          )}
        </div>

        {/* Skeleton loader */}
        {loading && (
          <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: '#0D3352' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse" style={{ background: '#0B2D47' }}>
                <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: '#0D3352' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded-full w-32" style={{ background: '#0D3352' }} />
                  <div className="h-2.5 rounded-full w-20" style={{ background: '#0B2D47' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && query && users.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <svg width="72" height="64" viewBox="0 0 72 64" fill="none" aria-hidden className="mb-5">
              <circle cx="20" cy="24" r="10" stroke="#76ABAE" strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
              <circle cx="20" cy="24" r="5" fill="#76ABAE" fillOpacity="0.15"/>
              <circle cx="52" cy="24" r="10" stroke="#76ABAE" strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
              <circle cx="52" cy="24" r="5" fill="#76ABAE" fillOpacity="0.15"/>
              <circle cx="36" cy="20" r="12" stroke="#76ABAE" strokeWidth="2" strokeOpacity="0.6" fill="none"/>
              <circle cx="36" cy="20" r="6" fill="#76ABAE" fillOpacity="0.25"/>
              <path d="M29 42 Q36 56 43 42" stroke="#76ABAE" strokeWidth="1.2" strokeOpacity="0.25" fill="none" strokeLinecap="round"/>
              <path d="M11 44 Q16 54 24 48" stroke="#76ABAE" strokeWidth="1" strokeOpacity="0.18" fill="none" strokeLinecap="round"/>
              <path d="M61 44 Q56 54 48 48" stroke="#76ABAE" strokeWidth="1" strokeOpacity="0.18" fill="none" strokeLinecap="round"/>
            </svg>
            <p className="font-bold mb-1" style={{ color: '#F6F3EB' }}>Sin resultados</p>
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.40)' }}>No encontramos a &quot;{query}&quot; en la comunidad</p>
          </div>
        )}

        {/* Sin query */}
        {!loading && !query && (
          <div className="text-center py-16 flex flex-col items-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden className="mb-4">
              <circle cx="24" cy="24" r="14" stroke="#0D3352" strokeWidth="2" fill="none"/>
              <line x1="34" y1="34" x2="48" y2="48" stroke="#0D3352" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="7" stroke="#76ABAE" strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
            </svg>
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.40)' }}>Escribe un nombre o @usuario para buscar</p>
          </div>
        )}

        {/* Resultados */}
        {!loading && users.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: 'rgba(246,243,235,0.40)' }}>
              {users.length} resultado{users.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: '#0D3352' }}>
              {users.map((user) => {
                const badge = roleBadge[user.role ?? '']
                return (
                  <Link
                    key={user.id}
                    href={`/app/perfil/${user.username}`}
                    className="flex items-center gap-4 px-5 py-4 transition group"
                    style={{ background: '#0B2D47' }}
                  >
                    <div
                      className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
                      style={{ background: '#0D3352', color: '#76ABAE' }}
                    >
                      {user.avatar_url
                        ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        : user.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate transition" style={{ color: '#F6F3EB' }}>
                        {user.full_name}
                      </p>
                      <p className="text-[12px] truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>@{user.username}</p>
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
