'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, X, Loader2 } from 'lucide-react'

export default function ImageUploader({
  name = 'image_url',
  defaultValue = '',
  bucket = 'posts',
}: {
  name?: string
  defaultValue?: string
  bucket?: string
}) {
  const [url, setUrl]         = useState(defaultValue)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const inputRef              = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    const supabase = createClient()
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `campanas/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type })

    if (uploadError) {
      setError('Error al subir imagen')
      setLoading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    setUrl(data.publicUrl)
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={url} />

      {/* URL manual */}
      <input
        type="url"
        placeholder="https://imagen.jpg  o  https://youtube.com/watch?v=..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm focus:outline-none rounded-xl"
        style={{ background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' }}
      />

      {/* Upload button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-bold transition disabled:opacity-50"
          style={{ background: '#0B2D47', border: '1px solid #0D3352', color: 'rgba(246,243,235,0.6)' }}
        >
          {loading
            ? <><Loader2 size={13} className="animate-spin" /> Subiendo…</>
            : <><ImagePlus size={13} /> Subir desde dispositivo</>
          }
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl('')}
            className="w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ background: '#0B2D47', border: '1px solid #0D3352', color: 'rgba(246,243,235,0.4)' }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/webm"
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="text-[11px]" style={{ color: '#F87171' }}>{error}</p>}

      {/* Preview */}
      {url && !url.includes('youtube.com') && !url.includes('youtu.be') && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden"
          style={{ background: '#0B2D47' }}>
          <img src={url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {url && (url.includes('youtube.com') || url.includes('youtu.be')) && (
        <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
          YouTube detectado — se usará el thumbnail como fondo
        </p>
      )}
    </div>
  )
}
