'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const P = {
  sage: '#869B7E', teal: '#76ABAE',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.45)',
  surface: '#0D1A0E', border: 'rgba(134,155,126,0.15)',
}

const CATEGORIES = [
  { value: 'doctrinal',   label: 'Doctrinal' },
  { value: 'consejo',     label: 'Consejo espiritual' },
  { value: 'orientacion', label: 'Orientación' },
  { value: 'general',     label: 'General' },
]

export default function PastoralQuestionForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [question, setQuestion]   = useState('')
  const [category, setCategory]   = useState('general')
  const [loading, setLoading]     = useState(false)
  const [sent, setSent]           = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || loading) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('pastoral_questions').insert({
      user_id: userId, question: question.trim(), category,
    })
    setLoading(false)
    setSent(true)
    setQuestion('')
    router.refresh()
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <p className="font-black text-[15px] mb-1" style={{ color: P.cream }}>¡Pregunta enviada!</p>
        <p className="text-[13px]" style={{ color: P.muted }}>
          El pastor responderá pronto. Recibirás una notificación.
        </p>
        <button onClick={() => setSent(false)} className="mt-4 text-[12px] font-bold"
          style={{ color: P.sage }}>
          Enviar otra pregunta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.3em] block mb-2"
          style={{ color: 'rgba(246,243,235,0.35)' }}>Categoría</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c.value} type="button"
              onClick={() => setCategory(c.value)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition"
              style={{
                background: category === c.value ? 'rgba(134,155,126,0.20)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${category === c.value ? P.sage : 'rgba(255,255,255,0.06)'}`,
                color: category === c.value ? P.sage : P.muted,
              }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.3em] block mb-2"
          style={{ color: 'rgba(246,243,235,0.35)' }}>Tu pregunta</label>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={4}
          placeholder="Escribe tu pregunta con claridad. El pastor responderá personalmente."
          className="w-full px-4 py-3 rounded-xl text-[13px] border resize-none focus:outline-none transition leading-relaxed"
          style={{
            background: '#060E07', borderColor: P.border,
            color: P.cream,
          }}
          maxLength={500}
          required
        />
        <p className="text-[11px] mt-1 text-right" style={{ color: 'rgba(246,243,235,0.20)' }}>
          {question.length}/500
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !question.trim()}
        className="w-full py-3.5 rounded-xl text-[13px] font-black uppercase tracking-[0.15em] transition disabled:opacity-40"
        style={{ background: P.sage, color: '#060E07' }}
      >
        {loading ? 'Enviando...' : 'Enviar pregunta'}
      </button>
    </form>
  )
}
