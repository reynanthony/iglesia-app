import Link from 'next/link'
import { ArrowLeft, Hammer } from 'lucide-react'
import { BG, MUTED, GOLD, INK } from '@/lib/gold-theme'

export function UnderConstruction({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 min-h-[85svh] md:min-h-[90vh]"
      style={{ background: BG }}
    >
      <Link href="/educacion"
        className="absolute top-24 md:top-28 left-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition"
        style={{ color: `${GOLD}60` }}>
        <ArrowLeft size={11} /> Educación
      </Link>

      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ background: `${GOLD}14`, border: `1px solid ${GOLD}30` }}>
        <Hammer size={24} style={{ color: GOLD }} strokeWidth={1.8} />
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.45em] mb-4" style={{ color: MUTED }}>
        {eyebrow}
      </p>
      <h1 className="font-display font-black tracking-tighter mb-5" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 0.95, color: INK }}>
        {title}
      </h1>
      <p className="text-base leading-relaxed max-w-sm" style={{ color: MUTED }}>
        Este espacio está en construcción. Vuelve pronto.
      </p>
    </section>
  )
}
