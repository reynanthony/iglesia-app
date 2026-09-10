'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users2, Flame, Home, User,
  UsersRound, Sprout, MoreHorizontal, X, GraduationCap, Cross, Book,
} from 'lucide-react'
import { MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

const INACTIVE = MUTED

// Los 6 grupos de la reestructuración Maranatha (ver manifiesto, sección 6).
// activeMatch cubre las rutas que cada grupo absorbe aunque el link apunte
// solo a la principal — así el ítem se resalta también en sus sub-rutas.
const navItems = [
  { href: '/app/inicio',      icon: Home,       label: 'Inicio',    exact: true,  activeMatch: ['/app/inicio'] },
  { href: '/biblia',          icon: Book,       label: 'Palabra',   exact: false, activeMatch: ['/biblia', '/app/predicas'] },
  { href: '/app/discipulado', icon: Sprout,     label: 'Crecer',    exact: false, activeMatch: ['/app/discipulado', '/app/mentoria', '/app/ministerios'] },
  { href: '/app/oracion',     icon: Flame,      label: 'Orar',      exact: false, activeMatch: ['/app/oracion', '/app/en-vivo'] },
  { href: '/app/grupos',      icon: UsersRound, label: 'Caminar',   exact: false, activeMatch: ['/app/grupos'] },
  { href: '/app/comunidad',   icon: Users2,     label: 'Comunidad', exact: false, activeMatch: ['/app/comunidad'] },
]

interface Props { profileHref: string }

export default function AppNav({ profileHref }: Props) {
  const pathname = usePathname()
  const isActive = (matches: string[], exact: boolean) =>
    exact ? matches.includes(pathname) : matches.some(m => pathname.startsWith(m))

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {navItems.map(({ href, icon: Icon, label, exact, activeMatch }) => {
        const active = isActive(activeMatch, exact)
        return (
          <Link key={href} href={href}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A2A]/50"
            style={active
              ? { background: `${GOLD}1E`, border: `1px solid ${GOLD}55`, color: INK }
              : { border: '1px solid transparent', color: INACTIVE }}>
            <Icon size={18} aria-hidden="true" style={{ color: active ? GOLD : INACTIVE, flexShrink: 0 }} strokeWidth={active ? 2.5 : 2} />
            <span className={active ? 'font-bold' : ''}>{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" aria-hidden="true" style={{ background: GOLD }} />}
          </Link>
        )
      })}
    </nav>
  )
}

/* ── Bottom nav móvil ── */

// 4 ítems primarios siempre visibles
const MAIN_ITEMS = [
  { href: '/app/inicio',      icon: Home,       label: 'Inicio',  exact: true  },
  { href: '/biblia',          icon: Book,       label: 'Palabra', exact: false },
  { href: '/app/oracion',     icon: Flame,      label: 'Orar',    exact: false },
  { href: '/app/grupos',      icon: UsersRound, label: 'Caminar', exact: false },
]

// Ítems secundarios en la fila expandible
const MORE_ITEMS = [
  { href: '/app/discipulado', icon: Sprout,        label: 'Crecer'    },
  { href: '/app/comunidad',   icon: Users2,        label: 'Comunidad' },
  { href: '/app/pastoral',    icon: Cross,         label: 'Pastoral'  },
  { href: '/app/mentoria',    icon: GraduationCap, label: 'Mentoría'  },
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
          style={{ height: 56, borderBottom: '1px solid #292E3B', background: 'rgba(16,18,23,0.6)' }}
        >
          {allMore.map(({ href, icon: Icon, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex-1 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A2A]/50"
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', minWidth: 0 }}
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? GOLD : INACTIVE }}
                />
                <span
                  className="font-semibold text-center w-full truncate"
                  style={{ color: active ? GOLD : INACTIVE, fontSize: 11, lineHeight: 1.2 }}
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
        {MAIN_ITEMS.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => open && setOpen(false)}
              className="flex-1 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A2A]/50"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', minWidth: 0 }}
            >
              <span
                className="flex items-center justify-center rounded-full transition-all"
                style={active
                  ? { width: 44, height: 28, background: GOLD, boxShadow: '0 4px 12px -4px rgba(255,204,0,0.6)' }
                  : { width: 44, height: 28 }}
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? GOLD_INK : INACTIVE }}
                />
              </span>
              <span
                className="font-semibold truncate w-full text-center"
                style={{ color: active ? GOLD : INACTIVE, fontSize: 12, lineHeight: 1.2 }}
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
          className="flex-1 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A2A]/50"
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
            ? <X size={22} strokeWidth={2.5} aria-hidden="true" style={{ color: GOLD }} />
            : <MoreHorizontal
                size={22}
                aria-hidden="true"
                strokeWidth={anyMoreActive ? 2.5 : 1.8}
                style={{ color: anyMoreActive ? GOLD : INACTIVE }}
              />
          }
          <span
            className="font-semibold"
            style={{ color: anyMoreActive || open ? GOLD : INACTIVE, fontSize: 12, lineHeight: 1.2 }}
          >
            {open ? 'Cerrar' : 'Más'}
          </span>
        </button>
      </div>
    </div>
  )
}
