'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Mail, ShieldAlert, Shield,
  Menu, X, FileText, UsersRound, BookOpen, Radio, ScrollText,
  Bell, UserCheck, Cross, Mic, Megaphone, Zap,
  Globe, ArrowLeft, LogOut, Newspaper, Building2,
  Layers, Church, Calendar, Video, Quote, CalendarDays,
} from 'lucide-react'
import { BG, CARD as SURFACE, BORDER, MUTED as INACTIVE, GOLD as ACCENT, GOLD_INK, INK } from '@/lib/gold-theme'

const ADMIN_PRIMARY = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard', exact: true  },
  { href: '/admin/posts',    icon: FileText,        label: 'Posts',     exact: false },
  { href: '/admin/mensajes', icon: Mail,            label: 'Mensajes',  exact: false },
  { href: '/admin/usuarios', icon: Users,           label: 'Usuarios',  exact: false },
]

const LIDER_PRIMARY = [
  { href: '/admin/ministerio',           icon: Building2,  label: 'Inicio',     exact: true  },
  { href: '/admin/ministerio/contenido', icon: FileText,   label: 'Contenido',  exact: false },
  { href: '/admin/ministerio/grupos',    icon: UsersRound, label: 'Grupos',     exact: false },
  { href: '/admin/ministerio/anuncios',  icon: Megaphone,  label: 'Anuncios',   exact: false },
]

const ADMIN_MENU_SECTIONS = [
  {
    label: 'Sitio web',
    items: [
      { href: '/admin/paginas',      icon: Layers,   label: 'Editor de páginas' },
      { href: '/admin/ministerios',  icon: Church,   label: 'Ministerios'      },
      { href: '/admin/eventos',      icon: Calendar, label: 'Eventos'          },
      { href: '/admin/predicas',     icon: Video,    label: 'Prédicas'         },
      { href: '/admin/devocionales', icon: Quote,    label: 'Devocionales'     },
    ],
  },
  {
    label: 'Gente',
    items: [
      { href: '/admin/usuarios', icon: Users,      label: 'Usuarios' },
      { href: '/admin/lideres',  icon: UserCheck,  label: 'Líderes'  },
      { href: '/admin/grupos',   icon: UsersRound, label: 'Grupos'   },
    ],
  },
  {
    label: 'Contenido comunitario',
    items: [
      { href: '/admin/posts',         icon: FileText,  label: 'Posts'         },
      { href: '/admin/publicaciones', icon: Newspaper, label: 'Publicaciones' },
      { href: '/admin/campanas',      icon: Zap,       label: 'Campañas'      },
    ],
  },
  {
    label: 'Formación',
    items: [
      { href: '/admin/discipulado',     icon: BookOpen,    label: 'Discipulado'     },
      { href: '/admin/estudio-biblico', icon: ScrollText,  label: 'Estudio Bíblico' },
      { href: '/admin/biblia/planes',   icon: CalendarDays, label: 'Planes de lectura' },
    ],
  },
  {
    label: 'En vivo y pastoral',
    items: [
      { href: '/admin/oracion',  icon: Mic,   label: 'Salas de oración' },
      { href: '/admin/en-vivo',  icon: Radio, label: 'En Vivo'          },
      { href: '/admin/pastoral', icon: Cross, label: 'Pastoral Room'    },
    ],
  },
  {
    label: 'Monitoreo',
    items: [
      { href: '/admin/mensajes',         icon: Mail,         label: 'Mensajes'          },
      { href: '/admin/notificaciones',   icon: Bell,         label: 'Notificaciones'    },
      { href: '/admin/reportes',         icon: ShieldAlert,  label: 'Reportes'          },
      { href: '/admin/seguridad',        icon: Shield,       label: 'Seguridad'         },
    ],
  },
]

interface Props {
  unreadMessages?: number
  logoutAction: () => Promise<void>
  isLider?: boolean
  liderMinistries?: { id: string; name: string }[]
}

