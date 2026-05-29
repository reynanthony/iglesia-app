'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Mic2, CalendarDays, Globe2 } from 'lucide-react'

const ACCENT   = '#76ABAE'
const INACTIVE = 'rgba(246,243,235,0.35)'

const items = [
  { href: '/admin',           icon: LayoutDashboard, label: 'Dashboard', exact: true  },
  { href: '/admin/usuarios',  icon: Users,            label: 'Usuarios',  exact: false },
  { href: '/admin/predicas',  icon: Mic2,             label: 'Prédicas',  exact: false },
  { href: '/admin/eventos',   icon: CalendarDays,     label: 'Eventos',   exact: false },
  { href: '/admin/paginas',   icon: Globe2,           label: 'Páginas',   exact: false },
]

export default function AdminMobileNav() {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div
      className="flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: 56 }}
    >
      {items.map(({ href, icon: Icon, label, exact }) => {
        const active = isActive(href, exact)
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[52px] active:opacity-70 transition-opacity"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.5 : 1.8}
              style={{ color: active ? ACCENT : INACTIVE }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: active ? ACCENT : INACTIVE, lineHeight: 1 }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
