'use client'

import { useState, useRef } from 'react'
import { createPost } from '@/app/actions/posts'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ImageIcon, X } from 'lucide-react'
import Link from 'next/link'

export default function NuevoPostPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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
    const formData = new FormData(e.currentTarget)
    const result = await createPost(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/app/feed')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/app/feed" className="p-2 hover:bg-slate-800 rounded-xl transition">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold">Nueva publicacion</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-slate-300 text-sm block mb-2">
              Que quieres compartir?
            </label>
            <textarea
              name="content"
              rows={4}
              placeholder="Comparte una reflexion, versiculo, testimonio..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Preview imagen */}
          {preview && (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} alt="" className="w-full object-cover max-h-80 rounded-xl" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          )}

          {/* Botón imagen */}
          {!preview && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl py-6 flex flex-col items-center gap-2 text-slate-500 hover:text-amber-500 transition"
            >
              <ImageIcon size={24} />
              <span className="text-sm">Agregar imagen</span>
              <span className="text-xs">JPG, PNG, WEBP hasta 10MB</span>
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

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition"
            >
              <ImageIcon size={16} />
              {fileName ? fileName : 'Foto'}
            </button>

            <div className="flex gap-3">
              <Link
                href="/app/feed"
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
          </div>
        </form>
      </div>
    </div>
  )
}