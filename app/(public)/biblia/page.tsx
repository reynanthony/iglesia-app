import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { OT_BOOKS, NT_BOOKS, hasBibleApi } from '@/lib/bible'
import BibleContinue from '@/components/public/BibleContinue'

const OT_CATS = [
  { label: 'Pentateuco',        books: OT_BOOKS.slice(0, 5)  },
  { label: 'Libros históricos', books: OT_BOOKS.slice(5, 17) },
  { label: 'Poética',           books: OT_BOOKS.slice(17, 22)},
  { label: 'Profetas mayores',  books: OT_BOOKS.slice(22, 27)},
  { label: 'Profetas menores',  books: OT_BOOKS.slice(27)    },
]
const NT_CATS = [
  { label: 'Evangelios',            books: NT_BOOKS.slice(0, 4)  },
  { label: 'Historia apostólica',   books: NT_BOOKS.slice(4, 5)  },
  { label: 'Epístolas de Pablo',    books: NT_BOOKS.slice(5, 18) },
  { label: 'Epístolas generales',   books: NT_BOOKS.slice(18, 26)},
  { label: 'Profecía',              books: NT_BOOKS.slice(26)    },
]

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

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
              La Palabra · Reina-Valera 1960
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <h1 className="font-display font-black tracking-tighter text-white"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
              La Palabra<br /><em style={{ color: TEAL }}>que transforma.</em>
            </h1>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-6" style={{ color: 'rgba(246,243,235,0.50)' }}>
                Lee la Biblia completa en Reina-Valera 1960 con marcadores, notas y lectura continua.
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
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-5 mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <BookOpen size={16} style={{ color: NAVY }} />
            <h2 className="font-display font-black tracking-tighter" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: NAVY }}>
              Leer la Biblia
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] px-2.5 py-1 rounded-full ml-2"
              style={{ background: `${TEAL}18`, color: TEAL }}>
              RVR1960
            </span>
          </div>

          {bibleOn ? (
            <div className="space-y-16">

              {/* ── Antiguo Testamento ── */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.40em] mb-10"
                  style={{ color: SAGE }}>— Antiguo Testamento</p>
                <div className="space-y-8">
                  {OT_CATS.map(cat => (
                    <div key={cat.label}>
                      <p className="text-[9px] font-bold uppercase tracking-[0.38em] mb-3"
                        style={{ color: `${TEAL}80` }}>{cat.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.books.map(book => (
                          <Link key={book.id} href={`/biblia/lectura/${book.id}/1`}
                            className="flex flex-col items-center justify-center px-3.5 py-3 rounded-xl transition-all duration-150 bg-[#EDEAE0] border border-[#D2CDB8] hover:bg-[#E3DDD2] hover:border-[#76ABAE]"
                            style={{ minWidth: 76, minHeight: 52 }}>
                            <span className="text-[12px] font-black leading-tight text-center"
                              style={{ color: NAVY }}>{book.name}</span>
                            <span className="text-[9px] mt-0.5"
                              style={{ color: SAGE }}>{book.chapters} cap.</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Nuevo Testamento ── */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.40em] mb-10"
                  style={{ color: SAGE }}>— Nuevo Testamento</p>
                <div className="space-y-8">
                  {NT_CATS.map(cat => (
                    <div key={cat.label}>
                      <p className="text-[9px] font-bold uppercase tracking-[0.38em] mb-3"
                        style={{ color: `${TEAL}80` }}>{cat.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.books.map(book => (
                          <Link key={book.id} href={`/biblia/lectura/${book.id}/1`}
                            className="flex flex-col items-center justify-center px-3.5 py-3 rounded-xl transition-all duration-150 border hover:bg-[#EAF2F2] hover:border-[#76ABAE]"
                            style={{
                              background: `${TEAL}10`, border: `1px solid ${TEAL}28`,
                              minWidth: 76, minHeight: 52,
                            }}>
                            <span className="text-[12px] font-black leading-tight text-center"
                              style={{ color: NAVY }}>{book.name}</span>
                            <span className="text-[9px] mt-0.5"
                              style={{ color: SAGE }}>{book.chapters} cap.</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl p-10 text-center" style={{ background: '#EDEAE0', border: '1px solid #D2CDB8' }}>
              <BookOpen size={36} style={{ color: TEAL, margin: '0 auto 16px', opacity: 0.6 }} />
              <p className="font-black text-lg mb-2" style={{ color: NAVY }}>Lector bíblico próximamente</p>
              <p className="text-sm max-w-sm mx-auto" style={{ color: `${NAVY}60` }}>
                Mientras tanto, te recomendamos{' '}
                <a href="https://www.bible.com/es" target="_blank" rel="noopener noreferrer"
                  className="font-bold underline" style={{ color: TEAL }}>
                  YouVersion
                </a>{' '}
                o{' '}
                <a href="https://www.biblegateway.com/?search=Juan+3&version=RVR1960" target="_blank" rel="noopener noreferrer"
                  className="font-bold underline" style={{ color: TEAL }}>
                  Bible Gateway
                </a>{' '}
                para leer en RVR1960.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
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
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.55)' }}>
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
