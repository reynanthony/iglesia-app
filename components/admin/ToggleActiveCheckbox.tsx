'use client'

import { Check } from 'lucide-react'
import { toggleAnnouncementActive } from '@/app/actions/announcements'
import { BG, MUTED, GOLD } from '@/lib/gold-theme'

export default function ToggleActiveCheckbox({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <form action={toggleAnnouncementActive.bind(null, id, !isActive)}>
      <button
        type="submit"
        title={isActive ? 'Desactivar campaña' : 'Activar campaña'}
        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: isActive ? GOLD : 'transparent',
          border: `1.5px solid ${isActive ? GOLD : MUTED}`,
        }}
      >
        {isActive && <Check size={11} strokeWidth={3} style={{ color: BG }} />}
      </button>
    </form>
  )
}
