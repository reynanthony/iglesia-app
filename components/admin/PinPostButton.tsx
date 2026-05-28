'use client'

import { useState, useTransition } from 'react'
import { pinPost } from '@/app/actions/admin'
import { Pin } from 'lucide-react'

export default function PinPostButton({ postId, pinned }: { postId: string; pinned: boolean }) {
  const [active, setActive] = useState(pinned)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    const next = !active
    setActive(next)
    startTransition(async () => {
      const res = await pinPost(postId, next)
      if (res.error) setActive(active)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={active ? 'Desfijar' : 'Fijar en el feed'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition"
      style={
        active
          ? { background: '#0D3352', color: '#76ABAE', border: '1px solid #2A3A2A' }
          : { background: '#0B2D47', color: 'rgba(246,243,235,0.40)', border: '1px solid #0D3352' }
      }
    >
      <Pin size={12} />
      {active ? 'Fijado' : 'Fijar'}
    </button>
  )
}
