'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Calendar, Flame, Newspaper, Book, Quote, HeartHandshake } from 'lucide-react'
import { CARD, MUTED, GOLD } from '@/lib/gold-theme'

const PRIMARY_LINKS = [
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/educacion',   label: 'Educación' },
  { href: '/predicas',    label: 'Prédicas' },
  { href: '/en-vivo',    label: 'En Vivo' },
  { href: '/contacto',    label: 'Contacto' },
]

const MORE_LINKS = [
  { href: '/biblia',         label: 'Biblia',        desc: 'Lee y sigue tu progreso',   icon: Book },
  { href: '/oracion',        label: 'Oración',       desc: 'Comparte una petición',     icon: Flame },
  { href: '/eventos',        label: 'Eventos',       desc: 'Agenda de la comunidad',    icon: Calendar },
  { href: '/devocionales',   label: 'Devocionales',  desc: 'Reflexión del día',         icon: Quote },
  { href: '/publicaciones',  label: 'Publicaciones', desc: 'Artículos y novedades',     icon: Newspaper },
  { href: '/donaciones',     label: 'Donaciones',    desc: 'Apoya la misión',           icon: HeartHandshake },
]

export default function PublicNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const moreActive = MORE_LINKS.some(l => pathname === l.href || pathname.startsWith(l.href + '/'))

  return (
    <nav
      className="hidden md:flex items-center gap-0.5 flex-1 justify-center px-1.5 py-1.5 rounded-full"
      style={{ background: 'rgba(246,243,235,0.03)', border: '1px solid rgba(246,243,235,0.07)' }}
    >
      {PRIMARY_LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`public-nav-link${active ? ' active' : ''}`}
          >
            {label}
          </Link>
        )
      })}

      {/* Más — mega-menu */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] rounded-full pl-3.5 pr-3 py-1.5 transition-colors"
          style={{
            color: moreActive || open ? '#F6F3EB' : 'rgba(246,243,235,0.68)',
            background: open ? 'rgba(246,243,235,0.08)' : 'transparent',
            border: `1px solid ${open ? 'rgba(246,243,235,0.16)' : 'transparent'}`,
            cursor: 'pointer',
          }}
        >
          Más
          <ChevronDown
            size={12}
            aria-hidden="true"
            style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>
        {open && (
          <div
            className="absolute top-full right-0 mt-3 rounded-2xl overflow-hidden z-50 grid grid-cols-2 gap-1 p-2"
            style={{ background: CARD, border: '1px solid rgba(199,154,42,0.18)', width: 380, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.5)' }}
          >
            {MORE_LINKS.map(({ href, label, desc, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.06]"
                  style={{ background: active ? 'rgba(199,154,42,0.10)' : 'transparent' }}>
                  <span
                    className="flex items-center justify-center rounded-lg flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{ width: 32, height: 32, background: active ? 'rgba(199,154,42,0.18)' : 'rgba(246,243,235,0.06)' }}
                  >
                    <Icon size={15} style={{ color: active ? GOLD : '#F6F3EB' }} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11.5px] font-bold uppercase tracking-[0.08em]" style={{ color: active ? GOLD : '#F6F3EB' }}>
                      {label}
                    </span>
                    <span className="block text-[11px] mt-0.5 leading-snug" style={{ color: MUTED }}>
                      {desc}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
