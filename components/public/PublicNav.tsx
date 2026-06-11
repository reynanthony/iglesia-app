'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const PRIMARY_LINKS = [
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/educacion',   label: 'Educación' },
  { href: '/predicas',    label: 'Prédicas' },
  { href: '/en-vivo',    label: 'En Vivo' },
  { href: '/contacto',    label: 'Contacto' },
]

const MORE_LINKS = [
  { href: '/eventos',        label: 'Eventos' },
  { href: '/oracion',        label: 'Oración' },
  { href: '/publicaciones',  label: 'Publicaciones' },
  { href: '/biblia',         label: 'Biblia' },
  { href: '/devocionales',   label: 'Devocionales' },
  { href: '/donaciones',     label: 'Donaciones' },
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
    <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
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

      {/* Más dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className={`public-nav-link flex items-center gap-1${moreActive ? ' active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Más <span aria-hidden="true" className="motion-reduce:transition-none" style={{ opacity: 0.6, display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><ChevronDown size={11} /></span>
        </button>
        {open && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 rounded-xl overflow-hidden z-50"
            style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.15)', minWidth: 160 }}>
            {MORE_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className="block px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition hover:bg-white/5"
                  style={{ color: active ? '#76ABAE' : 'rgba(246,243,235,0.60)' }}>
                  {label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
