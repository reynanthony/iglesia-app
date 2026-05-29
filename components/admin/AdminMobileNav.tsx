'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Mail, ShieldAlert, Shield } from 'lucide-react'

const ACCENT   = '#76ABAE'
const INACTIVE = 'rgba(246,243,235,0.35)'

const items = [
  { href: '/admin',           icon: LayoutDashboard, label: 'Dashboard', exact: true  },
  { href: '/admin/usuarios',  icon: Users,           label: 'Usuarios',  exact: false },
  { href: '/admin/mensajes',  icon: Mail,            label: 'Mensajes',  exact: false },
  { href: '/admin/reportes',  icon: ShieldAlert,     label: 'Reportes',  exact: false },
  { href: '/admin/seguridad', icon: Shield,          label: 'Seguridad', exact: false },
]

export default function AdminMobileNav({ unreadMessages = 0 }: { unreadMessages?: number }) {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div
      className="flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: 56 }}
    >
      {items.map(({ href, icon: Icon, label, exact }) => {
        const active = isActive(href, exact)
        const isMensajes = href === '/admin/mensajes'
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[52px] active:opacity-70 transition-opacity relative"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="relative">
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? ACCENT : INACTIVE }}
              />
              {isMensajes && unreadMessages > 0 && (
                <span
                  className="absolute -top-1 -right-1.5 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#76ABAE', color: '#061E30' }}
                >
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{ color: active ? ACCENT : INACTIVE, lineHeight: 1 }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
