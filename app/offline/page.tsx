'use client'

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#093C5D' }}>
      <svg width="64" height="64" viewBox="0 0 48 48" fill="none" aria-hidden className="mb-6 opacity-40">
        <rect x="21.5" y="9" width="5" height="30" rx="2.5" fill="#F6F3EB" />
        <rect x="9" y="18" width="30" height="5" rx="2.5" fill="#F6F3EB" />
      </svg>
      <h1 className="font-black text-2xl tracking-tight text-center mb-3" style={{ color: '#F6F3EB' }}>
        Sin conexión
      </h1>
      <p className="text-sm text-center max-w-xs" style={{ color: 'rgba(246,243,235,0.55)' }}>
        Verifica tu conexión a internet y vuelve a intentarlo.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition hover:opacity-90"
        style={{ background: '#76ABAE', color: '#093C5D' }}
      >
        Reintentar
      </button>
    </main>
  )
}
