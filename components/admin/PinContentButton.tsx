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
      style={{ background: active ? '#0D3352' : '#0B2D47', border: `1px solid ${active ? 'rgba(118,171,174,0.20)' : '#0D3352'}` }}
    >
      <Pin size={13} style={{ color: active ? '#76ABAE' : 'rgba(246,243,235,0.40)' }} />
    </button>
  )
}
