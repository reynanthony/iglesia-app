'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { clearPageBlocks } from '@/app/actions/admin'

export default function ResetPageButton({ pageKey }: { pageKey: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('¿Restaurar el diseño original de esta página? Esto eliminará todos los bloques guardados.')) return
    setLoading(true)
    await clearPageBlocks(pageKey)
    setLoading(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition disabled:opacity-40"
      style={{ background: '#2E1A1A', color: '#F87171', border: '1px solid #3A1A1A' }}
    >
      <RotateCcw size={9} />
      {done ? 'Restaurado' : loading ? '…' : 'Restaurar'}
    </button>
  )
}
