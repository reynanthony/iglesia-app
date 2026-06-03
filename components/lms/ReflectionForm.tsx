'use client'

import { useState, useTransition } from 'react'
import { BookHeart, Send, CheckCircle2 } from 'lucide-react'
import { saveReflection } from '@/app/actions/discipleship-lms'

type ReflectionData = {
  what_learned: string | null
  god_spoke: string | null
  must_change: string | null
  must_apply: string | null
  is_shared_with_mentor: boolean
} | null

const FIELDS: { key: keyof Omit<ReflectionData & object, 'is_shared_with_mentor'>; question: string; placeholder: string }[] = [
  {
    key: 'what_learned',
    question: '¿Qué aprendí en esta lección?',
    placeholder: 'Escribe los puntos principales que captaste...',
  },
  {
    key: 'god_spoke',
    question: '¿Qué me habló Dios a través de esto?',
    placeholder: 'Una verdad personal, una promesa, una convicción...',
  },
  {
    key: 'must_change',
    question: '¿Qué necesito cambiar en mi vida?',
    placeholder: 'Un hábito, actitud, pensamiento o relación...',
  },
  {
    key: 'must_apply',
    question: '¿Qué voy a aplicar esta semana?',
    placeholder: 'Un paso concreto y medible...',
  },
]

export function ReflectionForm({
  lessonId,
  initial,
  hasMentor,
}: {
  lessonId: string
  initial: ReflectionData
  hasMentor: boolean
}) {
  const [saved, setSaved] = useState(!!initial?.what_learned)
  const [isPending, startTransition] = useTransition()

  const action = saveReflection.bind(null, lessonId)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await action(formData)
      setSaved(true)
    })
  }

  return (
    <section>
      <p
        className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5"
        style={{ color: 'rgba(118,171,174,0.55)' }}
      >
        <BookHeart size={10} /> Diario de reflexión
      </p>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
        {/* Intro */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #0D3352' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(246,243,235,0.40)' }}>
            Reflexionar profundiza lo que aprendiste. Solo tú{hasMentor ? ' (y tu mentor si lo eliges)' : ''} verás esto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {FIELDS.map(({ key, question, placeholder }) => (
            <div key={key}>
              <label
                className="block text-xs font-black mb-2"
                style={{ color: 'rgba(246,243,235,0.60)' }}
              >
                {question}
              </label>
              <textarea
                name={key}
                defaultValue={(initial as any)?.[key] ?? ''}
                rows={3}
                placeholder={placeholder}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none placeholder:opacity-30 focus:border-[rgba(118,171,174,0.40)] transition"
                style={{
                  background: '#061E30',
                  border: '1px solid #0D3352',
                  color: '#F6F3EB',
                  lineHeight: 1.65,
                }}
              />
            </div>
          ))}

          {hasMentor && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_shared_with_mentor"
                defaultChecked={initial?.is_shared_with_mentor ?? false}
                style={{ accentColor: '#76ABAE', marginTop: 2, flexShrink: 0 }}
              />
              <span className="text-xs leading-relaxed" style={{ color: 'rgba(246,243,235,0.45)' }}>
                Compartir esta reflexión con mi mentor para que pueda guiarme mejor
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black transition"
            style={{
              background: saved && !isPending ? 'rgba(118,171,174,0.10)' : 'rgba(118,171,174,0.14)',
              border: `1px solid ${saved && !isPending ? 'rgba(118,171,174,0.35)' : 'rgba(118,171,174,0.22)'}`,
              color: saved && !isPending ? '#76ABAE' : 'rgba(246,243,235,0.75)',
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? (
              <><Send size={14} /> Guardando...</>
            ) : saved ? (
              <><CheckCircle2 size={14} /> Reflexión guardada</>
            ) : (
              <><Send size={14} /> Guardar reflexión</>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
