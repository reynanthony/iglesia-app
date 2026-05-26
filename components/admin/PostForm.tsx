'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminPost, updateAdminPost } from '@/app/actions/admin'
import { AlertCircle, ImageIcon, X } from 'lucide-react'

type Props = {
  postId?: string
  initialValues?: { content: string; pinned: boolean; image_url: string }
  backHref: string
  submitLabel: string
}

export default function PostForm({ postId, initialValues, backHref, submitLabel }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(initialValues?.image_url ?? '')

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = postId
        ? await updateAdminPost(postId, formData)
        : await createAdminPost(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push(backHref)
      }
    })
  }

  const field = "w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition"
  const fieldStyle = { background: '#141414', borderColor: '#2A2A2A', color: '#F5F5F5' }
  const lbl = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const lblStyle = { color: '#4D4D4D' }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">

      <div>
        <label className={lbl} style={lblStyle}>Texto de la publicación</label>
        <textarea name="content" rows={5} defaultValue={initialValues?.content ?? ''}
          placeholder="¿Qué quieres compartir con la comunidad?"
          className={`${field} resize-none`} style={fieldStyle} />
      </div>

      {/* Image */}
      <div>
        <label className={lbl} style={lblStyle}>Imagen</label>
        {preview && (
          <div className="relative mb-3">
            <img src={preview} alt="preview" className="w-full rounded-xl object-cover" style={{ maxHeight: 260 }} />
            <button type="button" onClick={() => setPreview('')}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)' }}>
              <X size={13} style={{ color: '#F5F5F5' }} />
            </button>
          </div>
        )}
        <label className="rounded-xl border-2 border-dashed p-5 flex flex-col items-center gap-2 cursor-pointer transition hover:border-slate-600"
          style={{ borderColor: '#2A2A2A' }}>
          <ImageIcon size={20} style={{ color: '#3A3A3A' }} />
          <span className="text-[12px]" style={{ color: '#5A5A5A' }}>
            {preview ? 'Cambiar imagen' : 'Agregar imagen (opcional)'}
          </span>
          <input type="file" name="image" accept="image/*" className="sr-only" onChange={handleFile} />
        </label>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" name="pinned" defaultChecked={initialValues?.pinned ?? false}
          className="w-4 h-4 accent-white rounded" />
        <span className="text-[13px] font-medium" style={{ color: '#8A8A8A' }}>
          Fijar en el feed (aparece primero)
        </span>
      </label>

      {error && (
        <div className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0 }} />
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending}
          className="flex-1 py-3 rounded-xl text-sm font-bold transition disabled:opacity-50"
          style={{ background: '#F5F5F5', color: '#0A0A0A' }}>
          {isPending ? 'Guardando…' : submitLabel}
        </button>
        <a href={backHref} className="px-5 py-3 rounded-xl text-sm font-medium text-center"
          style={{ background: '#1A1A1A', color: '#8A8A8A' }}>
          Cancelar
        </a>
      </div>
    </form>
  )
}
