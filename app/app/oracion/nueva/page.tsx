'use client'

import { useState } from 'react'
import { createPrayerRequest } from '@/app/actions/prayer'
import { ArrowLeft, Flame, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const ORANGE = '#E89563'

export default function NuevaPeticionPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createPrayerRequest(formData)
    // Si hubo redirect (éxito) esta línea nunca se alcanza porque la página navega.
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-2">
          <Link href="/app/oracion"
            className="p-2.5 rounded-full transition"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#76ABAE' }}>
            <ArrowLeft size={18} />
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(246,243,235,0.50)' }}>
            Muro de oración
          </p>
        </div>

        {/* ── Esfera — centro visual, un solo tono cálido, sin arcoíris ── */}
        <div className="flex flex-col items-center py-6">
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 108, height: 108,
              background: `radial-gradient(circle at 32% 28%, #F2B98A, ${ORANGE} 55%, #D67D48 100%)`,
              boxShadow: `0 0 44px 6px ${ORANGE}55, 0 0 90px 20px ${ORANGE}22`,
            }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 82, height: 82, background: 'radial-gradient(circle at 40% 35%, #2a1a10, #0d0805 75%)' }}
            >
              <Flame size={30} color={ORANGE} style={{ filter: `drop-shadow(0 0 8px ${ORANGE}99)` }} />
            </div>
          </div>
          <h1 className="font-black tracking-tighter text-center mt-5"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', lineHeight: 1.15, color: '#F6F3EB' }}>
            ¿Qué necesitas<br />hoy?
          </h1>
          <p className="text-sm text-center mt-2 max-w-xs" style={{ color: 'rgba(246,243,235,0.60)' }}>
            Cuéntanos qué llevas en el corazón y la comunidad orará contigo.
          </p>
        </div>

        <div className="rounded-3xl p-6 space-y-5"
          style={{
            background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(18px) saturate(150%)',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-bold mb-2"
                style={{ color: 'rgba(246,243,235,0.70)' }}>
                ¿Por qué necesitas oración? *
              </label>
              <input name="title" type="text" required maxLength={120}
                placeholder="Ej: Sanidad para mi familia"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition placeholder:opacity-40"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F6F3EB' }} />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2"
                style={{ color: 'rgba(246,243,235,0.70)' }}>
                Detalles <span style={{ color: 'rgba(246,243,235,0.62)' }}>(opcional)</span>
              </label>
              <textarea name="body" rows={5}
                placeholder="Comparte más detalles sobre tu petición..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none placeholder:opacity-40"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: '#F6F3EB' }} />
            </div>

            <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <input name="is_anonymous" type="checkbox" className="w-4 h-4 rounded accent-[#76ABAE]" />
              <div>
                <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Publicar como anónimo</p>
                <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
                  Tu nombre no será visible para la comunidad
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <input name="is_private" type="checkbox" className="w-4 h-4 rounded accent-[#76ABAE]" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Lock size={12} style={{ color: 'rgba(246,243,235,0.60)' }} />
                  <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Solo yo puedo verla</p>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
                  No aparece en la lista pública de oraciones
                </p>
              </div>
            </label>

            {error && (
              <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
                <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-1">
              <Link href="/app/oracion"
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition"
                style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(246,243,235,0.55)' }}>
                Cancelar
              </Link>
              <button type="submit" disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition disabled:opacity-50"
                style={{
                  background: `${ORANGE}30`, backdropFilter: 'blur(14px) saturate(160%)',
                  border: `1px solid ${ORANGE}70`, color: '#fff',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 10px 22px -8px ${ORANGE}60`,
                }}>
                <Flame size={14} color={ORANGE} />
                {loading ? 'Enviando...' : 'Publicar petición'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
