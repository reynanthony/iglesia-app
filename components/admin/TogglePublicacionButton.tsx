'use client'

import { useTransition } from 'react'
import { togglePublicacionActive } from '@/app/actions/publicaciones'
import { BG, BORDER, GOLD } from '@/lib/gold-theme'

export default function TogglePublicacionButton({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, start] = useTransition()

  return (
    <button
      onClick={() => start(async () => { await togglePublicacionActive(id, !isActive) })}
      disabled={pending}
      title={isActive ? 'Desactivar' : 'Activar'}
      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition disabled:opacity-40"
      style={{
        background: isActive ? GOLD : 'transparent',
        borderColor: isActive ? GOLD : BORDER,
      }}
    >
      {isActive && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2.5 2.5L8 3" stroke={BG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
