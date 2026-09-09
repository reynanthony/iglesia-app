'use client'

import { useState, useTransition } from 'react'
import { pinContent } from '@/app/actions/admin'
import { Pin } from 'lucide-react'
import { CARD, BORDER, MUTED, GOLD } from '@/lib/gold-theme'

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
      style={{ background: active ? BORDER : CARD, border: `1px solid ${active ? `${GOLD}33` : BORDER}` }}
    >
      <Pin size={13} style={{ color: active ? GOLD : MUTED }} />
    </button>
  )
}
