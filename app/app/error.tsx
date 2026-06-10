'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AppError]', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#061E30', color: '#F6F3EB' }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: 'rgba(246,243,235,0.62)' }}>
        Error
      </p>
      <h1 className="font-black text-3xl tracking-tight mb-3">Algo salió mal</h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: 'rgba(246,243,235,0.50)' }}>
        No pudimos cargar esta sección. Intenta de nuevo.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: '#F6F3EB', color: '#061E30' }}
        >
          Reintentar
        </button>
        <Link
          href="/app/comunidad"
          className="px-5 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: 'rgba(246,243,235,0.08)', color: 'rgba(246,243,235,0.70)', border: '1px solid rgba(246,243,235,0.12)' }}
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
