'use client'

import { useState } from 'react'
import { register } from '@/app/actions/auth'
import Link from 'next/link'
import { Cross, ArrowRight, AlertCircle } from 'lucide-react'

export default function RegistroPage() {
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
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#061E30' }}>
        <div className="w-full max-w-sm text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl"
            style={{ background: '#0D3352' }}
          >
            ✉️
          </div>
          <h2 className="font-black text-xl tracking-tight mb-3" style={{ color: '#F6F3EB' }}>
            Revisa tu correo
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(246,243,235,0.50)' }}>
            Te enviamos un enlace de confirmación. Ábrelo para activar tu cuenta y acceder a la comunidad.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#76ABAE' }}>
            Ir al inicio de sesión <ArrowRight size={12} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#061E30' }}>
      <div className="w-full max-w-sm">

        {/* Brand mark */}
        <div className="text-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: '#0D3352' }}
          >
            <Cross size={22} strokeWidth={2.5} style={{ color: '#76ABAE' }} />
          </div>
          <h1 className="font-black text-2xl tracking-tight" style={{ color: '#F6F3EB' }}>
            Crear cuenta
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(246,243,235,0.45)' }}>
            Únete a la comunidad de El Manantial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'full_name',  label: 'Nombre completo',    type: 'text',     placeholder: 'Juan Pérez',    autoComplete: 'name' },
            { name: 'username',   label: 'Nombre de usuario',  type: 'text',     placeholder: 'juanperez',      autoComplete: 'username' },
            { name: 'email',      label: 'Correo electrónico', type: 'email',    placeholder: 'tu@correo.com',  autoComplete: 'email' },
            { name: 'password',   label: 'Contraseña',         type: 'password', placeholder: '••••••••',       autoComplete: 'new-password', minLength: 6 },
          ].map(({ name, label, type, placeholder, autoComplete, minLength }) => (
            <div key={name}>
              <label
                className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2.5"
                style={{ color: 'rgba(246,243,235,0.50)' }}
              >
                {label}
              </label>
              <input
                name={name}
                type={type}
                required
                placeholder={placeholder}
                autoComplete={autoComplete}
                minLength={minLength}
                className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition"
                style={{
                  background: '#0B2D47',
                  border: '1px solid #0D3352',
                  color: '#F6F3EB',
                }}
              />
            </div>
          ))}

          {error && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
              <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-between font-black text-[11px] uppercase tracking-[0.2em] rounded-xl px-6 py-4 transition disabled:opacity-50"
            style={{ background: '#F6F3EB', color: '#061E30' }}
          >
            {loading ? 'Creando cuenta…' : (
              <>
                Crear cuenta
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-8" style={{ color: 'rgba(246,243,235,0.45)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold transition" style={{ color: '#76ABAE' }}>
            Inicia sesión
          </Link>
        </p>

      </div>
    </main>
  )
}
