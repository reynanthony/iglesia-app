'use client'

import { useState, useTransition } from 'react'
import { updatePageContent, uploadPageImage } from '@/app/actions/admin'
import { CheckCircle2, AlertCircle, Save, ImageIcon, X } from 'lucide-react'

type Field = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'url' | 'image'
  hint?: string
}

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
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  function handleChange(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }))
    setStatus('idle')
  }

  async function handleImageUpload(key: string, file: File) {
    setUploadingKey(key)
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadPageImage(formData)
    setUploadingKey(null)
    if (result.url) {
      setValues(prev => ({ ...prev, [key]: result.url! }))
      setStatus('idle')
    }
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
            style={{ color: 'rgba(246,243,235,0.40)' }}>
            {field.label}
          </label>

          {field.type === 'image' ? (
            <div className="space-y-2">
              {values[field.key] && (
                <div className="relative">
                  <img src={values[field.key]} alt=""
                    className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
                  <button
                    type="button"
                    onClick={() => handleChange(field.key, '')}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <X size={13} style={{ color: '#F6F3EB' }} />
                  </button>
                </div>
              )}
              <label className="rounded-xl border-2 border-dashed p-5 flex flex-col items-center gap-2 cursor-pointer transition hover:border-[#76ABAE]"
                style={{ borderColor: '#0D3352', opacity: uploadingKey === field.key ? 0.6 : 1 }}>
                <ImageIcon size={20} style={{ color: 'rgba(246,243,235,0.25)' }} />
                <span className="text-[12px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                  {uploadingKey === field.key ? 'Subiendo…' : values[field.key] ? 'Cambiar imagen' : 'Subir imagen'}
                </span>
                <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.25)' }}>JPG, PNG o WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploadingKey !== null}
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) handleImageUpload(field.key, f)
                  }}
                />
              </label>
            </div>
          ) : field.type === 'textarea' ? (
            <textarea
              value={values[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
              style={{ background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' }}
            />
          ) : (
            <input
              type={field.type === 'url' ? 'url' : 'text'}
              value={values[field.key] ?? ''}
              onChange={e => handleChange(field.key, e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' }}
            />
          )}

          {field.hint && (
            <p className="text-[11px] mt-1" style={{ color: 'rgba(246,243,235,0.25)' }}>{field.hint}</p>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending || uploadingKey !== null}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[12px] font-bold transition disabled:opacity-50"
          style={{ background: '#F6F3EB', color: '#061E30' }}
        >
          <Save size={13} />
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>

        {status === 'ok' && (
          <span className="flex items-center gap-1.5 text-[12px]" style={{ color: '#76ABAE' }}>
            <CheckCircle2 size={14} /> Guardado — los cambios ya son visibles en el sitio
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
