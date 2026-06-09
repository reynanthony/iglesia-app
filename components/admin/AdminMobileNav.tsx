'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Mail, ShieldAlert, Shield,
  Menu, X, FileText, UsersRound, BookOpen, Radio, ScrollText,
  Bell, UserCheck, Cross, Mic, Megaphone, Zap, ExternalLink,
  Globe, ArrowLeft, LogOut, Newspaper,
} from 'lucide-react'

const ACCENT   = '#76ABAE'
const INACTIVE = 'rgba(246,243,235,0.35)'
const BG       = '#061E30'
const SURFACE  = '#0B2D47'
const BORDER   = '#0D3352'

// Bottom bar — 4 items siempre visibles
const PRIMARY = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard', exact: true  },
  { href: '/admin/posts',    icon: FileText,        label: 'Posts',     exact: false },
  { href: '/admin/mensajes', icon: Mail,            label: 'Mensajes',  exact: false },
  { href: '/admin/usuarios', icon: Users,           label: 'Usuarios',  exact: false },
]

// Todas las secciones para el panel expandido
const MENU_SECTIONS = [
  {
    label: 'Comunidad',
    items: [
      { href: '/admin/usuarios',         icon: Users,        label: 'Usuarios'          },
      { href: '/admin/lideres',          icon: UserCheck,    label: 'Líderes'           },
      { href: '/admin/posts',            icon: FileText,     label: 'Posts'             },
      { href: '/admin/publicaciones',    icon: Newspaper,    label: 'Publicaciones'     },
      { href: '/admin/grupos',           icon: UsersRound,   label: 'Grupos'            },
      { href: '/admin/discipulado',      icon: BookOpen,     label: 'Discipulado'       },
      { href: '/admin/estudio-biblico',  icon: ScrollText,   label: 'Estudio Bíblico'  },
      { href: '/admin/oracion',          icon: Mic,          label: 'Salas de oración' },
      { href: '/admin/en-vivo',          icon: Radio,        label: 'En Vivo'           },
      { href: '/admin/anuncios',         icon: Megaphone,    label: 'Anuncios'          },
      { href: '/admin/campanas',         icon: Zap,          label: 'Campañas'          },
      { href: '/admin/pastoral',         icon: Cross,        label: 'Pastoral Room'     },
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
  strapiUrl?: string
  logoutAction: () => Promise<void>
}

export default function AdminMobileNav({ unreadMessages = 0, strapiUrl, logoutAction }: Props) {
  const pathname        = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/* ── PANEL DESLIZANTE ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col"
          style={{ background: BG }}>

          {/* Header del panel */}
          <div className="flex items-center justify-between px-4 py-4"
            style={{ borderBottom: `1px solid ${BORDER}`, paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}>
            <p className="font-black text-sm" style={{ color: '#F6F3EB' }}>Panel Admin</p>
            <button onClick={() => setOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl"
              style={{ background: SURFACE, color: INACTIVE }}>
              <X size={17} />
            </button>
          </div>

          {/* Secciones scrollables */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {MENU_SECTIONS.map(section => (
              <div key={section.label}>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] px-3 mb-2"
                  style={{ color: 'rgba(246,243,235,0.25)' }}>
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map(({ href, icon: Icon, label }) => {
                    const active     = isActive(href)
                    const isMensajes = href === '/admin/mensajes'
                    return (
                      <Link key={href} href={href} onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition"
                        style={{
                          background: active ? SURFACE : 'transparent',
                          color:      active ? '#F6F3EB' : INACTIVE,
                        }}>
                        <Icon size={16} style={{ color: active ? ACCENT : INACTIVE, flexShrink: 0 }} />
                        <span className="flex-1">{label}</span>
                        {isMensajes && unreadMessages > 0 && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                            style={{ background: ACCENT, color: BG }}>
                            {unreadMessages}
                          </span>
                        )}
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: ACCENT }} />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer con acciones */}
          <div className="px-3 pb-6 pt-3 space-y-0.5"
            style={{ borderTop: `1px solid ${BORDER}`, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
            {strapiUrl && (
              <a href={strapiUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium"
                style={{ color: INACTIVE }}>
                <ExternalLink size={16} /> Editar sitio (Directus)
              </a>
            )}
            <Link href="/" target="_blank" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium"
              style={{ color: INACTIVE }}>
              <Globe size={16} /> Ver sitio web
            </Link>
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
                    style={{ background: ACCENT, color: BG }}>
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

        {/* Botón Menú */}
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
