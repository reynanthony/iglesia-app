'use client'

import { useState, useTransition } from 'react'
import { deletePredica } from '@/app/actions/predicas-admin'
import { Trash2 } from 'lucide-react'

export default function DeletePredicaButton({ predicaId }: { predicaId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deletePredica(predicaId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar eliminación?' : 'Eliminar prédica'}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40"
      style={{ background: confirm ? '#7F1D1D' : '#0B2D47', border: `1px solid ${confirm ? '#991B1B' : '#0D3352'}` }}
    >
      <Trash2 size={13} style={{ color: confirm ? '#FCA5A5' : '#6B3333' }} />
    </button>
  )
}
