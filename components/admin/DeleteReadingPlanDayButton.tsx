'use client'

import { useState, useTransition } from 'react'
import { deleteReadingPlanDay } from '@/app/actions/bible-reading-plans'
import { X } from 'lucide-react'
import { BORDER } from '@/lib/gold-theme'

export default function DeleteReadingPlanDayButton({ planId, dayId }: { planId: string; dayId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deleteReadingPlanDay(planId, dayId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar eliminación?' : 'Eliminar día'}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-40 flex-shrink-0"
      style={{ background: confirm ? '#7F1D1D' : 'transparent', border: `1px solid ${confirm ? '#991B1B' : BORDER}` }}
    >
      <X size={13} style={{ color: confirm ? '#FCA5A5' : '#6B3333' }} />
    </button>
  )
}
