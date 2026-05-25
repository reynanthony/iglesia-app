'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Cross } from 'lucide-react'

const links = [
  { href: '/',           label: 'Inicio' },
  { href: '/nosotros',   label: 'Nosotros' },
  { href: '/ministerios',label: 'Ministerios' },
  { href: '/eventos',    label: 'Eventos' },
  { href: '/predicas',   label: 'Prédicas' },
  { href: '/contacto',   label: 'Contacto' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        className="p-2 text-[#111111]/50 hover:text-[#111111] transition"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm w-full cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            tabIndex={-1}
          />
          <div
            id="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed top-0 right-0 h-full w-72 bg-[#FFFFFF] border-l border-[#111111]/[0.08] z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 h-14 border-b border-[#111111]/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#000000] flex items-center justify-center text-white rounded"><Cross size={11} strokeWidth={2.5} /></div>
                <span className="font-black text-[#111111] text-sm tracking-tight">El Manantial</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-[#111111]/40 hover:text-[#111111] transition rounded-lg focus-visible:outline-2 focus-visible:outline-[#000000]"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1" aria-label="Navegación principal">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/50 hover:text-[#111111] hover:bg-[#111111]/[0.04] rounded-xl transition focus-visible:outline-2 focus-visible:outline-[#000000]"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="px-4 py-6 border-t border-[#111111]/[0.08]">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#000000] hover:bg-[#222222] text-white font-black text-[11px] uppercase tracking-[0.2em] px-4 py-3.5 rounded-xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#000000]"
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
