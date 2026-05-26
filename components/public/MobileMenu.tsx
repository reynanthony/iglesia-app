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
        style={{ background: '#F5F5F5', color: '#0A0A0A' }}
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
            className="fixed top-0 right-0 h-full w-72 z-50 flex flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-black/[0.07]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-black flex items-center justify-center rounded-lg">
                  <Cross size={12} strokeWidth={2.5} className="text-white" />
                </div>
                <span className="font-black text-sm tracking-tight text-[#111111]">
                  El Manantial
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-black/30 hover:text-black/70 transition"
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
                  className="flex items-center px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-black/40 hover:text-black hover:bg-black/[0.04] rounded-xl transition"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="px-4 py-6 border-t border-black/[0.07]">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-[#222] text-white font-black text-[11px] uppercase tracking-[0.2em] px-4 py-4 rounded-xl transition"
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
