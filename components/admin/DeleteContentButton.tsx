'use client'

import { useState, useTransition } from 'react'
import { deleteContent } from '@/app/actions/admin'
import { Trash2, Check } from 'lucide-react'
import { CARD, BORDER } from '@/lib/gold-theme'

export default function DeleteContentButton({ contentId }: { contentId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    setError(null)
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      const res = await deleteContent(contentId)
      if (res?.error) setError(res.error)
      setConfirm(false)
    })
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isPending}
        title={confirm ? 'Confirmar: clic de nuevo para borrar' : 'Eliminar'}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40"
        style={{ background: confirm ? '#7F1D1D' : CARD, border: `1px solid ${confirm ? '#991B1B' : BORDER}` }}
      >
        {confirm
          ? <Check size={13} style={{ color: '#FCA5A5' }} />
          : <Trash2 size={13} style={{ color: '#6B3333' }} />}
      </button>
      {error && (
        <p className="absolute right-0 top-full mt-1 text-[10px] font-bold whitespace-nowrap px-2 py-1 rounded-lg z-10"
          style={{ background: '#7F1D1D', color: '#FCA5A5' }}>
          {error}
        </p>
      )}
    </div>
  )
}
