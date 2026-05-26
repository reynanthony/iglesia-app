'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { Cross, ArrowRight, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <main className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #EBEBEB 0%, #F4F4F4 50%, #FFFFFF 100%)' }}>
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#000000] rounded-2xl flex items-center justify-center mx-auto mb-5 text-white">
            <Cross size={22} strokeWidth={2.5} />
          </div>
          <h1 className="font-black text-2xl tracking-tight text-[#111111]">
            Iniciar sesión
          </h1>
          <p className="text-sm mt-1.5 text-[#111111]/50">
            Bienvenido de vuelta a El Manantial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2.5 text-[#111111]/60">
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
              }}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2.5 text-[#111111]/60">
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
              }}
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
            className="w-full flex items-center justify-between font-black text-[11px] uppercase tracking-[0.2em] rounded-xl px-6 py-4 transition disabled:opacity-50 text-white"
            style={{ background: '#000000' }}
          >
            {loading ? 'Entrando…' : (
              <>
                Iniciar sesión
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-8 text-[#111111]/50">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-bold text-[#000000] hover:text-[#222222] transition">
            Regístrate
          </Link>
        </p>

      </div>
    </main>
  )
}
