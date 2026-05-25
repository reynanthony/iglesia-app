'use client'

import { useState } from 'react'
import { createRoom } from '@/app/actions/rooms'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevaSalaPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await createRoom(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/app/oracion" className="p-2 hover:bg-slate-800 rounded-xl transition">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold">Nueva sala de oración</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Nombre de la sala</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Ej: Oración de intercesión"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#000000] transition placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Descripción <span className="text-slate-500">(opcional)</span></label>
            <textarea
              name="description"
              rows={3}
              placeholder="¿De qué se trata esta sesión de oración?"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#000000] transition placeholder:text-slate-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <Link href="/app/oracion" className="px-5 py-2.5 border border-slate-700 hover:border-slate-500 rounded-xl text-sm transition">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#000000] hover:bg-[#222222] disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm transition"
            >
              {loading ? 'Creando...' : 'Crear sala'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}