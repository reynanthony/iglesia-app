'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users2, Flame, User, Bell,
  UsersRound, BookOpen, Radio, MoreHorizontal, X, GraduationCap, Cross,
} from 'lucide-react'

const ACCENT   = '#76ABAE'
const INACTIVE = 'rgba(118,171,174,0.45)'

// Un color de acento por destino — para que el nav no dependa solo del teal.
const AMBER  = '#E3A94C'
const PURPLE = '#A99BD1'
const RED    = '#E37B85'
const GREEN  = '#6FBF8B'

const navItems = [
  { href: '/app/comunidad',       icon: Users2,     label: 'Comunidad',      exact: false, color: ACCENT },
  { href: '/app/grupos',          icon: UsersRound, label: 'Grupos',         exact: false, color: GREEN },
  { href: '/app/oracion',         icon: Flame,      label: 'Oración',        exact: false, color: AMBER },
  { href: '/app/en-vivo',         icon: Radio,      label: 'En Vivo',        exact: false, color: RED },
  { href: '/app/discipulado',     icon: BookOpen,   label: 'Discipulado',    exact: true,  color: PURPLE },
  { href: '/app/pastoral',        icon: Cross,      label: 'Pastoral',       exact: false, color: ACCENT },
  { href: '/app/notificaciones',  icon: Bell,       label: 'Notificaciones', exact: true,  color: ACCENT },
]

interface Props { profileHref: string }

export default function AppNav({ profileHref }: Props) {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {navItems.map(({ href, icon: Icon, label, exact, color }) => {
        const active = isActive(href, exact)
        return (
          <Link key={href} href={href}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
            style={active
              ? {
                  background: `${color}22`,
                  backdropFilter: 'blur(12px) saturate(160%)',
                  border: `1px solid ${color}55`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
                  color: '#F6F3EB',
                }
              : { border: '1px solid transparent', color: INACTIVE }}>
            <Icon size={18} aria-hidden="true" style={{ color: active ? color : INACTIVE, flexShrink: 0 }} strokeWidth={active ? 2.5 : 2} />
            <span className={active ? 'font-bold' : ''}>{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" aria-hidden="true" style={{ background: color }} />}
          </Link>
        )
      })}
    </nav>
  )
}

/* ── Bottom nav móvil ── */

// 4 ítems primarios siempre visibles
const MAIN_ITEMS = [
  { href: '/app/comunidad',   icon: Users2,   label: 'Comunidad',   exact: false, color: ACCENT },
  { href: '/app/discipulado', icon: BookOpen, label: 'Discipulado', exact: true,  color: PURPLE },
  { href: '/app/oracion',     icon: Flame,    label: 'Oración',     exact: false, color: AMBER  },
  { href: '/app/en-vivo',     icon: Radio,    label: 'En Vivo',     exact: false, color: RED    },
]

// Ítems secundarios en la fila expandible
const MORE_ITEMS = [
  { href: '/app/pastoral', icon: Cross,         label: 'Pastoral' },
  { href: '/app/grupos',   icon: UsersRound,    label: 'Grupos'   },
  { href: '/app/mentoria', icon: GraduationCap, label: 'Mentoría' },
]

export function AppBottomNav({ profileHref }: Props) {
  const pathname        = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  const allMore = [...MORE_ITEMS, { href: profileHref, icon: User, label: 'Perfil' }]
  const anyMoreActive = allMore.some(i => isActive(i.href))

  return (
    <div>
      {/* Fila secundaria — se expande hacia arriba */}
      {open && (
        <div
          className="flex items-center"
          style={{
            height: 56,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(6,30,48,0.4)',
            backdropFilter: 'blur(16px) saturate(160%)',
          }}
        >
          {allMore.map(({ href, icon: Icon, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex-1 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', minWidth: 0 }}
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? ACCENT : INACTIVE }}
                />
                <span
                  className="font-semibold text-center w-full truncate"
                  style={{ color: active ? ACCENT : INACTIVE, fontSize: 11, lineHeight: 1.2 }}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Fila principal — siempre visible */}
      <div className="flex" style={{ height: 56 }}>
        {MAIN_ITEMS.map(({ href, icon: Icon, label, exact, color }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => open && setOpen(false)}
              className="flex-1 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', minWidth: 0 }}
            >
              <span
                className="flex items-center justify-center rounded-full transition-all"
                style={active
                  ? {
                      width: 44, height: 28, background: `${color}2E`,
                      backdropFilter: 'blur(12px) saturate(160%)', border: `1px solid ${color}70`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 12px -4px ${color}80`,
                    }
                  : { width: 44, height: 28 }}
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? color : INACTIVE }}
                />
              </span>
              <span
                className="font-semibold truncate w-full text-center"
                style={{ color: active ? color : INACTIVE, fontSize: 12, lineHeight: 1.2 }}
              >
                {label}
              </span>
            </Link>
          )
        })}

        {/* Botón Más / Cerrar */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar más opciones' : 'Más opciones'}
          className="flex-1 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/50"
          style={{
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            minWidth: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {open
            ? <X size={22} strokeWidth={2.5} aria-hidden="true" style={{ color: ACCENT }} />
            : <MoreHorizontal
                size={22}
                aria-hidden="true"
                strokeWidth={anyMoreActive ? 2.5 : 1.8}
                style={{ color: anyMoreActive ? ACCENT : INACTIVE }}
              />
          }
          <span
            className="font-semibold"
            style={{
              color: anyMoreActive || open ? ACCENT : INACTIVE,
              fontSize: 12,
              lineHeight: 1.2,
            }}
          >
            {open ? 'Cerrar' : 'Más'}
          </span>
        </button>
      </div>
    </div>
  )
}
