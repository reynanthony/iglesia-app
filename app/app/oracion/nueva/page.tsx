'use client'

import { useState } from 'react'
import { createPrayerRequest } from '@/app/actions/prayer'
import { ArrowLeft, Flame } from 'lucide-react'
import Link from 'next/link'

export default function NuevaPeticionPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await createPrayerRequest(formData)
  }

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-8">
          <Link href="/app/oracion"
            className="p-2.5 hover:bg-[#0D3352] rounded-xl transition"
            style={{ color: '#76ABAE' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-black text-xl tracking-tight" style={{ color: '#F6F3EB' }}>
              Nueva petición
            </h1>
            <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
              La comunidad orará contigo
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-6 space-y-5"
          style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-bold mb-2"
                style={{ color: 'rgba(246,243,235,0.70)' }}>
                ¿Por qué necesitas oración? *
              </label>
              <input name="title" type="text" required maxLength={120}
                placeholder="Ej: Sanidad para mi familia"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition placeholder:opacity-40"
                style={{ background: '#0D3352', border: '1px solid #1A4A6E', color: '#F6F3EB' }} />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2"
                style={{ color: 'rgba(246,243,235,0.70)' }}>
                Detalles <span style={{ color: 'rgba(246,243,235,0.35)' }}>(opcional)</span>
              </label>
              <textarea name="body" rows={5}
                placeholder="Comparte más detalles sobre tu petición..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none placeholder:opacity-40"
                style={{ background: '#0D3352', border: '1px solid #1A4A6E', color: '#F6F3EB' }} />
            </div>

            <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition"
              style={{ background: '#0D3352', border: '1px solid #1A4A6E' }}>
              <input name="is_anonymous" type="checkbox" className="w-4 h-4 rounded accent-[#76ABAE]" />
              <div>
                <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Publicar como anónimo</p>
                <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                  Tu nombre no será visible para la comunidad
                </p>
              </div>
            </label>

            <div className="flex gap-3 justify-end pt-1">
              <Link href="/app/oracion"
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition"
                style={{ border: '1px solid #0D3352', color: 'rgba(246,243,235,0.55)' }}>
                Cancelar
              </Link>
              <button type="submit" disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition disabled:opacity-50"
                style={{ background: '#F6F3EB', color: '#061E30' }}>
                <Flame size={14} />
                {loading ? 'Enviando...' : 'Publicar petición'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
