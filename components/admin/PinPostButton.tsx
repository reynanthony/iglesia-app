'use client'

import { useState, useTransition } from 'react'
import { pinPost } from '@/app/actions/admin'
import { Pin } from 'lucide-react'
import { CARD, BORDER, MUTED, GOLD } from '@/lib/gold-theme'

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
          ? { background: `${GOLD}22`, color: GOLD, border: `1px solid ${GOLD}40` }
          : { background: CARD, color: MUTED, border: `1px solid ${BORDER}` }
      }
    >
      <Pin size={12} />
      {active ? 'Fijado' : 'Fijar'}
    </button>
  )
}
