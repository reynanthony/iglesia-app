'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Flame } from 'lucide-react'
import { createPublicPrayerRequest } from '@/app/actions/prayer'

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
    <div>

      {/* Hero mínimo */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '35svh', display: 'flex', alignItems: 'flex-end' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="relative max-w-4xl mx-auto w-full px-6 pt-16 pb-10">
          <Link href="/oracion"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 transition hover:opacity-70"
            style={{ color: `${TEAL}80` }}>
            <ArrowLeft size={13} /> Muro de oración
          </Link>
          <h1 className="font-display font-black tracking-tighter leading-[0.9] text-white"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)' }}>
            Comparte tu<br /><span style={{ color: TEAL }}>oración.</span>
          </h1>
        </div>
      </section>

      {/* Formulario */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">

          <p className="text-sm text-ink-2 leading-relaxed mb-8 max-w-md">
            Escribe tu oración. Al compartirla, invitas a la comunidad a unirse en intercesión contigo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Oración — campo principal */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-ink-3 mb-2">
                Tu oración *
              </label>
              <textarea
                name="body"
                rows={6}
                required
                placeholder="Señor, te pido..."
                className="w-full rounded-xl px-4 py-3.5 text-sm bg-card border border-edge focus:outline-none focus:border-edge-2 transition resize-none text-ink placeholder:text-ink-3"
              />
            </div>

            {/* Motivo — breve etiqueta */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.25em] text-ink-3 mb-2">
                Motivo <span className="opacity-60">(opcional)</span>
              </label>
              <input
                name="title"
                type="text"
                maxLength={120}
                placeholder="Ej: Sanidad, familia, trabajo..."
                className="w-full rounded-xl px-4 py-3.5 text-sm bg-card border border-edge focus:outline-none focus:border-edge-2 transition text-ink placeholder:text-ink-3"
              />
            </div>

            {/* Visibilidad */}
            <div className="space-y-3">
              <label className="flex items-center gap-4 p-4 rounded-xl border border-edge bg-muted cursor-pointer transition hover:border-edge-2">
                <input name="is_public" type="checkbox" defaultChecked className="w-4 h-4 rounded flex-shrink-0" style={{ accentColor: TEAL }} />
                <div>
                  <p className="text-sm font-bold text-ink">Compartir en el muro público</p>
                  <p className="text-[11px] text-ink-3 mt-0.5">Tu oración será visible para la comunidad en el muro web</p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-xl border border-edge bg-muted cursor-pointer transition hover:border-edge-2">
                <input name="is_anonymous" type="checkbox" className="w-4 h-4 rounded flex-shrink-0" style={{ accentColor: TEAL }} />
                <div>
                  <p className="text-sm font-bold text-ink">Publicar como anónimo</p>
                  <p className="text-[11px] text-ink-3 mt-0.5">Tu nombre no será visible para la comunidad</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Link href="/oracion"
                className="px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] border border-edge text-ink-3 transition hover:border-edge-2">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition disabled:opacity-50"
                style={{ background: NAVY, color: CREAM }}>
                <Flame size={13} style={{ color: TEAL }} />
                {loading ? 'Publicando...' : 'Publicar oración'}
              </button>
            </div>

          </form>
        </div>
      </section>

    </div>
  )
}
