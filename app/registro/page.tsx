'use client'

import { useState } from 'react'
import { register } from '@/app/actions/auth'
import Link from 'next/link'
import { ArrowRight, AlertCircle } from 'lucide-react'
import AuthBrandPanel from '@/components/auth/AuthBrandPanel'

type RegistroField = {
  name: string
  label: string
  type: string
  placeholder: string
  autoComplete: string
  minLength?: number
  pattern?: string
  title?: string
}

const fields: RegistroField[] = [
  { name: 'full_name', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez', autoComplete: 'name' },
  { name: 'username', label: 'Nombre de usuario', type: 'text', placeholder: 'juanperez', autoComplete: 'username', pattern: '[a-zA-Z0-9_.\\-]+', title: 'Solo letras, números, puntos, guiones y guiones bajos. Sin espacios.' },
  { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'tu@correo.com', autoComplete: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••', autoComplete: 'new-password', minLength: 6 },
]

function RegistroForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await register(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.confirm) {
      setConfirm(true)
    }
  }

  if (confirm) {
    return (
      <div className="w-full max-w-sm text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl"
          style={{ background: '#FFFFFF', border: '1px solid #E8E8E8' }}
        >
          ✉️
        </div>
        <h1 className="font-black text-2xl tracking-tight text-[#111111] mb-3">
          Revisa tu correo
        </h1>
        <p className="text-sm leading-relaxed mb-8 text-[#111111]/50">
          Te enviamos un enlace de confirmación. Ábrelo para activar tu cuenta y acceder a la comunidad.
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111] hover:text-[#C79A2A] transition-colors">
          Ir al inicio de sesión <ArrowRight size={12} />
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">

      <div className="mb-5">
        <h1 className="font-black text-2xl tracking-tight text-[#111111] mb-1">
          Crear cuenta
        </h1>
        <p className="text-sm text-[#111111]/50">
          Únete a la comunidad de El Manantial
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, label, type, placeholder, autoComplete, minLength, pattern, title }) => (
          <div key={name}>
            <label className="text-[10px] font-bold uppercase tracking-[0.22em] block mb-2 text-[#111111]/50">
              {label}
            </label>
            <input
              name={name}
              type={type}
              required
              placeholder={placeholder}
              autoComplete={autoComplete}
              minLength={minLength}
              pattern={pattern}
              title={title}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition text-[#111111]"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E8E8',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#C79A2A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E8E8E8')}
            />
            {name === 'username' && (
              <p className="text-[10px] mt-1.5 text-[#111111]/35">
                Solo letras, números, puntos y guiones. Sin espacios.
              </p>
            )}
          </div>
        ))}

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
          style={{ background: '#101217' }}
        >
          {loading ? 'Creando cuenta…' : (
            <>
              Crear cuenta
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid #EBEBEB' }}>
        <p className="text-center text-sm text-[#111111]/50">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold text-[#111111] hover:text-[#C79A2A] transition-colors">
            Inicia sesión
          </Link>
        </p>
        <p className="text-center text-sm text-[#111111]/50">
          <Link href="/" className="font-bold text-[#111111] hover:text-[#C79A2A] transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>

    </div>
  )
}

export default function RegistroPage() {
  return (
    <main className="h-screen overflow-hidden flex flex-col lg:flex-row">

      {/* ── PANEL IZQUIERDO — identidad visual, la misma que /login ── */}
      <AuthBrandPanel
        quote="Todos los que el Padre me da vendrán a mí; y al que a mí viene, no le echo fuera."
        cite="Juan 6:37"
        eyebrow="Únete a la comunidad"
      />

      {/* ── PANEL DERECHO — formulario ──
          overflow-y-auto vive en este div (no flex), y el centrado vertical
          vive en el hijo con min-h-full: así, si el formulario es más alto
          que la pantalla, se puede hacer scroll completo sin que el
          centrado de flexbox recorte la parte superior del contenido. */}
      <div
        className="flex-[3] lg:flex-none lg:w-1/2 overflow-y-auto"
        style={{ background: '#FAFAFA' }}
      >
        <div className="min-h-full flex items-center justify-center px-6 py-8 lg:py-16">
          <RegistroForm />
        </div>
      </div>
    </main>
  )
}
