'use client'

import { useEffect, useRef, useState } from 'react'
import { createPrayerRequest } from '@/app/actions/prayer'
import { ArrowLeft, Flame, Lock, AlertCircle, Heart, Headphones, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'

const ORANGE = '#E89563'
const RED    = '#E37B85'
const GREEN  = '#6FBF8B'
const AMBER  = '#E3A94C'
const PURPLE = '#A99BD1'

// Atajos reales: tocar uno sugiere un punto de partida para el título,
// no son solo decoración — ahorran escritura en el momento más difícil.
const TOPICS = [
  { icon: Heart,       label: 'Salud y sanidad',     color: RED },
  { icon: Headphones,  label: 'Paz interior',        color: GREEN },
  { icon: Sparkles,    label: 'Gratitud',            color: AMBER },
  { icon: Zap,         label: 'Fortaleza y guía',    color: PURPLE },
]

const WAVE_COLORS = [GREEN, AMBER, PURPLE, RED]
const WAVE_HEIGHTS = [10, 20, 14, 26, 18, 24, 12, 20, 9, 16]

export default function NuevaPeticionPage() {
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [titleValue, setTitleValue] = useState('')
  const [greeting, setGreeting] = useState('Hola')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches')
  }, [])

  function pickTopic(label: string) {
    setTitleValue(label)
    titleRef.current?.focus()
  }

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

        <div className="flex items-center gap-3 mb-1">
          <Link href="/app/oracion"
            className="p-2.5 rounded-full transition"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#76ABAE' }}>
            <ArrowLeft size={18} />
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(246,243,235,0.50)' }}>
            Muro de oración
          </p>
        </div>

        {/* ── Esfera con atajos de tema reales alrededor ── */}
        <div className="relative flex flex-col items-center pt-3 pb-2">
          <span
            className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-3 py-1.5 rounded-full mb-4"
            style={{
              background: `${AMBER}24`, backdropFilter: 'blur(12px) saturate(160%)',
              border: `1px solid ${AMBER}45`, color: '#F6F3EB',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)',
            }}
          >
            {greeting}
          </span>

          <div className="relative flex items-center justify-center" style={{ width: 240, height: 180 }}>
            {TOPICS.map((t, i) => {
              const angle = [225, 315, 135, 45][i]
              const rad = (angle * Math.PI) / 180
              const x = Math.cos(rad) * 92
              const y = Math.sin(rad) * 68
              const TIcon = t.icon
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => pickTopic(t.label)}
                  title={t.label}
                  className="absolute w-10 h-10 rounded-full flex items-center justify-center transition active:scale-90"
                  style={{
                    left: `calc(50% + ${x}px - 20px)`, top: `calc(50% + ${y}px - 20px)`,
                    background: `${t.color}55`, backdropFilter: 'blur(14px) saturate(180%)',
                    border: `1.5px solid ${t.color}`, color: '#fff',
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 16px -4px ${t.color}90`,
                  }}
                >
                  <TIcon size={17} strokeWidth={2.2} />
                </button>
              )
            })}

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
          </div>

          <h1 className="font-black tracking-tighter text-center mt-1"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', lineHeight: 1.15, color: '#F6F3EB' }}>
            ¿Qué necesitas<br />hoy?
          </h1>
          <p className="text-sm text-center mt-2 max-w-xs" style={{ color: 'rgba(246,243,235,0.60)' }}>
            Toca un tema para empezar, o escribe lo que llevas en el corazón.
          </p>

          {/* Onda decorativa — mismo lenguaje visual del mockup, sin pretender ser audio real */}
          <div className="flex items-end justify-center gap-[3px] h-7 mt-4" aria-hidden="true">
            {WAVE_HEIGHTS.map((h, i) => (
              <span key={i} className="w-[3px] rounded-full" style={{ height: h, background: WAVE_COLORS[i % WAVE_COLORS.length], opacity: 0.7 }} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-6 space-y-5 mt-4"
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
              <input ref={titleRef} name="title" type="text" required maxLength={120}
                value={titleValue} onChange={e => setTitleValue(e.target.value)}
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
