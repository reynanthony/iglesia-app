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
            className={[
              'text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-200 pb-0.5',
              'border-b-[1.5px]',
              active
                ? 'text-[#F6F3EB] border-[#76ABAE]'
                : 'text-[rgba(246,243,235,0.40)] border-transparent hover:text-[#F6F3EB] hover:border-[rgba(118,171,174,0.50)]',
            ].join(' ')}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
