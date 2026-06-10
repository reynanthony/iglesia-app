'use client'

import { useState, useTransition } from 'react'
import { deleteContactMessage } from '@/app/actions/admin'
import { Trash2 } from 'lucide-react'

export default function DeleteContactMessageButton({ messageId }: { messageId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deleteContactMessage(messageId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar eliminación?' : 'Eliminar mensaje'}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition disabled:opacity-40"
      style={{
        background: confirm ? 'rgba(127,29,29,0.60)' : 'rgba(248,113,113,0.10)',
        color: confirm ? '#FCA5A5' : '#F87171',
        border: `1px solid ${confirm ? '#991B1B' : 'rgba(248,113,113,0.20)'}`,
      }}
    >
      <Trash2 size={13} />
      {confirm ? '¿Eliminar?' : 'Eliminar'}
    </button>
  )
}
