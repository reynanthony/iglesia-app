'use client'

import { useState, useTransition } from 'react'
import { toggleRoom } from '@/app/actions/admin'
import { Power } from 'lucide-react'
import { CARD, BORDER, MUTED, GOLD } from '@/lib/gold-theme'

export default function ToggleRoomButton({ roomId, isActive }: { roomId: string; isActive: boolean }) {
  const [active, setActive] = useState(isActive)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    const next = !active
    setActive(next)
    startTransition(async () => {
      const res = await toggleRoom(roomId, next)
      if (res.error) setActive(!next)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={active ? 'Desactivar sala' : 'Activar sala'}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40"
      style={{ background: active ? `${GOLD}1F` : CARD, border: `1px solid ${BORDER}` }}
    >
      <Power size={13} style={{ color: active ? GOLD : MUTED }} />
    </button>
  )
}
