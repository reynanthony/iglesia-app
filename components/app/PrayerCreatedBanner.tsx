'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, X } from 'lucide-react'
import { hapticSuccess } from '@/lib/haptics'

// Confirmación visible tras publicar una petición — antes el submit
// redirigía en silencio y el usuario no tenía forma de saber que se envió.
export default function PrayerCreatedBanner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('creada') !== '1') return
    setVisible(true)
    hapticSuccess()
    router.replace('/app/oracion', { scroll: false })
    const id = setTimeout(() => setVisible(false), 6000)
    return () => clearTimeout(id)
  }, [searchParams, router])

  if (!visible) return null

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4">
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
        style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.30)' }}>
        <CheckCircle2 size={18} style={{ color: '#4ADE80', flexShrink: 0 }} />
        <p className="text-sm font-bold flex-1" style={{ color: '#F6F3EB' }}>
          ¡Petición publicada! La comunidad orará contigo.
        </p>
        <button onClick={() => setVisible(false)} aria-label="Cerrar" className="p-1 rounded-lg hover:bg-white/10 transition">
          <X size={14} style={{ color: 'rgba(246,243,235,0.60)' }} />
        </button>
      </div>
    </div>
  )
}
