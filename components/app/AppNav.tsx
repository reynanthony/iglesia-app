'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users2, Flame, Home, User,
  UsersRound, Sprout, MoreHorizontal, X, GraduationCap, Cross, Book,
} from 'lucide-react'
import { MUTED, GOLD, GOLD_INK, INK, CARD, BORDER, BG } from '@/lib/gold-theme'

const INACTIVE = MUTED

// Los 6 grupos de la reestructuración Maranatha (ver manifiesto, sección 6).
// activeMatch cubre las rutas que cada grupo absorbe aunque el link apunte
// solo a la principal — así el ítem se resalta también en sus sub-rutas.
const navItems = [
  { href: '/app/inicio',      icon: Home,       label: 'Inicio',    exact: true,  activeMatch: ['/app/inicio'] },
  { href: '/biblia',          icon: Book,       label: 'Palabra',   exact: false, activeMatch: ['/biblia', '/app/predicas'] },
  { href: '/app/discipulado', icon: Sprout,     label: 'Crecer',    exact: false, activeMatch: ['/app/discipulado', '/app/mentoria', '/app/ministerios'] },
  { href: '/app/oracion',     icon: Flame,      label: 'Orar',      exact: false, activeMatch: ['/app/oracion'] },
  { href: '/app/grupos',      icon: UsersRound, label: 'Caminar',   exact: false, activeMatch: ['/app/grupos'] },
  { href: '/app/comunidad',   icon: Users2,     label: 'Comunidad', exact: false, activeMatch: ['/app/comunidad', '/app/en-vivo'] },
]

interface Props { profileHref: string }

export default function AppNav({ profileHref }: Props) {
  const pathname = usePathname()
  const isActive = (matches: string[], exact: boolean) =>
    exact ? matches.includes(pathname) : matches.some(m => pathname.startsWith(m))

  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map(({ href, icon: Icon, label, exact, activeMatch }) => {
        const active = isActive(activeMatch, exact)
        return (
          <Link key={href} href={href}
            className="group relative flex items-center gap-3 pl-4 pr-3 py-2 rounded-2xl text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A2A]/50 hover:bg-white/[0.035]"
            style={active ? { background: `${GOLD}12`, color: INK } : { color: INACTIVE }}
          >
            {/* Indicador lateral de sección activa */}
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full transition-all duration-200"
              style={{ width: 3, height: active ? 20 : 0, background: GOLD }}
              aria-hidden="true"
            />
            <span
              className="flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-200 group-hover:scale-105"
              style={{ width: 32, height: 32, background: active ? `${GOLD}22` : 'transparent' }}
            >
              <Icon size={17} aria-hidden="true" style={{ color: active ? GOLD : INACTIVE }} strokeWidth={active ? 2.4 : 1.9} />
            </span>
            <span className={active ? 'font-bold' : 'font-medium'}>{label}</span>
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" aria-hidden="true" style={{ background: GOLD }} />}
          </Link>
        )
      })}
    </nav>
  )
}

/* ── Bottom nav móvil ── */

// 4 ítems estáticos + Perfil (dinámico, depende de profileHref) = 5 destinos máximo
const MAIN_ITEMS_STATIC = [
  { href: '/app/inicio',    icon: Home,   label: 'Inicio',    exact: true  },
  { href: '/biblia',        icon: Book,   label: 'Palabra',   exact: false },
  { href: '/app/oracion',   icon: Flame,  label: 'Orar',      exact: false },
  { href: '/app/comunidad', icon: Users2, label: 'Comunidad', exact: false },
]

// Ítems secundarios en el panel expandible — Crecer y Caminar viven aquí
// (accesibles también desde Inicio) para no saturar la barra principal.
const MORE_ITEMS = [
  { href: '/app/discipulado', icon: Sprout,        label: 'Crecer'   },
  { href: '/app/grupos',      icon: UsersRound,    label: 'Caminar'  },
  { href: '/app/pastoral',    icon: Cross,         label: 'Pastoral' },
  { href: '/app/mentoria',    icon: GraduationCap, label: 'Mentoría' },
]

export function AppBottomNav({ profileHref }: Props) {
  const pathname        = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  const allMain = [...MAIN_ITEMS_STATIC, { href: profileHref, icon: User, label: 'Perfil', exact: false }]
  const anyMoreActive = MORE_ITEMS.some(i => isActive(i.href))

  return (
    <div>
      {/* Panel expandible — tipo bottom-sheet, con mango y tarjetas */}
      {open && (
        <div
          className="px-3 pt-3"
          style={{
            borderBottom: `1px solid ${BORDER}`,
            background: 'rgba(16,18,23,0.94)',
            backdropFilter: 'blur(22px) saturate(160%)',
            WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          }}
        >
          <div className="w-9 h-1 rounded-full mx-auto mb-3" style={{ background: BORDER }} aria-hidden="true" />
          <div className="grid grid-cols-4 gap-2 pb-3">
            {MORE_ITEMS.map(({ href, icon: Icon, label }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 py-3 rounded-2xl transition-all duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A2A]/50"
                  style={{
                    background: active ? `${GOLD}14` : CARD,
                    border: `1px solid ${active ? `${GOLD}45` : BORDER}`,
                  }}
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: active ? `${GOLD}22` : BG }}
                  >
                    <Icon size={17} aria-hidden="true" strokeWidth={active ? 2.4 : 1.8} style={{ color: active ? GOLD : INACTIVE }} />
                  </span>
                  <span
                    className="font-bold text-center leading-tight"
                    style={{ color: active ? GOLD : INACTIVE, fontSize: 10.5 }}
                  >
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Fila principal — siempre visible */}
      <div className="flex" style={{ height: 56 }}>
        {allMain.map(({ href, icon: Icon, label, exact }) => {
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
                className="flex items-center justify-center rounded-full transition-all duration-200"
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
          <span
            className="flex items-center justify-center rounded-full transition-all duration-200"
            style={open || anyMoreActive
              ? { width: 44, height: 28, background: `${GOLD}1E`, border: `1px solid ${GOLD}55` }
              : { width: 44, height: 28 }}
          >
            {open
              ? <X size={19} strokeWidth={2.5} aria-hidden="true" style={{ color: GOLD }} />
              : <MoreHorizontal
                  size={19}
                  aria-hidden="true"
                  strokeWidth={anyMoreActive ? 2.5 : 1.8}
                  style={{ color: anyMoreActive ? GOLD : INACTIVE }}
                />
            }
          </span>
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
