import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { hasBibleApi } from '@/lib/bible'
import BibleContinue from '@/components/public/BibleContinue'
import BibleSelector from '@/components/public/BibleSelector'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'

export default async function BibliaPage() {
  const bibleOn = hasBibleApi()

  return (
    <div>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '72vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 70% at 85% 30%, rgba(118,171,174,0.10), transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 select-none">
          <span className="font-black leading-none" style={{ fontSize: 'clamp(12rem, 26vw, 24rem)', opacity: 0.04, color: TEAL }}>
            BIB
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-16 md:pt-44 md:pb-20 flex flex-col justify-end"
          style={{ minHeight: '72vh' }}>
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
              La Palabra · NTV
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <h1 className="font-display font-black tracking-tighter text-white"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
              La Palabra<br /><em style={{ color: TEAL }}>que transforma.</em>
            </h1>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-6" style={{ color: 'rgba(246,243,235,0.76)' }}>
                Lee la Biblia completa en Nueva Traducción Viviente con marcadores, notas y lectura continua.
              </p>
              <div className="flex flex-wrap gap-3">
                {bibleOn && (
                  <Link href="/biblia/lectura/JHN/1"
                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl"
                    style={{ background: TEAL, color: NAVY }}>
                    <BookOpen size={12} /> Comenzar a leer
                  </Link>
                )}
                <Link href="/devocionales"
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition hover:opacity-80"
                  style={{ background: 'rgba(134,155,126,0.12)', color: '#869B7E', border: '1px solid rgba(134,155,126,0.30)' }}>
                  Devocionales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTINUAR LEYENDO + MARCADORES ═════════════════ */}
      <BibleContinue />

      {/* ══ SELECTOR DE LIBROS ══════════════════════════════ */}
      {bibleOn ? (
        <BibleSelector />
      ) : (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <div className="rounded-2xl p-10" style={{ background: '#EDEAE0', border: '1px solid #D2CDB8' }}>
              <BookOpen size={36} style={{ color: TEAL, margin: '0 auto 16px', opacity: 0.6 }} />
              <p className="font-black text-lg mb-2" style={{ color: NAVY }}>Lector bíblico próximamente</p>
              <p className="text-sm max-w-sm mx-auto" style={{ color: `${NAVY}CC` }}>
                Mientras tanto, te recomendamos{' '}
                <a href="https://www.bible.com/es" target="_blank" rel="noopener noreferrer"
                  className="font-bold underline" style={{ color: TEAL }}>YouVersion</a>{' '}
                o{' '}
                <a href="https://www.biblegateway.com/?search=Juan+3&version=NTV" target="_blank" rel="noopener noreferrer"
                  className="font-bold underline" style={{ color: TEAL }}>Bible Gateway</a>{' '}
                para leer en RVR1960.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-10" style={{ color: 'rgba(118,171,174,0.50)' }}>
                — También en la comunidad
              </p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.85 }}>
                La Palabra<br />es mejor<br /><em style={{ color: TEAL }}>en comunidad.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.82)' }}>
                Únete para compartir reflexiones, pedir oración y crecer en la fe con nuestra comunidad en línea.
              </p>
              <Link href="/registro"
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                Crear mi cuenta <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
