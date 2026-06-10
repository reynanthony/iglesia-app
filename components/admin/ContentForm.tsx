'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminContent, updateAdminContent } from '@/app/actions/admin'
import { AlertCircle, ImageIcon, X } from 'lucide-react'

type Ministry = { id: string; name: string }

type Props = {
  contentId?: string
  ministries: Ministry[]
  defaultMinistryId?: string
  defaultType?: string
  initialValues?: {
    title: string
    body: string
    video_url: string
    pinned: boolean
    image_url: string
  }
  backHref: string
  submitLabel: string
}

const TYPES = [
  { value: 'articulo', label: 'Artículo' },
  { value: 'anuncio',  label: 'Anuncio' },
  { value: 'video',    label: 'Video' },
]

export default function ContentForm({
  contentId,
  ministries,
  defaultMinistryId,
  defaultType = 'articulo',
  initialValues,
  backHref,
  submitLabel,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(initialValues?.image_url ?? '')
  const [type, setType] = useState(initialValues ? initialValues.video_url ? 'video' : defaultType : defaultType)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = contentId
        ? await updateAdminContent(contentId, formData)
        : await createAdminContent(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push(backHref)
      }
    })
  }

  const field = "w-full px-4 py-3 rounded-xl text-sm border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const lbl = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const lblStyle = { color: 'rgba(246,243,235,0.68)' }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">

      {/* Type tabs */}
      <div>
        <label className={lbl} style={lblStyle}>Tipo de contenido</label>
        <div className="flex gap-2">
          {TYPES.map(t => (
            <label key={t.value}
              className={`flex-1 text-center py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                type === t.value ? 'text-black' : 'text-[rgba(246,243,235,0.72)]'
              }`}
              style={{ background: type === t.value ? '#F6F3EB' : '#0B2D47', border: '1px solid #0D3352' }}>
              <input type="radio" name="type" value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
                className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Ministry */}
      <div>
        <label className={lbl} style={lblStyle}>Ministerio *</label>
        <select name="ministry_id" required className={field} style={fieldStyle}
          defaultValue={defaultMinistryId ?? ''}>
          <option value="">— Selecciona un ministerio —</option>
          {ministries.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className={lbl} style={lblStyle}>Título *</label>
        <input name="title" required defaultValue={initialValues?.title ?? ''}
          placeholder="Título del contenido" className={field} style={fieldStyle} />
      </div>

      {/* Body */}
      <div>
        <label className={lbl} style={lblStyle}>Cuerpo / Descripción</label>
        <textarea name="body" rows={4} defaultValue={initialValues?.body ?? ''}
          placeholder="Escribe el contenido aquí..."
          className={`${field} resize-none`} style={fieldStyle} />
      </div>

      {/* Video URL — only if type === video */}
      {type === 'video' && (
        <div>
          <label className={lbl} style={lblStyle}>URL del video (YouTube, Vimeo, etc.)</label>
          <input name="video_url" type="url" defaultValue={initialValues?.video_url ?? ''}
            placeholder="https://youtube.com/watch?v=..." className={field} style={fieldStyle} />
        </div>
      )}

      {/* Image */}
      <div>
        <label className={lbl} style={lblStyle}>
          {type === 'video' ? 'Miniatura del video' : 'Imagen'}
        </label>
        {preview && (
          <div className="relative mb-3">
            <img src={preview} alt="preview" className="w-full rounded-xl object-cover" style={{ maxHeight: 220 }} />
            {!initialValues?.image_url && (
              <button type="button" onClick={() => setPreview('')}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.7)' }}>
                <X size={13} style={{ color: '#F6F3EB' }} />
              </button>
            )}
          </div>
        )}
        <label className="rounded-xl border-2 border-dashed p-5 flex flex-col items-center gap-2 cursor-pointer transition hover:border-[#76ABAE]"
          style={{ borderColor: '#0D3352' }}>
          <ImageIcon size={20} style={{ color: 'rgba(246,243,235,0.25)' }} />
          <span className="text-[12px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
            {preview ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </span>
          <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.25)' }}>JPG, PNG o WebP</span>
          <input type="file" name="image" accept="image/*" className="sr-only" onChange={handleFile} />
        </label>
      </div>

      {/* Pinned */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" name="pinned" defaultChecked={initialValues?.pinned ?? false}
          className="w-4 h-4 accent-white rounded" />
        <span className="text-[13px] font-medium" style={{ color: 'rgba(246,243,235,0.68)' }}>
          Fijar este contenido (aparece primero)
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
          style={{ background: '#F6F3EB', color: '#061E30' }}>
          {isPending ? 'Guardando…' : submitLabel}
        </button>
        <a href={backHref} className="px-5 py-3 rounded-xl text-sm font-medium text-center"
          style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.68)' }}>
          Cancelar
        </a>
      </div>
    </form>
  )
}
