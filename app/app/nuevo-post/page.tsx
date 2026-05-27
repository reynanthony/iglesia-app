'use client'

import { useState, useRef } from 'react'
import { createPost } from '@/app/actions/posts'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ImageIcon, X } from 'lucide-react'
import Link from 'next/link'
import SocialEmbedCard from '@/components/SocialEmbedCard'
import { detectSocialEmbed } from '@/lib/social-embed'

export default function NuevoPostPage() {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const embedPreview = detectSocialEmbed(content)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setPreview(null)
    setFileName('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const formData = new FormData(e.currentTarget)
      const result = await createPost(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/app/feed')
      }
    } catch {
      setError('Error al publicar. Verifica tu conexión e intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/app/feed"
            className="p-2 rounded-xl transition"
            style={{ color: '#4D4D4D', background: '#111111', border: '1px solid #1A1A1A' }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-black text-lg tracking-tight" style={{ color: '#F5F5F5' }}>
              Nueva publicación
            </h1>
            <p className="text-xs" style={{ color: '#4D4D4D' }}>Comparte con la comunidad</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Textarea */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#111111', border: '1px solid #1A1A1A' }}
          >
            <textarea
              name="content"
              rows={5}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="¿Qué quieres compartir hoy? Un versículo, reflexión, testimonio… o pega un enlace de YouTube, Facebook o Instagram."
              className="w-full bg-transparent text-sm focus:outline-none resize-none px-5 pt-5 pb-3"
              style={{ color: '#F5F5F5' }}
            />

            {/* Preview imagen dentro del card */}
            {preview && (
              <div className="relative mx-4 mb-4 rounded-xl overflow-hidden">
                <img src={preview} alt="" className="w-full object-cover max-h-64 rounded-xl" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full transition"
                  style={{ background: 'rgba(0,0,0,0.7)' }}
                >
                  <X size={15} style={{ color: '#F5F5F5' }} />
                </button>
              </div>
            )}

            {/* Toolbar */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderTop: '1px solid #1A1A1A' }}
            >
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-sm transition"
                style={{ color: fileName ? '#F5F5F5' : '#4D4D4D' }}
              >
                <ImageIcon size={16} />
                <span className="text-xs">{fileName || 'Agregar foto'}</span>
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href="/app/feed"
                  className="px-4 py-2 rounded-xl text-xs font-bold transition"
                  style={{ color: '#4D4D4D' }}
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition disabled:opacity-40"
                  style={{ background: '#F5F5F5', color: '#0A0A0A' }}
                >
                  {loading ? 'Publicando…' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>

          {/* Preview del embed social (cuando se detecta URL en el contenido) */}
          {embedPreview && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4D4D4D' }}>
                Vista previa
              </p>
              <SocialEmbedCard embed={embedPreview} />
            </div>
          )}

          {/* Zona imagen (si no hay preview de imagen y no hay embed) */}
          {!preview && !embedPreview && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-2xl py-8 flex flex-col items-center gap-2 transition"
              style={{
                border: '1px dashed #2A2A2A',
                color: '#2A2A2A',
              }}
            >
              <ImageIcon size={22} />
              <span className="text-xs">JPG, PNG, WEBP · max 10 MB</span>
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
            <p
              className="text-sm px-4 py-3 rounded-xl"
              style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
