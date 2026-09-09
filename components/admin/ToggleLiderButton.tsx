'use client'

import { Eye, EyeOff } from 'lucide-react'
import { togglePublico } from '@/app/actions/lideres-admin'
import { useTransition } from 'react'
import { BG, MUTED, GOLD } from '@/lib/gold-theme'

export default function ToggleLiderButton({ id, isPublic }: { id: string; isPublic: boolean }) {
  const [pending, start] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => { await togglePublico(id, isPublic) })}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40"
      style={{ background: BG }}
      title={isPublic ? 'Ocultar' : 'Mostrar'}
    >
      {isPublic
        ? <Eye size={13} style={{ color: `${GOLD}B2` }} />
        : <EyeOff size={13} style={{ color: MUTED }} />
      }
    </button>
  )
}
