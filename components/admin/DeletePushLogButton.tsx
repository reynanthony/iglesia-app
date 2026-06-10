'use client'

import { useState, useTransition } from 'react'
import { deletePushLog } from '@/app/actions/native'
import { Trash2 } from 'lucide-react'

export default function DeletePushLogButton({ logId }: { logId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deletePushLog(logId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar?' : 'Eliminar'}
      className="w-7 h-7 flex items-center justify-center rounded-lg transition disabled:opacity-40 flex-shrink-0"
      style={{
        background: confirm ? 'rgba(127,29,29,0.60)' : 'transparent',
        color: confirm ? '#FCA5A5' : 'rgba(248,113,113,0.35)',
      }}
    >
      <Trash2 size={12} />
    </button>
  )
}
