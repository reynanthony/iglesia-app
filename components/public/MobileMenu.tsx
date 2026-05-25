'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/predicas', label: 'Predicas' },
  { href: '/contacto', label: 'Contacto' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="p-2 hover:bg-slate-800 rounded-xl transition">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-slate-950 border-l border-slate-800 z-50 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <p className="font-bold text-sm text-white">Menu</p>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-xl transition">
                <X size={18} className="text-white" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition text-sm"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-3 rounded-xl text-sm transition"
              >
                Entrar a la comunidad
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}