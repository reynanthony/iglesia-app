'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPrayerResponse } from '@/app/actions/prayer'
import { MessageSquarePlus, Send, HandHeart } from 'lucide-react'

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
        style={{ background: 'rgba(118,171,174,0.08)', border: '1px solid rgba(118,171,174,0.25)' }}>
        <HandHeart size={18} style={{ color: '#76ABAE', flexShrink: 0 }} />
        <p className="text-sm font-bold" style={{ color: '#76ABAE' }}>
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
        style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.30)', color: '#76ABAE' }}
      >
        <MessageSquarePlus size={16} /> Responder con una oración
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit}
      className="rounded-2xl p-5 space-y-4"
      style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.30)' }}>
      <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: '#76ABAE' }}>
        Escribe tu oración
      </p>
      <textarea
        name="body"
        required
        rows={4}
        autoFocus
        placeholder="Señor, te pido por esta persona..."
        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none placeholder:opacity-40"
        style={{ background: '#0D3352', border: '1px solid #1A4A6E', color: '#F6F3EB' }}
      />
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input name="is_anonymous" type="checkbox" className="w-4 h-4 rounded accent-[#76ABAE]" />
        <span className="text-[12px] font-bold" style={{ color: 'rgba(246,243,235,0.68)' }}>
          Enviar como anónimo
        </span>
      </label>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-xl text-sm font-bold transition"
          style={{ color: 'rgba(246,243,235,0.55)', border: '1px solid #0D3352' }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black transition disabled:opacity-50 active:scale-[0.98]"
          style={{ background: '#76ABAE', color: '#061E30' }}>
          <Send size={13} />
          {loading ? 'Enviando...' : 'Enviar oración'}
        </button>
      </div>
    </form>
  )
}
