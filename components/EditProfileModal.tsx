'use client'

import { useState, useRef } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Pencil, X } from 'lucide-react'

export default function EditProfileModal({ profile }: { profile: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setOpen(false)
      setPreview(null)
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-xl text-sm transition"
      >
        <Pencil size={14} /> Editar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="font-bold">Editar perfil</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-lg transition">
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 rounded-full overflow-hidden bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-3xl cursor-pointer hover:opacity-80 transition relative"
                >
                  {preview || profile.avatar_url ? (
                    <img src={preview ?? profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    profile.full_name?.[0]?.toUpperCase() ?? 'U'
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition rounded-full">
                    <Pencil size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-slate-500 text-xs">Toca para cambiar la foto</p>
                <input
                  ref={fileRef}
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-1.5">Nombre completo</label>
                <input
                  name="full_name"
                  defaultValue={profile.full_name}
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-1.5">Biografía</label>
                <textarea
                  name="bio"
                  defaultValue={profile.bio ?? ''}
                  rows={3}
                  placeholder="Cuéntanos sobre ti..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition resize-none placeholder:text-slate-500"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 border border-slate-700 hover:border-slate-500 rounded-xl text-sm transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm transition"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}