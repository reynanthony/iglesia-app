'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Cross } from 'lucide-react'

const links = [
  { href: '/',            label: 'Inicio' },
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/eventos',     label: 'Eventos' },
  { href: '/predicas',    label: 'Prédicas' },
  { href: '/contacto',    label: 'Contacto' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        aria-label="Abrir menú"
        className="w-9 h-9 flex items-center justify-center rounded-lg transition"
        style={{ background: '#111111', color: '#F5F5F5' }}
      >
        <Menu size={18} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            className="fixed inset-0 z-40 w-full cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            tabIndex={-1}
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer */}
          <div
            id="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed top-0 right-0 h-full w-72 z-50 flex flex-col"
            style={{ background: '#0A0A0A', borderLeft: '1px solid #1F1F1F' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16"
              style={{ borderBottom: '1px solid #1F1F1F' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white flex items-center justify-center rounded-lg">
                  <Cross size={12} strokeWidth={2.5} style={{ color: '#0A0A0A' }} />
                </div>
                <span className="font-black text-sm tracking-tight" style={{ color: '#F5F5F5' }}>
                  El Manantial
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                style={{ color: '#5A5A5A' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 py-6 space-y-0.5" aria-label="Navegación principal">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition"
                  style={{ color: '#8A8A8A' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F5F5F5'; (e.currentTarget as HTMLElement).style.background = '#161616' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8A8A8A'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="px-4 py-6" style={{ borderTop: '1px solid #1F1F1F' }}>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] px-4 py-4 rounded-xl transition"
                style={{ background: '#F5F5F5', color: '#0A0A0A' }}
              >
                Entrar a la comunidad <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
