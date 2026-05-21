'use client'

import { useState } from 'react'
import { createPost } from '@/app/actions/posts'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoPostPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        <h1 className="text-xl font-bold">Nueva publicación</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm block mb-2">¿Qué quieres compartir?</label>
            <textarea
              name="content"
              required
              rows={5}
              placeholder="Comparte una reflexión, versículo, testimonio..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end">
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
        </form>
      </div>
    </div>
  )
}