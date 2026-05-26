'use client'

import { useState, useTransition } from 'react'
import { pinContent } from '@/app/actions/admin'
import { Pin } from 'lucide-react'

export default function PinContentButton({ contentId, pinned }: { contentId: string; pinned: boolean }) {
  const [active, setActive] = useState(pinned)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    const next = !active
    setActive(next)
    startTransition(async () => {
      const res = await pinContent(contentId, next)
      if (res.error) setActive(!next)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={active ? 'Desfijar' : 'Fijar'}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40"
      style={{ background: active ? '#1A2A1A' : '#1A1A1A', border: `1px solid ${active ? '#2A3A2A' : '#2A2A2A'}` }}
    >
      <Pin size={13} style={{ color: active ? '#6BCB6B' : '#4D4D4D' }} />
    </button>
  )
}
