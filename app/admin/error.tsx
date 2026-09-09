'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { BG, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AdminError]', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: BG, color: INK }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: MUTED }}>
        Panel Admin — Error
      </p>
      <h1 className="font-black text-3xl tracking-tight mb-3">Algo salió mal</h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: MUTED }}>
        Ocurrió un error en el panel de administración.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: GOLD, color: GOLD_INK }}
        >
          Reintentar
        </button>
        <Link
          href="/admin"
          className="px-5 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: 'rgba(255,255,255,0.08)', color: MUTED, border: '1px solid rgba(139,146,162,0.12)' }}
        >
          Volver al panel
        </Link>
      </div>
    </div>
  )
}
