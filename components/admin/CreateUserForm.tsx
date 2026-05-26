'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminUser } from '@/app/actions/admin'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

const ROLES = ['miembro', 'visitante', 'lider', 'moderador', 'pastor', 'admin']

export default function CreateUserForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createAdminUser(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess('Usuario creado exitosamente.')
        setTimeout(() => router.push('/admin/usuarios'), 1500)
      }
    })
  }

  const field = "w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition"
  const fieldStyle = { background: '#141414', borderColor: '#2A2A2A', color: '#F5F5F5' }
  const lbl = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const lblStyle = { color: '#4D4D4D' }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl} style={lblStyle}>Nombre completo *</label>
          <input name="full_name" required placeholder="Juan Pérez" className={field} style={fieldStyle} />
        </div>
        <div>
          <label className={lbl} style={lblStyle}>Nombre de usuario *</label>
          <input name="username" required placeholder="juanperez" className={field} style={fieldStyle} />
        </div>
      </div>

      <div>
        <label className={lbl} style={lblStyle}>Correo electrónico *</label>
        <input name="email" type="email" required placeholder="juan@correo.com" className={field} style={fieldStyle} />
      </div>

      <div>
        <label className={lbl} style={lblStyle}>Contraseña *</label>
        <input name="password" type="password" required minLength={6} placeholder="Mínimo 6 caracteres"
          className={field} style={fieldStyle} />
      </div>

      <div>
        <label className={lbl} style={lblStyle}>Rol inicial</label>
        <select name="role" className={field} style={fieldStyle}>
          {ROLES.map(r => <option key={r} value={r} className="bg-slate-900 capitalize">{r}</option>)}
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(100,200,100,0.08)', border: '1px solid rgba(100,200,100,0.15)' }}>
          <CheckCircle2 size={14} style={{ color: '#6BCB6B', flexShrink: 0 }} />
          <p className="text-sm" style={{ color: '#6BCB6B' }}>{success}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending}
          className="flex-1 py-3 rounded-xl text-sm font-bold transition disabled:opacity-50"
          style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
          {isPending ? 'Creando…' : 'Crear usuario'}
        </button>
        <a href="/admin/usuarios" className="px-5 py-3 rounded-xl text-sm font-medium text-center"
          style={{ background: '#1A1A1A', color: '#8A8A8A' }}>
          Cancelar
        </a>
      </div>
    </form>
  )
}
