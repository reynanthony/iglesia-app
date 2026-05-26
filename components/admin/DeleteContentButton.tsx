'use client'

import { useState, useTransition } from 'react'
import { deleteContent } from '@/app/actions/admin'
import { Trash2 } from 'lucide-react'

export default function DeleteContentButton({ contentId }: { contentId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deleteContent(contentId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar eliminación?' : 'Eliminar'}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40"
      style={{ background: confirm ? '#7F1D1D' : '#1A1A1A', border: `1px solid ${confirm ? '#991B1B' : '#2A2A2A'}` }}
    >
      <Trash2 size={13} style={{ color: confirm ? '#FCA5A5' : '#6B3333' }} />
    </button>
  )
}
