'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPrayerResponse } from '@/app/actions/prayer'
import { MessageSquarePlus, Send, HandHeart } from 'lucide-react'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

export default function PrayerResponseForm({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const result = await createPrayerResponse(requestId, fd)
    if (result.success) {
      setDone(true)
      setOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="rounded-2xl p-5 flex items-center gap-3"
        style={{ background: `${GOLD}14`, border: '1px solid rgba(217,166,42,0.25)' }}>
        <HandHeart size={18} style={{ color: GOLD, flexShrink: 0 }} />
        <p className="text-sm font-bold" style={{ color: GOLD }}>
          ¡Tu oración fue enviada! Dios la escucha.
        </p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition active:scale-[0.98]"
        style={{ background: CARD, border: '1px solid rgba(217,166,42,0.30)', color: GOLD }}
      >
        <MessageSquarePlus size={16} /> Responder con una oración
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit}
      className="rounded-2xl p-5 space-y-4"
      style={{ background: CARD, border: '1px solid rgba(217,166,42,0.30)' }}>
      <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>
        Escribe tu oración
      </p>
      <textarea
        name="body"
        required
        rows={4}
        autoFocus
        placeholder="Señor, te pido por esta persona..."
        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none placeholder:opacity-40"
        style={{ background: BORDER, border: `1px solid ${BORDER}`, color: INK }}
      />
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input name="is_anonymous" type="checkbox" className="w-4 h-4 rounded accent-[#D9A62A]" />
        <span className="text-[12px] font-bold" style={{ color: MUTED }}>
          Enviar como anónimo
        </span>
      </label>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-xl text-sm font-bold transition"
          style={{ color: MUTED, border: `1px solid ${BORDER}` }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black transition disabled:opacity-50 active:scale-[0.98]"
          style={{ background: GOLD, color: BG }}>
          <Send size={13} />
          {loading ? 'Enviando...' : 'Enviar oración'}
        </button>
      </div>
    </form>
  )
}
