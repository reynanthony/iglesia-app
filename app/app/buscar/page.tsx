'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Search, Loader2 } from 'lucide-react'

type UserResult = {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  bio: string | null
  role: string | null
}

const roleBadge: Record<string, { bg: string; text: string; label: string }> = {
  admin:     { bg: 'rgba(239,68,68,0.10)',     text: '#f87171', label: 'Admin' },
  pastor:    { bg: 'rgba(27,122,94,0.12)',      text: '#22A67A', label: 'Pastor' },
  moderador: { bg: 'rgba(27,122,94,0.10)',      text: '#1B7A5E', label: 'Mod' },
  lider:     { bg: 'rgba(128,128,128,0.10)',    text: '#888888', label: 'Líder' },
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
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3" style={{ color: '#4D4D4D' }}>
            — Comunidad
          </p>
          <h1 className="font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: '#F5F5F5' }}>
            Buscar personas.
          </h1>
        </div>

        {/* Buscador */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-8 transition"
          style={{ background: '#161614', border: '1px solid #1A1A1A' }}
        >
          {loading
            ? <Loader2 size={16} style={{ color: '#22A67A', flexShrink: 0 }} className="animate-spin" />
            : <Search size={16} style={{ color: '#4D4D4D', flexShrink: 0 }} />
          }
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre o @usuario..."
            autoComplete="off"
            autoFocus
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: '#F5F5F5' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#4D4D4D] hover:text-[#8A8A8A] transition text-xs">✕</button>
          )}
        </div>

        {/* Skeleton loader */}
        {loading && (
          <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse" style={{ background: '#161614' }}>
                <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: '#222222' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded-full w-32" style={{ background: '#222222' }} />
                  <div className="h-2.5 rounded-full w-20" style={{ background: '#1A1A1A' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && query && users.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <svg width="72" height="64" viewBox="0 0 72 64" fill="none" aria-hidden className="mb-5">
              <circle cx="20" cy="24" r="10" stroke="#22A67A" strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
              <circle cx="20" cy="24" r="5" fill="#22A67A" fillOpacity="0.15"/>
              <circle cx="52" cy="24" r="10" stroke="#22A67A" strokeWidth="1.5" strokeOpacity="0.4" fill="none"/>
              <circle cx="52" cy="24" r="5" fill="#22A67A" fillOpacity="0.15"/>
              <circle cx="36" cy="20" r="12" stroke="#22A67A" strokeWidth="2" strokeOpacity="0.6" fill="none"/>
              <circle cx="36" cy="20" r="6" fill="#22A67A" fillOpacity="0.25"/>
              <path d="M29 42 Q36 56 43 42" stroke="#22A67A" strokeWidth="1.2" strokeOpacity="0.25" fill="none" strokeLinecap="round"/>
              <path d="M11 44 Q16 54 24 48" stroke="#22A67A" strokeWidth="1" strokeOpacity="0.18" fill="none" strokeLinecap="round"/>
              <path d="M61 44 Q56 54 48 48" stroke="#22A67A" strokeWidth="1" strokeOpacity="0.18" fill="none" strokeLinecap="round"/>
            </svg>
            <p className="font-bold mb-1" style={{ color: '#F5F5F5' }}>Sin resultados</p>
            <p className="text-sm" style={{ color: '#4D4D4D' }}>No encontramos a &quot;{query}&quot; en la comunidad</p>
          </div>
        )}

        {/* Sin query */}
        {!loading && !query && (
          <div className="text-center py-16 flex flex-col items-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden className="mb-4">
              <circle cx="24" cy="24" r="14" stroke="#2A2A2A" strokeWidth="2" fill="none"/>
              <line x1="34" y1="34" x2="48" y2="48" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="7" stroke="#22A67A" strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
            </svg>
            <p className="text-sm" style={{ color: '#4D4D4D' }}>Escribe un nombre o @usuario para buscar</p>
          </div>
        )}

        {/* Resultados */}
        {!loading && users.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: '#4D4D4D' }}>
              {users.length} resultado{users.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-px rounded-2xl overflow-hidden" style={{ background: '#1A1A1A' }}>
              {users.map((user) => {
                const badge = roleBadge[user.role ?? '']
                return (
                  <Link
                    key={user.id}
                    href={`/app/perfil/${user.username}`}
                    className="flex items-center gap-4 px-5 py-4 transition group"
                    style={{ background: '#161614' }}
                  >
                    <div
                      className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
                      style={{ background: '#1A1A1A', color: '#8A8A8A' }}
                    >
                      {user.avatar_url
                        ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        : user.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate transition" style={{ color: '#F5F5F5' }}>
                        {user.full_name}
                      </p>
                      <p className="text-[12px] truncate" style={{ color: '#4D4D4D' }}>@{user.username}</p>
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
