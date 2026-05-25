'use client'

import { useState, useRef } from 'react'
import { createMinistryContent } from '@/app/actions/ministries'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ImageIcon, X, FileText, Video, Megaphone } from 'lucide-react'
import Link from 'next/link'

type Ministry = {
  id: string
  name: string
  slug: string
}

export default function NuevoContenidoForm({ ministry }: { ministry: Ministry }) {
  const router = useRouter()
  const [type, setType] = useState('articulo')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await createMinistryContent(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/ministerios/' + ministry.slug)
    }
  }

  const types = [
    { value: 'articulo', label: 'Articulo', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'anuncio', label: 'Anuncio', icon: Megaphone },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={'/ministerios/' + ministry.slug}
          className="p-2 hover:bg-slate-800 rounded-xl transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-slate-500 text-xs">{ministry.name}</p>
          <h1 className="text-xl font-bold">Nuevo contenido</h1>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          <input type="hidden" name="ministry_id" value={ministry.id} />

          {/* Tipo */}
          <div>
            <label className="text-slate-300 text-sm block mb-2">Tipo de contenido</label>
            <div className="flex gap-2 flex-wrap">
              {types.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ' + (
                    type === value
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  )}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
            <input type="hidden" name="type" value={type} />
          </div>

          {/* Titulo */}
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Titulo</label>
            <input
              name="title"
              required
              placeholder="Titulo del contenido..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500"
            />
          </div>

          {/* Cuerpo */}
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Descripcion o contenido</label>
            <textarea
              name="body"
              rows={5}
              placeholder="Escribe el contenido aqui..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* URL de video — solo si tipo es video */}
          {type === 'video' && (
            <div>
              <label className="text-slate-300 text-sm block mb-1.5">URL del video (YouTube)</label>
              <input
                name="video_url"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500"
              />
            </div>
          )}

          {/* Imagen */}
          {preview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} alt="" className="w-full object-cover max-h-60 rounded-xl" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl py-5 flex items-center justify-center gap-2 text-slate-500 hover:text-amber-500 transition text-sm"
            >
              <ImageIcon size={18} /> Agregar imagen (opcional)
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <Link
              href={'/ministerios/' + ministry.slug}
              className="px-5 py-2.5 border border-slate-700 hover:border-slate-500 rounded-xl text-sm transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm transition"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}