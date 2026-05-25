'use client'

import { useRef, useState, useTransition } from 'react'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { sendContactMessage } from '@/app/actions/contact'

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await sendContactMessage(formData)
      setResult(res)
      if (res.success) formRef.current?.reset()
    })
  }

  const inputClass = "w-full border border-edge focus:border-ink bg-surface px-5 py-4 text-sm text-ink placeholder:text-ink-3 focus:outline-none rounded-xl transition"
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-ink-3 block mb-2.5"

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre" className={labelClass}>Nombre *</label>
          <input id="nombre" name="nombre" type="text" placeholder="Tu nombre" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="apellido" className={labelClass}>Apellido</label>
          <input id="apellido" name="apellido" type="text" placeholder="Tu apellido" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email *</label>
        <input id="email" name="email" type="email" placeholder="tu@email.com" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="asunto" className={labelClass}>Asunto</label>
        <select id="asunto" name="asunto" className={inputClass}>
          <option value="">Selecciona un asunto</option>
          <option value="Primera visita">Primera visita</option>
          <option value="Oración">Oración</option>
          <option value="Ministerios">Ministerios</option>
          <option value="Información general">Información general</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className={labelClass}>Mensaje *</label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={6}
          placeholder="¿En qué podemos ayudarte?"
          required
          className={`${inputClass} resize-none`}
        />
      </div>

      {result?.success && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/8 border border-green-500/20">
          <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-green-600 dark:text-green-400">
            ¡Mensaje enviado! Nos pondremos en contacto contigo pronto.
          </p>
        </div>
      )}

      {result?.error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{result.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-3 bg-[#000000] hover:bg-[#222222] disabled:opacity-60 text-white text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition"
      >
        {isPending ? 'Enviando…' : <>Enviar mensaje <ArrowRight size={13} /></>}
      </button>
    </form>
  )
}
