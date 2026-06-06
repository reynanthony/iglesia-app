'use client'

import { Check } from 'lucide-react'
import { toggleAnnouncementActive } from '@/app/actions/announcements'

export default function ToggleActiveCheckbox({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <form action={toggleAnnouncementActive.bind(null, id, !isActive)}>
      <button
        type="submit"
        title={isActive ? 'Desactivar campaña' : 'Activar campaña'}
        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: isActive ? '#76ABAE' : 'transparent',
          border: `1.5px solid ${isActive ? '#76ABAE' : 'rgba(246,243,235,0.25)'}`,
        }}
      >
        {isActive && <Check size={11} strokeWidth={3} style={{ color: '#061E30' }} />}
      </button>
    </form>
  )
}
