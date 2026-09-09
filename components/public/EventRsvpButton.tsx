'use client'
import { useState, useTransition } from 'react'
import { CalendarCheck, Check } from 'lucide-react'
import { toggleEventRsvp } from '@/app/actions/events'
import { CARD, GOLD, INK } from '@/lib/gold-theme'

interface EventRsvpButtonProps {
  eventId: string
  initialCount: number
  initialRsvped: boolean
  isAuthenticated: boolean
}

export function EventRsvpButton({ eventId, initialCount, initialRsvped, isAuthenticated }: EventRsvpButtonProps) {
  const [rsvped, setRsvped] = useState(initialRsvped)
  const [count, setCount] = useState(initialCount)
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!isAuthenticated) { window.location.href = '/login'; return }
    const next = !rsvped
    setRsvped(next)
    setCount(c => next ? c + 1 : Math.max(0, c - 1))
    startTransition(async () => { await toggleEventRsvp(eventId) })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 cursor-pointer"
      style={rsvped
        ? { background: `${GOLD}26`, color: GOLD, border: '1px solid rgba(199,154,42,0.35)' }
        : { background: INK, color: CARD }
      }
    >
      {rsvped ? <Check size={12} /> : <CalendarCheck size={12} />}
      {rsvped
        ? `¡Voy! · ${count}`
        : count > 0 ? `Asistiré · ${count} van` : 'Asistiré'
      }
    </button>
  )
}
