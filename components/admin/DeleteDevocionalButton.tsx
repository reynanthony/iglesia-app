'use client'

import { useState, useTransition } from 'react'
import { deleteDevocional } from '@/app/actions/devocionales-admin'
import { Trash2 } from 'lucide-react'
import { CARD, BORDER } from '@/lib/gold-theme'

export default function DeleteDevocionalButton({ devocionalId }: { devocionalId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deleteDevocional(devocionalId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar eliminación?' : 'Eliminar devocional'}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40"
      style={{ background: confirm ? '#7F1D1D' : CARD, border: `1px solid ${confirm ? '#991B1B' : BORDER}` }}
    >
      <Trash2 size={13} style={{ color: confirm ? '#FCA5A5' : '#6B3333' }} />
    </button>
  )
}
