'use client'

import { useTransition } from 'react'
import { Crown } from 'lucide-react'
import { toggleConsejoPastoral } from '@/app/actions/admin'

export default function ConsejoToggle({ userId, value }: { userId: string; value: boolean }) {
  const [pending, start] = useTransition()

  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { await toggleConsejoPastoral(userId, !value) })}
      title={value ? 'Quitar del consejo pastoral' : 'Agregar al consejo pastoral'}
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition"
      style={value
        ? { background: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.35)' }
        : { background: 'transparent', color: 'rgba(246,243,235,0.25)', border: '1px solid rgba(246,243,235,0.10)' }
      }
    >
      <Crown size={10} />
      Consejo
    </button>
  )
}
