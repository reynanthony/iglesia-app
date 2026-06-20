'use client'

import { useState, useTransition } from 'react'
import { X, Plus, ChevronDown } from 'lucide-react'
import { assignUserToMinistry, removeUserFromMinistry, updateMinistryAssignmentRole } from '@/app/actions/admin'

type Ministry   = { id: string; name: string }
type Assignment = { ministry_id: string; role?: string; ministries: { id: string; name: string } | null }

const ROLE_LABELS: Record<string, string> = { lider: 'Líder', colaborador: 'Colab.' }
const ROLE_STYLE: Record<string, React.CSSProperties> = {
  lider:       { background: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.30)' },
  colaborador: { background: 'rgba(118,171,174,0.10)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.20)' },
}

export default function MinistryAssignment({
  userId,
  assignments,
  allMinistries,
  addOnly = false,
}: {
  userId: string
  assignments: Assignment[]
  allMinistries: Ministry[]
  addOnly?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const [showAdd, setShowAdd]       = useState(false)
  const [pendingMinistry, setPendingMinistry] = useState<string | null>(null)

  const assignedIds = assignments.map(a => a.ministry_id)
  const available   = allMinistries.filter(m => !assignedIds.includes(m.id))

  function assign(ministryId: string, role: 'lider' | 'colaborador') {
    setPendingMinistry(null)
    setShowAdd(false)
    startTransition(async () => { await assignUserToMinistry(userId, ministryId, role) })
  }

  function remove(ministryId: string) {
    startTransition(async () => { await removeUserFromMinistry(userId, ministryId) })
  }

  function changeRole(ministryId: string, role: 'lider' | 'colaborador') {
    startTransition(async () => { await updateMinistryAssignmentRole(userId, ministryId, role) })
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {!addOnly && assignments.map(a => {
        const role = (a.role ?? 'colaborador') as 'lider' | 'colaborador'
        return (
          <span key={a.ministry_id} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg"
            style={{ background: '#0D3352', border: '1px solid #1A4A6E' }}>
            {/* Role badge — click to toggle */}
            <button
              onClick={() => changeRole(a.ministry_id, role === 'lider' ? 'colaborador' : 'lider')}
              disabled={pending}
              title="Cambiar rol"
              className="text-[9px] font-black px-1.5 py-0.5 rounded transition"
              style={ROLE_STYLE[role]}
            >
              {ROLE_LABELS[role]}
            </button>
            <span style={{ color: '#76ABAE' }}>{a.ministries?.name ?? '—'}</span>
            <button onClick={() => remove(a.ministry_id)} disabled={pending}
              className="ml-0.5 opacity-50 hover:opacity-100 transition">
              <X size={10} style={{ color: 'rgba(246,243,235,0.60)' }} />
            </button>
          </span>
        )
      })}

      {/* Add button */}
      {available.length > 0 && (
        <div className="relative">
          <button
            onClick={() => { setShowAdd(v => !v); setPendingMinistry(null) }}
            disabled={pending}
            className="w-6 h-6 rounded-md flex items-center justify-center transition"
            style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.68)', border: '1px solid #0D3352' }}
          >
            <Plus size={11} />
          </button>

          {showAdd && !pendingMinistry && (
            <div className="absolute left-0 top-8 z-50 rounded-xl shadow-xl min-w-[170px] py-1 overflow-hidden"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              {available.map(m => (
                <button key={m.id} onClick={() => setPendingMinistry(m.id)}
                  className="w-full text-left px-3 py-2 text-[12px] flex items-center justify-between hover:bg-[#0D3352] transition"
                  style={{ color: '#F6F3EB' }}>
                  {m.name}
                  <ChevronDown size={10} style={{ color: 'rgba(246,243,235,0.55)' }} />
                </button>
              ))}
            </div>
          )}

          {/* Role picker */}
          {pendingMinistry && (
            <div className="absolute left-0 top-8 z-50 rounded-xl shadow-xl min-w-[150px] overflow-hidden"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <p className="px-3 pt-2.5 pb-1 text-[9px] font-black uppercase tracking-wider"
                style={{ color: 'rgba(246,243,235,0.55)' }}>
                Rol en el ministerio
              </p>
              {(['lider', 'colaborador'] as const).map(role => (
                <button key={role} onClick={() => assign(pendingMinistry, role)}
                  className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2 hover:bg-[#0D3352] transition">
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={ROLE_STYLE[role]}>
                    {ROLE_LABELS[role]}
                  </span>
                  <span style={{ color: '#F6F3EB' }}>{role === 'lider' ? 'Responsable' : 'Colaborador'}</span>
                </button>
              ))}
              <button onClick={() => setPendingMinistry(null)}
                className="w-full text-left px-3 py-2 text-[11px] transition"
                style={{ color: 'rgba(246,243,235,0.55)' }}>
                ← Volver
              </button>
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
