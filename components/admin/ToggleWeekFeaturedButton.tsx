'use client'

import { Star } from 'lucide-react'
import { toggleWeekFeatured } from '@/app/actions/pastoral-admin'
import { MUTED } from '@/lib/gold-theme'

export default function ToggleWeekFeaturedButton({ id, current }: { id: string; current: boolean }) {
  return (
    <form action={() => toggleWeekFeatured(id, current)}>
      <button
        type="submit"
        className="w-8 h-8 flex items-center justify-center rounded-lg transition"
        style={{ color: current ? '#C9A227' : MUTED, background: current ? 'rgba(201,162,39,0.12)' : 'transparent' }}
        title={current ? 'Quitar como mensaje de la semana' : 'Marcar como mensaje de la semana'}
      >
        <Star size={13} fill={current ? '#C9A227' : 'none'} />
      </button>
    </form>
  )
}
