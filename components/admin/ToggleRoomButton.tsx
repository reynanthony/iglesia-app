'use client'

import { useState, useTransition } from 'react'
import { toggleRoom } from '@/app/actions/admin'
import { Power } from 'lucide-react'

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
      style={{ background: active ? 'rgba(118,171,174,0.12)' : '#0B2D47', border: '1px solid #0D3352' }}
    >
      <Power size={13} style={{ color: active ? '#76ABAE' : 'rgba(246,243,235,0.68)' }} />
    </button>
  )
}
