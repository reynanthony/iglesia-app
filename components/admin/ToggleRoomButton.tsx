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
      style={{ background: active ? 'rgba(100,200,100,0.10)' : '#1A1A1A', border: '1px solid #2A2A2A' }}
    >
      <Power size={13} style={{ color: active ? '#6BCB6B' : '#4D4D4D' }} />
    </button>
  )
}
