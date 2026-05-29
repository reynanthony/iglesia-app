'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users2, MessageCircle, Flame, Search, User,
  UsersRound, BookOpen, Radio, MoreHorizontal, X,
} from 'lucide-react'

const ACCENT   = '#76ABAE'
const INACTIVE = 'rgba(118,171,174,0.45)'

const navItems = [
  { href: '/app/comunidad',   icon: Users2,        label: 'Comunidad',   exact: false },
  { href: '/app/grupos',      icon: UsersRound,    label: 'Grupos',      exact: false },
  { href: '/app/buscar',      icon: Search,         label: 'Buscar',      exact: true  },
  { href: '/app/chat',        icon: MessageCircle,  label: 'Chat',        exact: false },
  { href: '/app/oracion',     icon: Flame,          label: 'Oración',     exact: false },
  { href: '/app/en-vivo',     icon: Radio,          label: 'En Vivo',     exact: false },
  { href: '/app/discipulado', icon: BookOpen,       label: 'Discipulado', exact: true  },
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
            style={{ background: active ? '#0D3352' : undefined, color: active ? '#F6F3EB' : INACTIVE }}>
            <Icon size={18} style={{ color: active ? ACCENT : INACTIVE, flexShrink: 0 }} strokeWidth={active ? 2.5 : 2} />
            <span className={active ? 'font-bold' : ''}>{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />}
          </Link>
        )
      })}
    </nav>
  )
}

/* ── Bottom nav móvil ── */
const MAIN_ITEMS = [
  { href: '/app/comunidad', icon: Users2,       label: 'Comunidad', exact: false },
  { href: '/app/en-vivo',   icon: Radio,         label: 'En Vivo',   exact: false },
  { href: '/app/oracion',   icon: Flame,         label: 'Oración',   exact: false },
  { href: '/app/chat',      icon: MessageCircle, label: 'Chat',      exact: false },
]

const MORE_ITEMS = [
  { href: '/app/grupos',      icon: UsersRound, label: 'Grupos'      },
  { href: '/app/discipulado', icon: BookOpen,   label: 'Discipulado' },
  { href: '/app/buscar',      icon: Search,     label: 'Buscar'      },
]

export function AppBottomNav({ profileHref }: Props) {
  const pathname   = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  const profileMoreItem = { href: profileHref, icon: User, label: 'Perfil' }
  const allMoreItems = [...MORE_ITEMS, profileMoreItem]
  const anyMoreActive = allMoreItems.some(i => isActive(i.href))

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Más sheet */}
      {open && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl px-5 pt-4"
          style={{
            background: '#0B2D47',
            borderTop: '1px solid #0D3352',
            paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {/* Handle */}
          <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#0D3352' }} />

          <div className="grid grid-cols-4 gap-3 mb-2">
            {allMoreItems.map(({ href, icon: Icon, label }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl transition"
                  style={{ background: active ? '#0D3352' : 'rgba(13,51,82,0.40)' }}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 1.8}
                    style={{ color: active ? ACCENT : INACTIVE }}
                  />
                  <span
                    className="text-[11px] font-semibold text-center leading-tight"
                    style={{ color: active ? ACCENT : INACTIVE }}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="flex" style={{ height: 56 }}>
        {MAIN_ITEMS.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex-1 flex flex-col items-center justify-center gap-1"
              style={{ WebkitTapHighlightColor: 'transparent', minWidth: 0 }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? ACCENT : INACTIVE }} />
              <span className="font-semibold truncate w-full text-center"
                style={{ color: active ? ACCENT : INACTIVE, fontSize: 12, lineHeight: 1.2 }}>
                {label}
              </span>
            </Link>
          )
        })}

        {/* Más button */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex-1 flex flex-col items-center justify-center gap-1"
          style={{ WebkitTapHighlightColor: 'transparent', minWidth: 0, background: 'none', border: 'none' }}
        >
          {open
            ? <X size={22} strokeWidth={2.5} style={{ color: ACCENT }} />
            : <MoreHorizontal size={22} strokeWidth={anyMoreActive ? 2.5 : 1.8}
                style={{ color: anyMoreActive ? ACCENT : INACTIVE }} />
          }
          <span className="font-semibold"
            style={{ color: anyMoreActive || open ? ACCENT : INACTIVE, fontSize: 12, lineHeight: 1.2 }}>
            Más
          </span>
        </button>
      </div>
    </>
  )
}
