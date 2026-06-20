'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'


function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/app/comunidad'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    const data = await res.json()

    if (!res.ok || data.error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })

    if (sessionError) {
      setError('Error al iniciar sesión. Intenta de nuevo.')
      setLoading(false)
      return
    }

    window.location.href = next
  }

  return (
    <div className="w-full max-w-sm">

      <div className="mb-5">
        <h1 className="font-black text-2xl tracking-tight text-[#111111] mb-1">
          Iniciar sesión
        </h1>
        <p className="text-sm text-[#111111]/50">
          Bienvenido de vuelta a la comunidad
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.22em] block mb-2 text-[#111111]/50">
            Correo electrónico
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition text-[#111111]"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#76ABAE')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E8E8E8')}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.22em] block mb-2 text-[#111111]/50">
            Contraseña
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition text-[#111111]"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#76ABAE')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E8E8E8')}
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
            <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-between font-black text-[11px] uppercase tracking-[0.22em] rounded-xl px-6 py-3.5 transition-all disabled:opacity-50 text-white active:scale-[0.98]"
          style={{ background: '#093C5D' }}
        >
          {loading ? 'Entrando…' : (
            <>
              Iniciar sesión
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid #EBEBEB' }}>
        <p className="text-center text-sm text-[#111111]/50">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-bold text-[#111111] hover:text-[#76ABAE] transition-colors">
            Regístrate
          </Link>
        </p>
        <p className="text-center text-sm text-[#111111]/50">
          <Link href="/" className="font-bold text-[#111111] hover:text-[#76ABAE] transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>

    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="h-screen overflow-hidden flex flex-col lg:flex-row">

      {/* ── PANEL IZQUIERDO — identidad visual ── */}
      <div
        className="relative flex-[2] lg:flex-none lg:w-1/2 flex flex-col items-center justify-center px-8 py-3 lg:px-10 lg:py-16 overflow-hidden"
        style={{ background: '#093C5D' }}
      >
        {/* Grid sutil */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 80px)' }} />
        {/* Número decorativo */}
        <div className="pointer-events-none absolute select-none font-black leading-none tracking-tighter"
          style={{ fontSize: 'clamp(10rem, 22vw, 20rem)', color: '#76ABAE', opacity: 0.06, bottom: '-4rem', left: '-2rem', lineHeight: 1, fontFamily: 'Georgia, serif' }}
          aria-hidden>
          FE
        </div>

        {/* Contenido central */}
        <div className="relative flex flex-col items-center text-center z-10 max-w-xs">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <line key={i} x1="24" y1="24"
                x2={24 + 18 * Math.cos((deg * Math.PI) / 180)}
                y2={24 + 18 * Math.sin((deg * Math.PI) / 180)}
                stroke="#76ABAE" strokeWidth="0.8" strokeOpacity="0.4" />
            ))}
            <rect x="21.5" y="9" width="5" height="30" rx="2" fill="#76ABAE" />
            <rect x="9" y="18" width="30" height="5" rx="2" fill="#76ABAE" />
          </svg>

          <h2 className="font-display font-black tracking-tighter mt-2 mb-1 lg:mt-6 lg:mb-2"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
            El Manantial
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3 lg:mb-8" style={{ color: '#76ABAE' }}>
            Comunidad de fe
          </p>

          <div className="w-8 h-px mb-3 lg:mb-8" style={{ background: 'rgba(118,171,174,0.4)' }} />

          <blockquote className="text-sm leading-relaxed text-center" style={{ color: 'rgba(246,243,235,0.40)' }}>
            "El que bebe del agua que yo le daré no volverá a tener sed jamás."
          </blockquote>
          <cite className="text-[10px] font-bold uppercase tracking-widest mt-3 block not-italic" style={{ color: '#76ABAE', opacity: 0.7 }}>
            Juan 4:14
          </cite>
        </div>
      </div>

      {/* ── PANEL DERECHO — formulario ── */}
      <div
        className="flex-[3] lg:flex-none lg:w-1/2 flex items-center justify-center px-6 py-4 lg:py-16"
        style={{ background: '#FAFAFA' }}
      >
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
