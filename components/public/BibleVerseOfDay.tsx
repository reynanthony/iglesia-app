import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { hasBibleApi, getVerseOfDayText } from '@/lib/bible-content'
import { pickVerseOfDay } from '@/lib/bible-verse-of-day'
import { CARD, GOLD, INK } from '@/lib/gold-theme'

const NAVY = CARD
const TEAL = GOLD

// Visible para todo visitante desde el primer segundo — a diferencia de
// "Continuar leyendo", que solo aparece cuando ya hay historial guardado.
export default async function BibleVerseOfDay() {
  if (!hasBibleApi()) return null

  const ref = pickVerseOfDay()
  const text = await getVerseOfDayText(ref.bookId, ref.chapter, ref.verse)
  if (!text) return null

  return (
    <section style={{ background: '#F0EDE3', borderBottom: '1px solid #D2CDB8' }}>
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <Link
          href={`/biblia/lectura/${ref.bookId}/${ref.chapter}?verse=${ref.verse}`}
          className="group grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10 rounded-3xl px-7 py-8 md:px-10 md:py-10 transition-all hover:-translate-y-0.5"
          style={{ background: NAVY, border: `1px solid ${TEAL}30` }}
        >
          <div className="flex items-center gap-2.5 md:flex-col md:items-start md:gap-3">
            <Sparkles size={14} style={{ color: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: TEAL }}>
              Verso del día
            </p>
          </div>

          <div className="min-w-0">
            <p
              className="font-display italic leading-snug"
              style={{ fontSize: 'clamp(1.15rem, 2.6vw, 1.65rem)', color: INK }}
            >
              &ldquo;{text}&rdquo;
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mt-3" style={{ color: `${TEAL}99` }}>
              {ref.label} · {ref.theme}
            </p>
          </div>

          <div
            className="hidden md:flex w-11 h-11 rounded-full items-center justify-center flex-shrink-0 transition-transform group-hover:translate-x-1"
            style={{ background: `${TEAL}18`, border: `1px solid ${TEAL}40` }}
          >
            <ArrowRight size={16} style={{ color: TEAL }} />
          </div>
        </Link>
      </div>
    </section>
  )
}
