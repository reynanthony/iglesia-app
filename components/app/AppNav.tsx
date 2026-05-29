'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users2, MessageCircle, Mic2, Search, User } from 'lucide-react'

const ACCENT = '#76ABAE'
const INACTIVE_COLOR = 'rgba(118,171,174,0.45)'

const navItems = [
  { href: '/app/comunidad', icon: Users2,         label: 'Comunidad', exact: false },
  { href: '/app/buscar',    icon: Search,          label: 'Buscar',    exact: true  },
  { href: '/app/chat',      icon: MessageCircle,   label: 'Chat',      exact: false },
  { href: '/app/oracion',   icon: Mic2,            label: 'Oración',   exact: false },
]

interface Props { profileHref: string }

export default function AppNav({ profileHref }: Props) {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {navItems.map(({ href, icon: Icon, label, exact }) => {
        const active = isActive(href, exact)
        return (
          <Link key={href} href={href}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: active ? '#0D3352' : undefined, color: active ? '#F6F3EB' : INACTIVE_COLOR }}>
            <Icon size={18} style={{ color: active ? ACCENT : INACTIVE_COLOR, flexShrink: 0 }} strokeWidth={active ? 2.5 : 2} />
            <span className={active ? 'font-bold' : ''}>{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppBottomNav({ profileHref }: Props) {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const items = [
    { href: '/app/comunidad', icon: Users2,         label: 'Comunidad', exact: false },
    { href: '/app/buscar',    icon: Search,          label: 'Buscar',    exact: true  },
    { href: '/app/chat',      icon: MessageCircle,   label: 'Chat',      exact: false },
    { href: '/app/oracion',   icon: Mic2,            label: 'Oración',   exact: false },
    { href: profileHref,      icon: User,            label: 'Perfil',    exact: false },
  ]

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
              size={22}
              strokeWidth={active ? 2.5 : 1.8}
              style={{ color: active ? ACCENT : INACTIVE_COLOR }}
            />
            <span
              className="text-[12px] font-semibold tracking-wide"
              style={{ color: active ? ACCENT : INACTIVE_COLOR, lineHeight: 1 }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
