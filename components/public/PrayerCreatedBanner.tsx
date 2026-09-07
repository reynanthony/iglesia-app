'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, X } from 'lucide-react'

const TEAL = '#76ABAE'

// Confirmación visible tras publicar en el muro público — antes el submit
// redirigía en silencio y el usuario no tenía forma de saber que se envió.
export default function PrayerCreatedBanner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('creada') !== '1') return
    setVisible(true)
    router.replace('/oracion', { scroll: false })
    const id = setTimeout(() => setVisible(false), 6000)
    return () => clearTimeout(id)
  }, [searchParams, router])

  if (!visible) return null

  return (
    <div className="max-w-4xl mx-auto px-6 pt-6">
      <div className="flex items-center gap-3 rounded-2xl px-5 py-4 border border-edge"
        style={{ background: `${TEAL}12` }}>
        <CheckCircle2 size={18} style={{ color: TEAL, flexShrink: 0 }} />
        <p className="text-sm font-bold text-ink flex-1">
          ¡Oración publicada! Gracias por compartirla con la comunidad.
        </p>
        <button onClick={() => setVisible(false)} aria-label="Cerrar" className="p-1 rounded-lg hover:bg-black/5 transition">
          <X size={14} className="text-ink-3" />
        </button>
      </div>
    </div>
  )
}
