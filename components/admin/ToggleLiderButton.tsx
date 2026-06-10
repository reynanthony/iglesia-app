'use client'

import { Eye, EyeOff } from 'lucide-react'
import { togglePublico } from '@/app/actions/lideres-admin'
import { useTransition } from 'react'

export default function ToggleLiderButton({ id, isPublic }: { id: string; isPublic: boolean }) {
  const [pending, start] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => { await togglePublico(id, isPublic) })}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition disabled:opacity-40"
      style={{ background: '#061E30' }}
      title={isPublic ? 'Ocultar' : 'Mostrar'}
    >
      {isPublic
        ? <Eye size={13} style={{ color: 'rgba(118,171,174,0.7)' }} />
        : <EyeOff size={13} style={{ color: 'rgba(246,243,235,0.55)' }} />
      }
    </button>
  )
}
