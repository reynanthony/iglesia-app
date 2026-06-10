'use client'

import { useState } from 'react'
import { deletePost } from '@/app/actions/admin'
import { Trash2 } from 'lucide-react'

export default function DeletePostButton({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
      return
    }
    setLoading(true)
    await deletePost(postId)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition flex-shrink-0 ${
        confirm
          ? 'bg-red-500 text-white'
          : 'bg-[#0D3352] text-[rgba(246,243,235,0.72)] hover:text-red-400 hover:bg-red-500/10'
      }`}
    >
      <Trash2 size={13} />
      {confirm ? '¿Confirmar?' : 'Eliminar'}
    </button>
  )
}