export default function AdminMobileNav({ unreadMessages = 0, logoutAction, isLider = false, liderMinistries = [] }: Props) {
  const pathname        = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  const PRIMARY = isLider ? LIDER_PRIMARY : ADMIN_PRIMARY

  return (
    <>
      {/* ── PANEL DESLIZANTE ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col"
          style={{ background: BG }}>

          <div className="flex items-center justify-between px-4 py-4"
            style={{ borderBottom: `1px solid ${BORDER}`, paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
            <p className="font-black text-sm" style={{ color: INK }}>
              {isLider ? 'Mi Ministerio' : 'Panel Admin'}
            </p>
            <button onClick={() => setOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl"
              style={{ background: SURFACE, color: INACTIVE }}>
              <X size={17} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {isLider ? (
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] px-3 mb-2"
                  style={{ color: INACTIVE }}>
                  Mi Ministerio
                </p>
                <div className="space-y-0.5">
                  {LIDER_PRIMARY.map(({ href, icon: Icon, label, exact }) => {
                    const active = isActive(href, exact)
                    return (
                      <Link key={href} href={href} onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition"
                        style={{ background: active ? SURFACE : 'transparent', color: active ? INK : INACTIVE }}>
                        <Icon size={16} style={{ color: active ? ACCENT : INACTIVE, flexShrink: 0 }} />
                        <span className="flex-1">{label}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />}
                      </Link>
                    )
                  })}
                </div>
                {liderMinistries.length > 0 && (
                  <div className="mt-4 px-3 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2"
                      style={{ color: INACTIVE }}>
                      Ministerios a cargo
                    </p>
                    {liderMinistries.map(m => (
                      <div key={m.id} className="flex items-center gap-2 py-1.5 text-[13px]" style={{ color: ACCENT }}>
                        <Building2 size={13} />
                        {m.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              ADMIN_MENU_SECTIONS.map(section => (
                <div key={section.label}>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] px-3 mb-2"
                    style={{ color: INACTIVE }}>
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map(({ href, icon: Icon, label }) => {
                      const active     = isActive(href)
                      const isMensajes = href === '/admin/mensajes'
                      return (
                        <Link key={href} href={href} onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition"
                          style={{ background: active ? SURFACE : 'transparent', color: active ? INK : INACTIVE }}>
                          <Icon size={16} style={{ color: active ? ACCENT : INACTIVE, flexShrink: 0 }} />
                          <span className="flex-1">{label}</span>
                          {isMensajes && unreadMessages > 0 && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                              style={{ background: ACCENT, color: GOLD_INK }}>
                              {unreadMessages}
                            </span>
                          )}
                          {active && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }} />}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-3 pb-6 pt-3 space-y-0.5"
            style={{ borderTop: `1px solid ${BORDER}`, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
            {!isLider && (
              <Link href="/" target="_blank" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium"
                style={{ color: INACTIVE }}>
                <Globe size={16} /> Ver sitio web
              </Link>
            )}
            <Link href="/app/comunidad" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium"
              style={{ color: INACTIVE }}>
              <ArrowLeft size={16} /> Volver a la app
            </Link>
            <form action={logoutAction}>
              <button type="submit"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium"
                style={{ color: INACTIVE }}>
                <LogOut size={16} /> Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── BARRA INFERIOR FIJA ── */}
      <div className="flex items-stretch"
        style={{ minHeight: 56, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

        {PRIMARY.map(({ href, icon: Icon, label, exact }) => {
          const active     = isActive(href, exact)
          const isMensajes = href === '/admin/mensajes'
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
              style={{ WebkitTapHighlightColor: 'transparent' }}>
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? ACCENT : INACTIVE }} />
                {isMensajes && unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1.5 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: ACCENT, color: GOLD_INK }}>
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold"
                style={{ color: active ? ACCENT : INACTIVE, lineHeight: 1 }}>
                {label}
              </span>
            </Link>
          )
        })}

        <button onClick={() => setOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
          style={{ WebkitTapHighlightColor: 'transparent', background: 'none', border: 'none', cursor: 'pointer' }}>
          <Menu size={20} strokeWidth={1.8} style={{ color: INACTIVE }} />
          <span className="text-[10px] font-semibold" style={{ color: INACTIVE, lineHeight: 1 }}>
            Menú
          </span>
        </button>
      </div>
    </>
  )
}
