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
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition"
        style={{ border: '1px solid #0D3352', color: '#F6F3EB' }}
      >
        <Pencil size={14} /> Editar
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(6,30,48,0.85)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full max-w-md rounded-2xl"
            style={{ background: '#061E30', border: '1px solid #0D3352' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid #0D3352' }}
            >
              <h2 className="font-bold" style={{ color: '#F6F3EB' }}>Editar perfil</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg transition"
                style={{ color: 'rgba(246,243,235,0.40)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center font-bold text-3xl cursor-pointer transition relative"
                  style={{ background: '#0D3352', color: '#76ABAE', border: '2px solid #0D3352' }}
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
                <p className="text-xs" style={{ color: 'rgba(246,243,235,0.40)' }}>Toca para cambiar la foto</p>
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
                <label className="text-sm block mb-1.5" style={{ color: 'rgba(246,243,235,0.70)' }}>Nombre completo</label>
                <input
                  name="full_name"
                  defaultValue={profile.full_name}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' }}
                />
              </div>

              <div>
                <label className="text-sm block mb-1.5" style={{ color: 'rgba(246,243,235,0.70)' }}>Biografía</label>
                <textarea
                  name="bio"
                  defaultValue={profile.bio ?? ''}
                  rows={3}
                  placeholder="Cuéntanos sobre ti..."
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none"
                  style={{
                    background: '#0B2D47',
                    border: '1px solid #0D3352',
                    color: '#F6F3EB',
                    caretColor: '#76ABAE',
                  }}
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
                  className="flex-1 py-2.5 rounded-xl text-sm transition"
                  style={{ border: '1px solid #0D3352', color: 'rgba(246,243,235,0.60)' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 font-semibold rounded-xl text-sm transition disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #093C5D, #76ABAE)', color: '#F6F3EB' }}
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
