'use client'

import { useState } from 'react'
import { createRoom } from '@/app/actions/rooms'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

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
    <div style={{ background: BG, minHeight: '100%' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/app/oracion/salas"
            className="p-2.5 hover:bg-[#292E3B] rounded-xl transition"
            style={{ color: GOLD }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-black text-xl tracking-tight" style={{ color: INK }}>
            Nueva sala de oración
          </h1>
        </div>

        <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: MUTED }}>
                Nombre de la sala
              </label>
              <input name="name" type="text" required placeholder="Ej: Oración de intercesión"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                style={{ background: BORDER, border: `1px solid ${BORDER}`, color: INK }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: MUTED }}>
                Descripción <span style={{ color: MUTED }}>(opcional)</span>
              </label>
              <textarea name="description" rows={3}
                placeholder="¿De qué se trata esta sesión de oración?"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none"
                style={{ background: BORDER, border: `1px solid ${BORDER}`, color: INK }} />
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
                style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
                Cancelar
              </Link>
              <button type="submit" disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition disabled:opacity-50"
                style={{ background: GOLD, color: GOLD_INK }}>
                {loading ? 'Creando...' : 'Crear sala'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
