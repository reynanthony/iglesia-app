'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/eventos',     label: 'Eventos' },
  { href: '/predicas',    label: 'Prédicas' },
  { href: '/contacto',    label: 'Contacto' },
]

export default function PublicNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
      {navLinks.map(({ href, label }) => {
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
    </nav>
  )
}
