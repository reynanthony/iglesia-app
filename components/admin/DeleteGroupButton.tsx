'use client'

import { useState, useTransition } from 'react'
import { deleteGroup } from '@/app/actions/groups'
import { Trash2 } from 'lucide-react'

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deleteGroup(groupId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? '¿Confirmar eliminación?' : 'Eliminar grupo'}
      className="text-[10px] md:text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition disabled:opacity-40"
      style={{
        background: confirm ? 'rgba(248,113,113,0.25)' : 'rgba(248,113,113,0.08)',
        color: '#F87171',
        border: `1px solid ${confirm ? 'rgba(248,113,113,0.40)' : 'transparent'}`,
      }}
    >
      {confirm ? '¿Eliminar?' : <Trash2 size={12} />}
    </button>
  )
}
