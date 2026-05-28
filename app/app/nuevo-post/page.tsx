'use client'

import { useState, useRef } from 'react'
import { createPost } from '@/app/actions/posts'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ImageIcon, X } from 'lucide-react'
import Link from 'next/link'
import SocialEmbedCard from '@/components/SocialEmbedCard'
import { detectSocialEmbed } from '@/lib/social-embed'

const MAX_CHARS = 1500

export default function NuevoPostPage() {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const embedPreview = detectSocialEmbed(content)
  const charsLeft = MAX_CHARS - content.length
  const overLimit = charsLeft < 0

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
    if (overLimit) return
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
    <div className="flex flex-col" style={{ background: '#061E30', minHeight: '100dvh' }}>

      {/* Header fijo — no se mueve con el teclado */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: '#061E30', borderBottom: '1px solid #0D3352' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/app/feed"
            className="p-2.5 rounded-xl transition"
            style={{ color: '#76ABAE', background: '#0B2D47', border: '1px solid #0D3352' }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-black text-lg tracking-tight" style={{ color: '#F6F3EB' }}>
              Nueva publicación
            </h1>
            <p className="text-xs" style={{ color: 'rgba(118,171,174,0.55)' }}>Comparte con la comunidad</p>
          </div>
        </div>

        <button
          form="post-form"
          type="submit"
          disabled={loading || overLimit || !content.trim()}
          className="px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #093C5D, #76ABAE)', color: '#F6F3EB' }}
        >
          {loading ? 'Publicando…' : 'Publicar'}
        </button>
      </div>

      {/* Cuerpo scrollable — sube sobre el teclado */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <form id="post-form" onSubmit={handleSubmit} className="space-y-4">

          {/* Textarea */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
          >
            <textarea
              name="content"
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              disabled={loading}
              placeholder="¿Qué quieres compartir hoy? Un versículo, reflexión, testimonio… o pega un enlace de YouTube, Facebook o Instagram."
              className="w-full bg-transparent text-sm focus:outline-none resize-none px-5 pt-5 pb-3"
              style={{ color: '#F6F3EB' }}
            />

            {/* Preview imagen */}
            {preview && (
              <div className="relative mx-4 mb-4 rounded-xl overflow-hidden">
                <img src={preview} alt="" className="w-full object-cover max-h-64 rounded-xl" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full transition"
                  style={{ background: 'rgba(0,0,0,0.7)' }}
                >
                  <X size={15} style={{ color: '#F6F3EB' }} />
                </button>
              </div>
            )}

            {/* Toolbar inferior */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderTop: '1px solid #0D3352' }}
            >
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 text-sm transition"
                style={{ color: fileName ? '#F6F3EB' : '#4A7A8E' }}
              >
                <ImageIcon size={16} />
                <span className="text-xs">{fileName || 'Agregar foto'}</span>
              </button>

              {/* Contador de caracteres */}
              <span
                className="text-[11px] font-bold tabular-nums"
                style={{ color: overLimit ? '#F87171' : charsLeft < 150 ? '#76ABAE' : 'rgba(118,171,174,0.40)' }}
              >
                {content.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Preview embed social */}
          {embedPreview && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#4A7A8E' }}>
                Vista previa
              </p>
              <SocialEmbedCard embed={embedPreview} />
            </div>
          )}

          {/* Zona imagen (si no hay preview de imagen ni embed) */}
          {!preview && !embedPreview && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-2xl py-8 flex flex-col items-center gap-2 transition"
              style={{ border: '1px dashed #1A3D5C', color: '#1A3D5C' }}
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

          {/* Cancelar al final (accesible en mobile) */}
          <Link
            href="/app/feed"
            className="block text-center py-3 text-sm transition"
            style={{ color: 'rgba(118,171,174,0.50)' }}
          >
            Cancelar
          </Link>
        </form>
      </div>
    </div>
  )
}
