'use client'

import { useState } from 'react'
import Link from 'next/link'
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

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        aria-label="Abrir menú"
        className="p-2 transition"
        style={{ color: 'rgba(245,245,245,0.7)' }}
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
              background: '#111111',
              borderLeft: '1px solid #2A2A2A',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Cabecera */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1.5rem',
              height: '4rem',
              borderBottom: '1px solid #2A2A2A',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: '1.75rem', height: '1.75rem',
                  background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '0.5rem',
                }}>
                  <Cross size={12} strokeWidth={2.5} style={{ color: '#000000' }} />
                </div>
                <span style={{ fontWeight: 900, fontSize: '0.875rem', letterSpacing: '-0.025em', color: '#F5F5F5' }}>
                  El Manantial
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                style={{ padding: '0.375rem', color: '#5A5A5A', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Links */}
            <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}
              aria-label="Navegación principal">
              {links.map(({ href, label }) => (
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
                    color: '#AAAAAA',
                    borderRadius: '0.75rem',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid #2A2A2A', flexShrink: 0 }}>
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
                  background: '#F5F5F5',
                  color: '#0A0A0A',
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
