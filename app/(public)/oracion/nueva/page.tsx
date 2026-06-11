'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Flame } from 'lucide-react'
import { createPublicPrayerRequest } from '@/app/actions/prayer'

const DARK  = '#051828'
const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'

export default function NuevaPeticionPublicaPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await createPublicPrayerRequest(new FormData(e.currentTarget))
  }

  return (
    <div style={{ background: DARK, minHeight: '100svh' }}>

      {/* Hero mínimo */}
      <div className="relative overflow-hidden" style={{ borderBottom: `1px solid rgba(118,171,174,0.12)` }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="relative max-w-2xl mx-auto px-6 pt-10 pb-8">
          <Link href="/oracion"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 transition hover:opacity-70"
            style={{ color: `${TEAL}80` }}>
            <ArrowLeft size={13} /> Muro de oración
          </Link>
          <h1 className="font-display font-black tracking-tighter leading-[0.9]"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', color: CREAM }}>
            Nueva<br /><span style={{ color: TEAL }}>petición.</span>
          </h1>
          <p className="text-sm mt-4 leading-relaxed" style={{ color: `${CREAM}55` }}>
            La comunidad orará contigo. Puedes publicar de forma anónima.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="rounded-2xl p-6 space-y-5"
            style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.12)' }}>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.25em] mb-2"
                style={{ color: `${CREAM}60` }}>
                ¿Por qué necesitas oración? *
              </label>
              <input
                name="title"
                type="text"
                required
                maxLength={120}
                placeholder="Ej: Sanidad para mi familia"
                className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition placeholder:opacity-30"
                style={{ background: '#0D3352', border: '1px solid rgba(118,171,174,0.15)', color: CREAM }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.25em] mb-2"
                style={{ color: `${CREAM}60` }}>
                Detalles <span style={{ color: `${CREAM}35` }}>(opcional)</span>
              </label>
              <textarea
                name="body"
                rows={4}
                placeholder="Comparte más detalles sobre tu petición..."
                className="w-full rounded-xl px-4 py-3.5 text-sm focus:outline-none transition resize-none placeholder:opacity-30"
                style={{ background: '#0D3352', border: '1px solid rgba(118,171,174,0.15)', color: CREAM }}
              />
            </div>

            <label className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition hover:brightness-110"
              style={{ background: '#0D3352', border: '1px solid rgba(118,171,174,0.12)' }}>
              <input name="is_anonymous" type="checkbox" className="w-4 h-4 rounded flex-shrink-0" style={{ accentColor: TEAL }} />
              <div>
                <p className="text-sm font-bold" style={{ color: CREAM }}>Publicar como anónimo</p>
                <p className="text-[11px] mt-0.5" style={{ color: `${CREAM}50` }}>
                  Tu nombre no será visible para la comunidad
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            <Link href="/oracion"
              className="px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition"
              style={{ border: `1px solid rgba(118,171,174,0.15)`, color: `${CREAM}50` }}>
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition disabled:opacity-50"
              style={{ background: CREAM, color: NAVY }}>
              <Flame size={13} />
              {loading ? 'Publicando...' : 'Publicar petición'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
