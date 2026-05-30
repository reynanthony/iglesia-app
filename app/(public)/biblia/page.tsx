import Link from 'next/link'
import { ArrowRight, BookOpen, Quote } from 'lucide-react'
import { cmsGet, cmsImageUrl, type DDevocional } from '@/lib/directus'
import { OT_BOOKS, NT_BOOKS, hasBibleApi } from '@/lib/bible'

export const revalidate = 3600

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}

export default async function BibliaPage() {
  const devocionales = await cmsGet<DDevocional>('devocionales', {
    'filter[status][_eq]': 'published',
    'sort': '-date_published,-date_created',
    'limit': '13',
  })

  const featured = devocionales[0] ?? null
  const rest     = devocionales.slice(1)
  const bibleOn  = hasBibleApi()

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
              Biblia · Devocionales y lectura
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <h1 className="font-display font-black tracking-tighter text-white"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
              La Palabra<br /><em style={{ color: TEAL }}>que transforma.</em>
            </h1>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-6" style={{ color: 'rgba(246,243,235,0.50)' }}>
                Devocionales escritos por nuestros líderes y acceso a la Biblia completa en Reina-Valera 1960.
              </p>
              {bibleOn && (
                <Link href="/biblia/lectura/JHN/1"
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl"
                  style={{ background: TEAL, color: NAVY }}>
                  <BookOpen size={12} /> Leer la Biblia
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ DEVOCIONAL DESTACADO ════════════════════════════ */}
      {featured && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <div className="flex items-center gap-4 mb-10">
              <Quote size={14} style={{ color: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: TEAL }}>Devocional destacado</p>
            </div>

            <Link href={`/biblia/devocional/${featured.id}`}
              className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border transition"
              style={{ borderColor: '#D2CDB8' }}>

              {cmsImageUrl(featured.image) ? (
                <div className="lg:col-span-5 overflow-hidden h-64 lg:h-auto min-h-[280px]">
                  <img src={cmsImageUrl(featured.image)!} alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
              ) : (
                <div className="lg:col-span-5 min-h-[280px] flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0D4A72 100%)` }}>
                  {featured.verse && (
                    <div className="p-8 text-center">
                      <Quote size={24} style={{ color: `${TEAL}60`, margin: '0 auto 12px' }} />
                      <p className="font-display font-black text-white leading-tight text-xl">"{featured.verse}"</p>
                      {featured.verse_ref && (
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-4" style={{ color: TEAL }}>
                          {featured.verse_ref}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="lg:col-span-7 p-10 lg:p-14 flex flex-col justify-center gap-6"
                style={{ background: '#EDEAE0' }}>
                <div>
                  {featured.verse_ref && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: TEAL }}>
                      {featured.verse_ref}
                    </p>
                  )}
                  <h2 className="font-display font-black tracking-tight leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: NAVY }}>
                    {featured.title}
                  </h2>
                  {featured.content && (
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: `${NAVY}65` }}>
                      {featured.content}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-wider" style={{ color: SAGE }}>
                    {featured.author} · {fmtDate(featured.date_published ?? featured.date_created)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl"
                    style={{ background: NAVY, color: CREAM }}>
                    Leer <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ══ GRILLA DE DEVOCIONALES ══════════════════════════ */}
      {rest.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: SAGE }}>— Más devocionales</p>
              <p className="text-[11px] font-bold" style={{ color: SAGE }}>{rest.length} reflexiones</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map(d => (
                <Link key={d.id} href={`/biblia/devocional/${d.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden transition"
                  style={{ border: '1px solid #D2CDB8', background: CREAM }}>
                  {cmsImageUrl(d.image) ? (
                    <div className="overflow-hidden" style={{ height: 160 }}>
                      <img src={cmsImageUrl(d.image)!} alt={d.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  ) : d.verse ? (
                    <div className="p-5 flex items-start gap-3" style={{ background: `${NAVY}08`, borderBottom: '1px solid #D2CDB8' }}>
                      <Quote size={16} style={{ color: `${TEAL}60`, flexShrink: 0, marginTop: 2 }} />
                      <p className="text-xs leading-relaxed line-clamp-3" style={{ color: `${NAVY}70` }}>"{d.verse}"</p>
                    </div>
                  ) : null}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    {d.verse_ref && (
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: TEAL }}>
                        {d.verse_ref}
                      </p>
                    )}
                    <h3 className="font-black text-lg tracking-tight leading-tight group-hover:opacity-70 transition" style={{ color: NAVY }}>
                      {d.title}
                    </h3>
                    {d.content && (
                      <p className="text-[12px] leading-relaxed line-clamp-3 flex-1" style={{ color: `${NAVY}60` }}>
                        {d.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid #D2CDB8' }}>
                      <p className="text-[10px]" style={{ color: SAGE }}>
                        {fmtDate(d.date_published ?? d.date_created)}
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: TEAL }}>
                        Leer <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ BIBLIA: SELECTOR DE LIBROS ══════════════════════ */}
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
            <div className="space-y-12">
              {/* Antiguo Testamento */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6" style={{ color: SAGE }}>— Antiguo Testamento</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {OT_BOOKS.map(book => (
                    <Link key={book.id} href={`/biblia/lectura/${book.id}/1`}
                      className="group px-3 py-2.5 rounded-lg text-center transition hover:opacity-80"
                      style={{ background: '#EDEAE0', border: '1px solid #D2CDB8' }}>
                      <p className="text-[11px] font-black leading-tight" style={{ color: NAVY }}>{book.name}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: SAGE }}>{book.chapters} cap.</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Nuevo Testamento */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6" style={{ color: SAGE }}>— Nuevo Testamento</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {NT_BOOKS.map(book => (
                    <Link key={book.id} href={`/biblia/lectura/${book.id}/1`}
                      className="group px-3 py-2.5 rounded-lg text-center transition hover:opacity-80"
                      style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}25` }}>
                      <p className="text-[11px] font-black leading-tight" style={{ color: NAVY }}>{book.name}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: SAGE }}>{book.chapters} cap.</p>
                    </Link>
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
