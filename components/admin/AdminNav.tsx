'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, AlertTriangle,
  Church, CalendarDays, Mic2, ArrowLeft, Globe, LogOut,
} from 'lucide-react'

type NavItem = { href: string; icon: React.ComponentType<{ size?: number }>; label: string; exact?: boolean }
type NavSection = { label: string; items: NavItem[] }

const sections: NavSection[] = [
  {
    label: 'General',
    items: [{ href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true }],
  },
  {
    label: 'Comunidad',
    items: [
      { href: '/admin/usuarios', icon: Users, label: 'Usuarios' },
      { href: '/admin/posts', icon: FileText, label: 'Publicaciones' },
      { href: '/admin/reportes', icon: AlertTriangle, label: 'Reportes' },
    ],
  },
  {
    label: 'Sitio Web',
    items: [
      { href: '/admin/ministerios', icon: Church, label: 'Ministerios' },
      { href: '/admin/eventos', icon: CalendarDays, label: 'Eventos' },
      { href: '/admin/predicas', icon: Mic2, label: 'Prédicas' },
    ],
  },
]

export default function AdminNav({ logoutAction }: { logoutAction: () => Promise<void> }) {
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
              style={{ color: '#333333' }}>
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, icon: Icon, label, exact }) => {
                const active = isActive(href, exact)
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
                    style={{
                      background: active ? '#1A1A1A' : 'transparent',
                      color: active ? '#F5F5F5' : '#5A5A5A',
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t space-y-0.5" style={{ borderColor: '#1F1F1F' }}>
        <Link href="/" target="_blank"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
          style={{ color: '#4D4D4D' }}>
          <Globe size={14} /> Ver sitio web
        </Link>
        <Link href="/app/feed"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
          style={{ color: '#4D4D4D' }}>
          <ArrowLeft size={14} /> Volver a la app
        </Link>
        <form action={logoutAction}>
          <button type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition"
            style={{ color: '#4D4D4D' }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </form>
      </div>
    </>
  )
}
