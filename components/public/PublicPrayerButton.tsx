'use client'
import { useState, useTransition } from 'react'
import { Flame } from 'lucide-react'
import { togglePublicPrayer } from '@/app/actions/prayer'

interface PublicPrayerButtonProps {
  requestId: string
  initialCount: number
  initialPrayed: boolean
  isAuthenticated: boolean
}

export function PublicPrayerButton({ requestId, initialCount, initialPrayed, isAuthenticated }: PublicPrayerButtonProps) {
  const [prayed, setPrayed] = useState(initialPrayed)
  const [count, setCount] = useState(initialCount)
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!isAuthenticated) { window.location.href = '/login'; return }
    const next = !prayed
    setPrayed(next)
    setCount(c => next ? c + 1 : Math.max(0, c - 1))
    startTransition(async () => { await togglePublicPrayer(requestId) })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-2 rounded-lg transition-all disabled:opacity-60 cursor-pointer flex-shrink-0"
      style={prayed
        ? { background: 'rgba(118,171,174,0.12)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.30)' }
        : { background: 'transparent', color: '#869B7E', border: '1px solid rgba(9,60,93,0.15)' }
      }
    >
      <Flame size={12} style={{ color: prayed ? '#76ABAE' : '#869B7E' }} />
      {count > 0 ? count : 'Orar'}
    </button>
  )
}
