'use client'

import { useState, useTransition } from 'react'
import { X, Plus } from 'lucide-react'
import { assignUserToMinistry, removeUserFromMinistry } from '@/app/actions/admin'

type Ministry = { id: string; name: string }
type Assignment = { ministry_id: string; ministries: { id: string; name: string } | null }

export default function MinistryAssignment({
  userId,
  assignments,
  allMinistries,
}: {
  userId: string
  assignments: Assignment[]
  allMinistries: Ministry[]
}) {
  const [pending, startTransition] = useTransition()
  const [showAdd, setShowAdd] = useState(false)

  const assignedIds = assignments.map(a => a.ministry_id)
  const available = allMinistries.filter(m => !assignedIds.includes(m.id))

  function assign(ministryId: string) {
    setShowAdd(false)
    startTransition(async () => {
      await assignUserToMinistry(userId, ministryId)
    })
  }

  function remove(ministryId: string) {
    startTransition(async () => {
      await removeUserFromMinistry(userId, ministryId)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {assignments.map(a => (
        <span
          key={a.ministry_id}
          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg"
          style={{ background: '#0D3352', color: '#76ABAE', border: '1px solid #2A3A2A' }}
        >
          {a.ministries?.name ?? '—'}
          <button
            onClick={() => remove(a.ministry_id)}
            disabled={pending}
            className="ml-0.5 opacity-60 hover:opacity-100 transition"
          >
            <X size={10} />
          </button>
        </span>
      ))}

      {available.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowAdd(v => !v)}
            disabled={pending}
            className="w-6 h-6 rounded-md flex items-center justify-center transition"
            style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.40)', border: '1px solid #0D3352' }}
          >
            <Plus size={11} />
          </button>

          {showAdd && (
            <div
              className="absolute left-0 top-8 z-50 rounded-xl shadow-xl min-w-[160px] py-1 overflow-hidden"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
            >
              {available.map(m => (
                <button
                  key={m.id}
                  onClick={() => assign(m.id)}
                  className="w-full text-left px-3 py-2 text-[12px] transition hover:bg-[#222222]"
                  style={{ color: '#D0D0D0' }}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {assignments.length === 0 && !showAdd && (
        <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.25)' }}>Sin ministerio</span>
      )}
    </div>
  )
}
