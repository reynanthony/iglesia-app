'use client'

import { useState, useTransition } from 'react'
import { deleteAdminUser } from '@/app/actions/admin'
import { Trash2 } from 'lucide-react'

export default function DeleteUserButton({ userId, username }: { userId: string; username: string }) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 4000)
      return
    }
    startTransition(async () => {
      await deleteAdminUser(userId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={confirm ? `¿Eliminar @${username}?` : 'Eliminar usuario'}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
        confirm ? 'bg-red-500 text-white' : 'bg-[#0D3352] text-[rgba(246,243,235,0.72)] hover:text-red-400 hover:bg-red-500/10'
      }`}
    >
      <Trash2 size={12} />
      {confirm ? '¿Confirmar?' : 'Eliminar'}
    </button>
  )
}
