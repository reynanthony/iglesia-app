'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight, Cross, LogOut, LayoutDashboard } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/client'

const SECTIONS = [
  {
    label: 'La iglesia',
    links: [
      { href: '/',            label: 'Inicio' },
      { href: '/nosotros',    label: 'Nosotros' },
      { href: '/ministerios', label: 'Ministerios' },
      { href: '/contacto',    label: 'Contacto' },
    ],
  },
  {
    label: 'Fe y formación',
    links: [
      { href: '/educacion',                  label: 'Educación' },
      { href: '/educacion/discipulado',      label: 'Discipulado' },
      { href: '/educacion/estudio-biblico',  label: 'Estudio Bíblico' },
      { href: '/biblia',                     label: 'Biblia' },
      { href: '/devocionales',               label: 'Devocionales' },
    ],
  },
  {
    label: 'Contenido',
    links: [
      { href: '/predicas', label: 'Prédicas' },
      { href: '/eventos',  label: 'Eventos' },
      { href: '/en-vivo',  label: 'En Vivo' },
    ],
  },
  {
    label: 'Apoya',
    links: [
      { href: '/donaciones', label: 'Donaciones' },
    ],
  },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Focus trap + Escape cuando el menú está abierto
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    // Mover foco al panel al abrir
    const firstFocusable = panel.querySelector<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
    firstFocusable?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        aria-label="Abrir menú"
        className="p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ color: 'rgba(246,243,235,0.70)' }}
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            tabIndex={-1}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh',
              zIndex: 40, background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
              border: 'none', cursor: 'default', padding: 0,
            }}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            id="mobile-menu-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            style={{
              position: 'fixed', top: 0, right: 0, height: '100dvh', width: '20rem',
              zIndex: 50, background: '#051828',
              borderLeft: '1px solid rgba(118,171,174,0.12)',
              display: 'flex', flexDirection: 'column',
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingRight: 'env(safe-area-inset-right, 0px)',
              paddingLeft: 'env(safe-area-inset-left, 0px)',
            }}
          >
            {/* Cabecera */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 1.5rem', height: '4rem',
              borderBottom: '1px solid rgba(118,171,174,0.12)', flexShrink: 0,
            }}>
              <div style={{
                width: '1.75rem', height: '1.75rem', background: '#0D3352',
                display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem',
              }}>
                <Cross size={12} strokeWidth={2.5} style={{ color: '#76ABAE' }} />
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                style={{ padding: '0.375rem', color: 'rgba(246,243,235,0.40)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Links por sección */}
            <nav style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '1rem 0.75rem' }}
              aria-label="Navegación principal">
              {SECTIONS.map(({ label, links }) => (
                <div key={label} style={{ marginBottom: '0.5rem' }}>
                  <p style={{
                    fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.35em', color: 'rgba(118,171,174,0.45)',
                    padding: '0.75rem 0.75rem 0.35rem',
                  }}>
                    {label}
                  </p>
                  {links.map(({ href, label: linkLabel }) => {
                    const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center',
                          padding: '0.875rem 0.875rem',
                          fontSize: '0.75rem', fontWeight: active ? 700 : 600,
                          textTransform: 'uppercase', letterSpacing: '0.14em',
                          color: active ? '#F6F3EB' : 'rgba(246,243,235,0.50)',
                          background: active ? 'rgba(118,171,174,0.10)' : 'transparent',
                          borderRadius: '0.625rem',
                          textDecoration: 'none',
                          borderLeft: active ? '2px solid #76ABAE' : '2px solid transparent',
                          minHeight: '2.75rem',
                        }}
                      >
                        {linkLabel}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>

            {/* CTA */}
            <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(118,171,174,0.12)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/app/feed"
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                      padding: '1rem', borderRadius: '0.75rem', background: '#F6F3EB', color: '#093C5D', textDecoration: 'none',
                      minHeight: '3.25rem',
                    }}
                  >
                    <LayoutDashboard size={15} /> Mi comunidad
                  </Link>
                  <form action={logout} style={{ width: '100%' }}>
                    <button
                      type="submit"
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                        padding: '0.875rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'none',
                        border: '1px solid rgba(246,243,235,0.12)', color: 'rgba(246,243,235,0.50)',
                        minHeight: '3rem',
                      }}
                    >
                      <LogOut size={15} /> Cerrar sesión
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/registro"
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                      padding: '1rem', borderRadius: '0.75rem', background: '#F6F3EB', color: '#093C5D', textDecoration: 'none',
                      minHeight: '3.25rem',
                    }}
                  >
                    Unirme a la comunidad <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                      padding: '0.875rem', borderRadius: '0.75rem',
                      border: '1px solid rgba(118,171,174,0.20)', color: 'rgba(246,243,235,0.60)', textDecoration: 'none',
                      minHeight: '3rem',
                    }}
                  >
                    Ya tengo cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
