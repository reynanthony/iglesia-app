'use client'

import { useState, useTransition } from 'react'
import { deleteSession } from '@/app/actions/bible-study'
import { Trash2 } from 'lucide-react'

export default function DeleteSessionButton({ sessionId, seriesId }: { sessionId: string; seriesId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deleteSession(sessionId, seriesId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar?' : 'Eliminar sesión'}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition disabled:opacity-40"
      style={{
        background: confirm ? 'rgba(127,29,29,0.60)' : 'transparent',
        color: confirm ? '#FCA5A5' : 'rgba(248,113,113,0.50)',
      }}
    >
      <Trash2 size={13} />
    </button>
  )
}
