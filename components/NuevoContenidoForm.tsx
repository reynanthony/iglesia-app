'use client'

import { useState, useRef } from 'react'
import { createMinistryContent } from '@/app/actions/ministries'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ImageIcon, X, FileText, Video, Megaphone, Upload, Loader2 } from 'lucide-react'
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
  const [videoUrl, setVideoUrl] = useState('')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadVideoError, setUploadVideoError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const videoFileRef = useRef<HTMLInputElement>(null)

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
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

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploadingVideo(true)
    setUploadVideoError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')
      const ext = file.name.split('.').pop() ?? 'mp4'
      const path = `${user.id}/video_${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('posts').upload(path, file, { upsert: true })
      if (uploadErr) throw uploadErr
      const { data } = supabase.storage.from('posts').getPublicUrl(path)
      setVideoUrl(data.publicUrl)
    } catch {
      setUploadVideoError('Error al subir el video. Intenta de nuevo.')
    } finally {
      setUploadingVideo(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    // Override video_url with the state value (handles both typed URL and uploaded URL)
    formData.set('video_url', videoUrl)
    const result = await createMinistryContent(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/ministerios/' + ministry.slug)
    }
  }

  const types = [
    { value: 'articulo', label: 'Artículo', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'anuncio', label: 'Anuncio', icon: Megaphone },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={'/ministerios/' + ministry.slug}
          className="p-2.5 rounded-xl transition"
          style={{ color: 'rgba(246,243,235,0.60)' }}
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs" style={{ color: 'rgba(246,243,235,0.40)' }}>{ministry.name}</p>
          <h1 className="text-xl font-bold" style={{ color: '#F6F3EB' }}>Nuevo contenido</h1>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
        <form onSubmit={handleSubmit} className="space-y-5">

          <input type="hidden" name="ministry_id" value={ministry.id} />

          {/* Tipo */}
          <div>
            <label className="text-sm block mb-2" style={{ color: 'rgba(246,243,235,0.70)' }}>Tipo de contenido</label>
            <div className="flex gap-2 flex-wrap">
              {types.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
                  style={
                    type === value
                      ? { background: 'linear-gradient(135deg, #093C5D, #76ABAE)', color: '#F6F3EB' }
                      : { background: '#0D3352', color: 'rgba(246,243,235,0.50)' }
                  }
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
            <input type="hidden" name="type" value={type} />
          </div>

          {/* Titulo */}
          <div>
            <label className="text-sm block mb-1.5" style={{ color: 'rgba(246,243,235,0.70)' }}>Título</label>
            <input
              name="title"
              required
              placeholder="Título del contenido..."
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
              style={{ background: '#061E30', border: '1px solid #0D3352', color: '#F6F3EB' }}
            />
          </div>

          {/* Cuerpo */}
          <div>
            <label className="text-sm block mb-1.5" style={{ color: 'rgba(246,243,235,0.70)' }}>Descripción o contenido</label>
            <textarea
              name="body"
              rows={5}
              placeholder="Escribe el contenido aquí..."
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none"
              style={{ background: '#061E30', border: '1px solid #0D3352', color: '#F6F3EB' }}
            />
          </div>

          {/* Video — URL o upload de archivo */}
          {type === 'video' && (
            <div className="space-y-3">
              <label className="text-sm block" style={{ color: 'rgba(246,243,235,0.70)' }}>
                Video — YouTube, Instagram, TikTok, Facebook o archivo propio
              </label>

              {/* URL input */}
              <input
                name="video_url_display"
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... o https://www.tiktok.com/@..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                style={{ background: '#061E30', border: '1px solid #0D3352', color: '#F6F3EB' }}
              />

              {/* Upload video button */}
              <div>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/avi"
                  className="hidden"
                  ref={videoFileRef}
                  onChange={handleVideoUpload}
                />
                <button
                  type="button"
                  onClick={() => videoFileRef.current?.click()}
                  disabled={uploadingVideo}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition disabled:opacity-50"
                  style={{ background: '#061E30', border: '1px dashed #0D3352', color: 'rgba(246,243,235,0.50)' }}
                >
                  {uploadingVideo ? (
                    <><Loader2 size={14} className="animate-spin" /> Subiendo video…</>
                  ) : (
                    <><Upload size={14} /> O subir video desde tu equipo</>
                  )}
                </button>
                {uploadVideoError && (
                  <p className="mt-1 text-xs" style={{ color: '#F87171' }}>{uploadVideoError}</p>
                )}
                {videoUrl && videoUrl.startsWith('https://') && !videoUrl.includes('youtube') && !videoUrl.includes('tiktok') && !videoUrl.includes('instagram') && !videoUrl.includes('facebook') && (
                  <p className="mt-1 text-xs" style={{ color: '#76ABAE' }}>
                    ✓ Video subido correctamente
                  </p>
                )}
              </div>
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
              className="w-full rounded-xl py-5 flex items-center justify-center gap-2 text-sm transition"
              style={{ border: '1px dashed #0D3352', color: 'rgba(246,243,235,0.35)' }}
            >
              <ImageIcon size={18} /> Agregar imagen (opcional)
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageFile}
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
              className="px-5 py-2.5 rounded-xl text-sm transition"
              style={{ border: '1px solid #0D3352', color: 'rgba(246,243,235,0.60)' }}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || uploadingVideo}
              className="px-5 py-2.5 font-semibold rounded-xl text-sm transition disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #093C5D, #76ABAE)', color: '#F6F3EB' }}
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
