'use client'

import { useTransition } from 'react'
import { ShieldCheck } from 'lucide-react'
import { toggleMinisterioAdmin } from '@/app/actions/admin'

type Assignment = {
  ministry_id: string
  can_admin?: boolean
  ministries: { id: string; name: string } | null
}

export default function AdminToggle({
  userId,
  assignments,
}: {
  userId: string
  assignments: Assignment[]
}) {
  const [pending, startTransition] = useTransition()

  function toggle(ministryId: string, current: boolean) {
    startTransition(async () => {
      await toggleMinisterioAdmin(userId, ministryId, !current)
    })
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {assignments.map(a => {
        const active = a.can_admin ?? false
        return (
          <button
            key={a.ministry_id}
            onClick={() => toggle(a.ministry_id, active)}
            disabled={pending}
            title={active ? 'Quitar acceso admin del ministerio' : 'Dar acceso admin del ministerio'}
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition"
            style={{
              background: active ? 'rgba(118,171,174,0.15)' : 'rgba(246,243,235,0.06)',
              border: active ? '1px solid rgba(118,171,174,0.35)' : '1px solid rgba(246,243,235,0.12)',
              color: active ? '#76ABAE' : 'rgba(246,243,235,0.40)',
            }}
          >
            <ShieldCheck size={10} />
            <span>{a.ministries?.name ?? '—'}</span>
          </button>
        )
      })}
    </div>
  )
}
