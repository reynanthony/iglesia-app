'use client'

import { useState, useTransition } from 'react'
import { updatePageContent } from '@/app/actions/admin'
import { CheckCircle2, AlertCircle, Save } from 'lucide-react'

type Field = { key: string; label: string; type: 'text' | 'textarea' | 'url'; hint?: string }

export default function PageEditor({
  page,
  fields,
  initialContent,
}: {
  page: string
  fields: Field[]
  initialContent: Record<string, string>
}) {
  const [values, setValues] = useState<Record<string, string>>(initialContent)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }))
    setStatus('idle')
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updatePageContent(page, values)
      setStatus(result.error ? 'error' : 'ok')
    })
  }

  return (
    <div className="max-w-2xl space-y-5">
      {fields.map(field => (
        <div key={field.key}>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2"
            style={{ color: '#8A8A8A' }}>
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              value={values[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
              style={{ background: '#161616', border: '1px solid #2A2A2A', color: '#F5F5F5' }}
            />
          ) : (
            <input
              type={field.type === 'url' ? 'url' : 'text'}
              value={values[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ background: '#161616', border: '1px solid #2A2A2A', color: '#F5F5F5' }}
            />
          )}
          {field.hint && (
            <p className="text-[11px] mt-1" style={{ color: '#3A3A3A' }}>{field.hint}</p>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[12px] font-bold transition disabled:opacity-50"
          style={{ background: '#F5F5F5', color: '#0A0A0A' }}
        >
          <Save size={13} />
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>

        {status === 'ok' && (
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: '#6BCB6B' }}>
            <CheckCircle2 size={14} /> Guardado
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-1.5 text-[12px] text-red-400">
            <AlertCircle size={14} /> Error al guardar
          </span>
        )}
      </div>
    </div>
  )
}
