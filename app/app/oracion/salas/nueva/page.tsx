'use client'

import { useState } from 'react'
import { createRoom } from '@/app/actions/rooms'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevaSalaPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await createRoom(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#061E30', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/app/oracion/salas"
            className="p-2.5 hover:bg-[#0D3352] rounded-xl transition"
            style={{ color: '#76ABAE' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-black text-xl tracking-tight" style={{ color: '#F6F3EB' }}>
            Nueva sala de oración
          </h1>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'rgba(246,243,235,0.7)' }}>
                Nombre de la sala
              </label>
              <input name="name" type="text" required placeholder="Ej: Oración de intercesión"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                style={{ background: '#0D3352', border: '1px solid #0D3352', color: '#F6F3EB' }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: 'rgba(246,243,235,0.7)' }}>
                Descripción <span style={{ color: 'rgba(246,243,235,0.35)' }}>(opcional)</span>
              </label>
              <textarea name="description" rows={3}
                placeholder="¿De qué se trata esta sesión de oración?"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none"
                style={{ background: '#0D3352', border: '1px solid #0D3352', color: '#F6F3EB' }} />
            </div>

            {error && (
              <p className="text-sm px-4 py-3 rounded-xl"
                style={{ color: '#F87171', background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.20)' }}>
                {error}
              </p>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Link href="/app/oracion/salas"
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition"
                style={{ border: '1px solid #0D3352', color: 'rgba(246,243,235,0.55)' }}>
                Cancelar
              </Link>
              <button type="submit" disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition disabled:opacity-50"
                style={{ background: '#F6F3EB', color: '#061E30' }}>
                {loading ? 'Creando...' : 'Crear sala'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
