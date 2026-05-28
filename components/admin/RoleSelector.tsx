'use client'

import { useState } from 'react'
import { updateUserRole } from '@/app/actions/admin'

const roles = ['miembro', 'visitante', 'lider', 'moderador', 'pastor', 'admin']

export default function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [role, setRole] = useState(currentRole)
  const [saving, setSaving] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value
    setRole(newRole)
    setSaving(true)
    await updateUserRole(userId, newRole)
    setSaving(false)
  }

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={saving}
      className={`bg-[#0D3352] border border-slate-700 text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#000000] transition capitalize ${
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
  )
}