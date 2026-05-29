'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, Shield, ShieldAlert,
  Globe, ArrowLeft, LogOut, Mail, ExternalLink, Mic,
} from 'lucide-react'

type NavItem = { href: string; icon: React.ComponentType<{ size?: number }>; label: string; exact?: boolean; external?: boolean }
type NavSection = { label: string; items: NavItem[] }

const sections: NavSection[] = [
  {
    label: 'General',
    items: [{ href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true }],
  },
  {
    label: 'Comunidad',
    items: [
      { href: '/admin/usuarios',    icon: Users,      label: 'Usuarios' },
      { href: '/admin/posts',       icon: FileText,   label: 'Publicaciones' },
      { href: '/admin/oracion',     icon: Mic,        label: 'Salas de oración' },
    ],
  },
  {
    label: 'Monitoreo',
    items: [
      { href: '/admin/mensajes',    icon: Mail,       label: 'Mensajes' },
      { href: '/admin/reportes',    icon: ShieldAlert,label: 'Reportes' },
      { href: '/admin/seguridad',   icon: Shield,     label: 'Seguridad' },
    ],
  },
]

export default function AdminNav({
  logoutAction,
  unreadMessages = 0,
  strapiUrl,
}: {
  logoutAction: () => Promise<void>
  unreadMessages?: number
  strapiUrl?: string
}) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {sections.map(section => (
          <div key={section.label}>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] px-3 mb-1.5"
              style={{ color: 'rgba(246,243,235,0.25)' }}>
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, icon: Icon, label, exact }) => {
                const active = isActive(href, exact)
                const isMensajes = href === '/admin/mensajes'
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
                    style={{
                      background: active ? '#0B2D47' : 'transparent',
                      color: active ? '#F6F3EB' : 'rgba(246,243,235,0.40)',
                    }}
                  >
                    <Icon size={14} />
                    <span className="flex-1">{label}</span>
                    {isMensajes && unreadMessages > 0 && (
                      <span
                        className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                        style={{ background: '#76ABAE', color: '#061E30' }}
                      >
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t space-y-0.5" style={{ borderColor: '#0D3352' }}>
        {strapiUrl && (
          <a
            href={strapiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
            style={{ color: 'rgba(246,243,235,0.40)' }}
          >
            <ExternalLink size={14} /> Editar sitio (Strapi)
          </a>
        )}
        <Link href="/" target="_blank"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
          style={{ color: 'rgba(246,243,235,0.40)' }}>
          <Globe size={14} /> Ver sitio web
        </Link>
        <Link href="/app/comunidad"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
          style={{ color: 'rgba(246,243,235,0.40)' }}>
          <ArrowLeft size={14} /> Volver a la app
        </Link>
        <form action={logoutAction}>
          <button type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
            style={{ color: 'rgba(246,243,235,0.40)' }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </form>
      </div>
    </>
  )
}
