'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, Mic, Search, PlusSquare, User } from 'lucide-react'

const navItems = [
  { href: '/app/feed',    icon: Home,          label: 'Feed',    exact: true  },
  { href: '/app/buscar',  icon: Search,         label: 'Buscar',  exact: true  },
  { href: '/app/chat',    icon: MessageCircle,  label: 'Chat',    exact: false },
  { href: '/app/oracion', icon: Mic,            label: 'Oración', exact: false },
]

interface Props {
  profileHref: string
}

export default function AppNav({ profileHref }: Props) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/* ── SIDEBAR NAV (desktop) ── */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active ? 'font-bold' : 'hover:bg-[#111111]'
              }`}
              style={{
                background: active ? '#181818' : undefined,
                color: active ? '#F5F5F5' : '#8A8A8A',
              }}
            >
              <Icon size={18} style={{ color: active ? '#000000' : '#4D4D4D', flexShrink: 0 }} />
              <span className="tracking-wide">{label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#000000] flex-shrink-0" />}
            </Link>
          )
        })}

        {/* Publicar */}
        <div className="pt-3 pb-1">
          <Link
            href="/app/nuevo-post"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-[#181818]"
            style={{ color: '#000000' }}
          >
            <PlusSquare size={18} style={{ flexShrink: 0 }} />
            <span className="tracking-wide">Publicar</span>
          </Link>
        </div>
      </nav>

      {/* ── BOTTOM NAV (mobile) — rendered at page level via portal pattern ── */}
    </>
  )
}

export function AppBottomNav({ profileHref }: Props) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const allItems = [
    ...navItems,
    { href: profileHref, icon: User, label: 'Perfil', exact: false },
  ]

  return (
    <div className="flex items-center justify-around px-2 py-1">
      {allItems.map(({ href, icon: Icon, label, exact }) => {
        const active = isActive(href, exact)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition"
            style={{ color: active ? '#000000' : '#4D4D4D' }}
          >
            <Icon size={22} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
          </Link>
        )
      })}
      <Link href="/app/nuevo-post" className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center -mt-4 shadow-lg"
          style={{ background: '#000000', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}
        >
          <PlusSquare size={20} style={{ color: '#0A0A0A' }} />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#4D4D4D' }}>Post</span>
      </Link>
    </div>
  )
}
