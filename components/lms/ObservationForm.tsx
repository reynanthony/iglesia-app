'use client'

import { useState, useTransition, useRef } from 'react'
import { Send } from 'lucide-react'
import { addMentorObservation } from '@/app/actions/discipleship-lms'

export function ObservationForm({ studentId }: { studentId: string }) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const action = addMentorObservation.bind(null, studentId)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await action(formData)
      formRef.current?.reset()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <textarea
        name="content"
        required
        rows={3}
        placeholder="Escribe tu observación, nota de seguimiento o ánimo para este discípulo..."
        className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none placeholder:opacity-30 transition"
        style={{
          background: '#061E30',
          border: '1px solid #0D3352',
          color: '#F6F3EB',
          lineHeight: 1.65,
        }}
      />
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition"
        style={{
          background: saved ? 'rgba(118,171,174,0.10)' : 'rgba(118,171,174,0.14)',
          border: `1px solid ${saved ? 'rgba(118,171,174,0.40)' : 'rgba(118,171,174,0.22)'}`,
          color: saved ? '#76ABAE' : 'rgba(246,243,235,0.75)',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        <Send size={13} />
        {isPending ? 'Guardando...' : saved ? 'Guardada ✓' : 'Guardar observación'}
      </button>
    </form>
  )
}
