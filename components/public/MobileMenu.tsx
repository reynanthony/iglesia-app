'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/predicas', label: 'Prédicas' },
  { href: '/contacto', label: 'Contacto' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-zinc-500 hover:text-white transition"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 h-14 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-500 flex items-center justify-center text-xs font-black text-black">✝</div>
                <span className="font-black text-white text-sm tracking-tight">El Manantial</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-zinc-500 hover:text-white transition"
                aria-label="Cerrar menú"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="px-4 py-6 border-t border-zinc-800">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] uppercase tracking-[0.2em] px-4 py-3.5 transition"
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
