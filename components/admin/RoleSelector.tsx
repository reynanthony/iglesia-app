'use client'

import { useState } from 'react'
import { updateUserRole } from '@/app/actions/admin'

const roles = ['miembro', 'visitante', 'lider', 'moderador', 'pastor', 'admin']

// Roles cuyo otorgamiento requiere confirmación explícita: control administrativo o pastoral.
const HIGH_PRIVILEGE_ROLES = new Set(['admin', 'pastor'])

export default function RoleSelector({ userId, username, currentRole }: { userId: string, username?: string, currentRole: string }) {
  const [role, setRole] = useState(currentRole)
  const [saving, setSaving] = useState(false)
  const [pendingRole, setPendingRole] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function applyRole(newRole: string) {
    setError(null)
    setRole(newRole)
    setSaving(true)
    const result = await updateUserRole(userId, newRole)
    setSaving(false)
    if (result?.error) {
      setRole(currentRole)
      setError(result.error)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value
    if (HIGH_PRIVILEGE_ROLES.has(newRole) && newRole !== currentRole) {
      setPendingRole(newRole)
      return
    }
    applyRole(newRole)
  }

  return (
    <div className="inline-flex flex-col gap-1.5">
      <select
        value={role}
        onChange={handleChange}
        disabled={saving}
        className={`w-full md:w-auto bg-[#0D3352] border border-[#1a4a70] text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE] transition capitalize ${
          role === 'admin' ? 'text-red-400' :
          role === 'pastor' ? 'text-purple-400' :
          role === 'moderador' ? 'text-blue-400' :
          'text-[rgba(246,243,235,0.70)]'
        }`}
      >
        {roles.map(r => (
          <option key={r} value={r} className="bg-[#0B2D47] capitalize">{r}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}

      {pendingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl bg-[#0B2D47] border border-[#1a4a70] p-5 space-y-4">
            <p className="text-sm text-[rgba(246,243,235,0.90)]">
              ¿Otorgar rol <span className="font-semibold capitalize">{pendingRole}</span>
              {username ? <> a <span className="font-semibold">@{username}</span></> : null}?
            </p>
            <p className="text-xs text-[rgba(246,243,235,0.55)]">
              Este rol otorga acceso {pendingRole === 'admin' ? 'administrativo completo al sistema' : 'pastoral privilegiado'}. Esta acción es reversible, pero toma efecto de inmediato.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingRole(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[rgba(246,243,235,0.70)] hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => { const r = pendingRole; setPendingRole(null); applyRole(r) }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}