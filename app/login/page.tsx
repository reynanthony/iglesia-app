'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { ArrowRight, AlertCircle } from 'lucide-react'


export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">

      {/* ── PANEL IZQUIERDO — identidad visual ── */}
      <div
        className="relative lg:w-1/2 flex flex-col items-center justify-center px-10 py-16 overflow-hidden"
        style={{ background: '#093C5D', minHeight: 300 }}
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

          <h2 className="font-display font-black tracking-tighter mt-6 mb-2"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
            El Manantial
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8" style={{ color: '#76ABAE' }}>
            Comunidad de fe
          </p>

          <div className="w-8 h-px mb-8" style={{ background: 'rgba(118,171,174,0.4)' }} />

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
        className="lg:w-1/2 flex items-center justify-center px-6 py-16"
        style={{ background: '#FAFAFA' }}
      >
        <div className="w-full max-w-sm">

          <div className="mb-10">
            <h1 className="font-black text-3xl tracking-tight text-[#111111] mb-2">
              Iniciar sesión
            </h1>
            <p className="text-sm text-[#111111]/50">
              Bienvenido de vuelta a la comunidad
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {next && <input type="hidden" name="next" value={next} />}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.22em] block mb-2.5 text-[#111111]/50">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition text-[#111111]"
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
              <label className="text-[10px] font-bold uppercase tracking-[0.22em] block mb-2.5 text-[#111111]/50">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition text-[#111111]"
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
              className="w-full flex items-center justify-between font-black text-[11px] uppercase tracking-[0.22em] rounded-xl px-6 py-4 transition-all disabled:opacity-50 text-white active:scale-[0.98]"
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

          <div className="mt-8 pt-8 space-y-3" style={{ borderTop: '1px solid #EBEBEB' }}>
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
      </div>
    </main>
  )
}
