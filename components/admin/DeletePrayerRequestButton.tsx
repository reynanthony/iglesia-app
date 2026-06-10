'use client'

import { useState, useTransition } from 'react'
import { deletePrayerRequest } from '@/app/actions/admin'
import { Trash2 } from 'lucide-react'

export default function DeletePrayerRequestButton({ requestId }: { requestId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deletePrayerRequest(requestId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar eliminación?' : 'Eliminar petición'}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition disabled:opacity-40 flex-shrink-0"
      style={{
        background: confirm ? 'rgba(127,29,29,0.60)' : '#0B2D47',
        border: `1px solid ${confirm ? '#991B1B' : '#0D3352'}`,
        color: confirm ? '#FCA5A5' : 'rgba(248,113,113,0.40)',
      }}
    >
      <Trash2 size={13} />
    </button>
  )
}
