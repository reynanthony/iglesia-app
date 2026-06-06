'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { resetAllAnnouncementViews } from '@/app/actions/announcements'

function clearLocalAnnouncementStorage() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('elm_ann_'))
  keys.forEach(k => localStorage.removeItem(k))
  const skeys = Object.keys(sessionStorage).filter(k => k.startsWith('elm_ann_'))
  skeys.forEach(k => sessionStorage.removeItem(k))
}

export default function ResetViewsButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState('')
  const [isError, setIsError] = useState(false)

  async function handleReset() {
    if (!confirm('¿Resetear las vistas de TODAS las campañas?\nLos usuarios verán los anuncios activos de nuevo.')) return
    setLoading(true)
    setMsg('')
    const result = await resetAllAnnouncementViews()
    setLoading(false)
    clearLocalAnnouncementStorage()
    if (result?.error) { setIsError(true); setMsg(result.error); return }
    setIsError(false)
    setMsg(result?.partial ? '¡Listo! (solo tus vistas — agrega SUPABASE_SERVICE_ROLE_KEY para resetear todos)' : '¡Listo!')
    setTimeout(() => setMsg(''), 5000)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleReset}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium disabled:opacity-50 transition"
        style={{ background: '#0B2D47', border: '1px solid #0D3352', color: 'rgba(246,243,235,0.55)' }}
      >
        <RotateCcw size={12} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Reseteando…' : 'Resetear vistas'}
      </button>
      {msg && (
        <p className="text-[11px] max-w-[220px] text-right" style={{ color: isError ? '#F87171' : '#76ABAE' }}>
          {msg}
        </p>
      )}
    </div>
  )
}
