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
        className="p-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5"
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 bg-slate-950 border-l border-white/5 z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-sm font-bold">✝</div>
                <p className="font-bold text-sm text-white">El Manantial</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-white/5"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition text-sm font-medium"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="px-4 py-6 border-t border-white/5">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-full text-sm transition"
              >
                Entrar a la comunidad <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
