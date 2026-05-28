'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight, Cross } from 'lucide-react'

const links = [
  { href: '/',            label: 'Inicio' },
  { href: '/nosotros',    label: 'Nosotros' },
  { href: '/ministerios', label: 'Ministerios' },
  { href: '/eventos',     label: 'Eventos' },
  { href: '/predicas',    label: 'Prédicas' },
  { href: '/contacto',    label: 'Contacto' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        aria-label="Abrir menú"
        className="p-2 transition"
        style={{ color: 'rgba(246,243,235,0.70)' }}
      >
        <Menu size={22} />
      </button>

      {open && (
        <>
          {/* Backdrop — height via 100dvh para escapar el containing block del header con backdrop-filter */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100dvh',
              zIndex: 40,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              border: 'none',
              cursor: 'default',
              padding: 0,
            }}
          />

          {/* Panel — height via 100dvh por la misma razón */}
          <div
            id="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100dvh',
              width: '18rem',
              zIndex: 50,
              background: '#051828',
              borderLeft: '1px solid rgba(118,171,174,0.12)',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingRight: 'env(safe-area-inset-right, 0px)',
              paddingLeft: 'env(safe-area-inset-left, 0px)',
            }}
          >
            {/* Cabecera */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1.5rem',
              height: '4rem',
              borderBottom: '1px solid rgba(118,171,174,0.12)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: '1.75rem', height: '1.75rem',
                  background: '#0D3352',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '0.5rem',
                }}>
                  <Cross size={12} strokeWidth={2.5} style={{ color: '#76ABAE' }} />
                </div>
                <span style={{ fontWeight: 900, fontSize: '0.875rem', letterSpacing: '-0.025em', color: '#F6F3EB' }}>
                  El Manantial
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                style={{ padding: '0.375rem', color: 'rgba(246,243,235,0.40)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Links */}
            <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}
              aria-label="Navegación principal">
              {links.map(({ href, label }) => {
                const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.875rem 1rem',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: active ? '#F6F3EB' : 'rgba(246,243,235,0.45)',
                      background: active ? 'rgba(118,171,174,0.10)' : 'transparent',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      borderLeft: active ? '2px solid #76ABAE' : '2px solid transparent',
                    }}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* CTA */}
            <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(118,171,174,0.12)', flexShrink: 0 }}>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 900,
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: '#F6F3EB',
                  color: '#093C5D',
                  textDecoration: 'none',
                }}
              >
                Entrar a la comunidad <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
