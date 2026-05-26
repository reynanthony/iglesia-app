'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, Mic2, Search, Plus, User } from 'lucide-react'

const navItems = [
  { href: '/app/feed',    icon: Home,          label: 'Feed',    exact: true  },
  { href: '/app/buscar',  icon: Search,         label: 'Buscar',  exact: true  },
  { href: '/app/chat',    icon: MessageCircle,  label: 'Chat',    exact: false },
  { href: '/app/oracion', icon: Mic2,           label: 'Oración', exact: false },
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
            style={{ background: active ? '#181818' : undefined, color: active ? '#F5F5F5' : '#8A8A8A' }}>
            <Icon size={18} style={{ color: active ? '#F5F5F5' : '#4D4D4D', flexShrink: 0 }} strokeWidth={active ? 2.5 : 2} />
            <span className={active ? 'font-bold' : ''}>{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#F5F5F5' }} />}
          </Link>
        )
      })}
      <div className="pt-3">
        <Link href="/app/nuevo-post"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-[#181818]"
          style={{ color: '#F5F5F5' }}>
          <Plus size={18} style={{ flexShrink: 0 }} strokeWidth={2.5} />
          Publicar
        </Link>
      </div>
    </nav>
  )
}

export function AppBottomNav({ profileHref }: Props) {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const leftItems = [
    { href: '/app/feed',    icon: Home,          label: 'Inicio',  exact: true  },
    { href: '/app/buscar',  icon: Search,         label: 'Buscar',  exact: true  },
  ]
  const rightItems = [
    { href: '/app/chat',    icon: MessageCircle,  label: 'Chat',    exact: false },
    { href: '/app/oracion', icon: Mic2,           label: 'Oración', exact: false },
    { href: profileHref,    icon: User,           label: 'Perfil',  exact: false },
  ]

  const NavItem = ({ href, icon: Icon, label, exact }: typeof leftItems[0]) => {
    const active = isActive(href, exact)
    return (
      <Link href={href}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[52px] active:opacity-70 transition-opacity"
        style={{ WebkitTapHighlightColor: 'transparent' }}>
        <Icon
          size={24}
          strokeWidth={active ? 2.5 : 1.8}
          style={{ color: active ? '#F5F5F5' : '#4D4D4D' }}
        />
        <span
          className="text-[10px] font-semibold tracking-wide"
          style={{ color: active ? '#F5F5F5' : '#4D4D4D', lineHeight: 1 }}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <div className="flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: 56 }}>
      {/* Left items */}
      {leftItems.map(item => <NavItem key={item.href} {...item} />)}

      {/* Center post button */}
      <Link href="/app/nuevo-post"
        className="flex-1 flex flex-col items-center justify-center py-2 active:opacity-70 transition-opacity"
        style={{ WebkitTapHighlightColor: 'transparent' }}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: '#F5F5F5',
            boxShadow: '0 2px 12px rgba(245,245,245,0.12)',
            marginTop: -6,
          }}>
          <Plus size={22} strokeWidth={2.5} style={{ color: '#0A0A0A' }} />
        </div>
      </Link>

      {/* Right items */}
      {rightItems.map(item => <NavItem key={item.href} {...item} />)}
    </div>
  )
}
