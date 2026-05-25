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
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A0A' }}>
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 bg-[#F5F5F5] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0A0A0A] text-2xl">
            ✉️
          </div>
          <h2 className="font-black text-xl tracking-tight mb-3" style={{ color: '#F5F5F5' }}>
            Revisa tu correo
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#6A6A6A' }}>
            Te enviamos un enlace de confirmación. Ábrelo para activar tu cuenta y acceder a la comunidad.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#8A8A8A' }}>
            Ir al inicio de sesión <ArrowRight size={12} />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A0A' }}>
      <div className="w-full max-w-sm">

        {/* Brand mark */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#000000] rounded-2xl flex items-center justify-center mx-auto mb-5 text-black">
            <Cross size={22} strokeWidth={2.5} />
          </div>
          <h1 className="font-black text-2xl tracking-tight" style={{ color: '#F5F5F5' }}>
            Crear cuenta
          </h1>
          <p className="text-sm mt-1.5" style={{ color: '#4D4D4D' }}>
            Únete a la comunidad de El Manantial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'full_name',  label: 'Nombre completo',    type: 'text',     placeholder: 'Juan Pérez' },
            { name: 'username',   label: 'Nombre de usuario',  type: 'text',     placeholder: 'juanperez' },
            { name: 'email',      label: 'Correo electrónico', type: 'email',    placeholder: 'tu@correo.com' },
            { name: 'password',   label: 'Contraseña',         type: 'password', placeholder: '••••••••', minLength: 6 },
          ].map(({ name, label, type, placeholder, minLength }) => (
            <div key={name}>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2.5" style={{ color: '#8A8A8A' }}>
                {label}
              </label>
              <input
                name={name}
                type={type}
                required
                placeholder={placeholder}
                minLength={minLength}
                className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition"
                style={{
                  background: '#161614',
                  border: '1px solid #1A1A1A',
                  color: '#F5F5F5',
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
            style={{ background: '#F5F5F5', color: '#0A0A0A' }}
          >
            {loading ? 'Creando cuenta…' : (
              <>
                Crear cuenta
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-8" style={{ color: '#4D4D4D' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold transition hover:text-[#000000]" style={{ color: '#000000' }}>
            Inicia sesión
          </Link>
        </p>

      </div>
    </main>
  )
}
