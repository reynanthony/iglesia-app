import Link from 'next/link'
import { ArrowRight, Quote, BookOpen } from 'lucide-react'
import { cmsGet, cmsImageUrl, type DDevocional } from '@/lib/directus'

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

export default async function DevoccionalesPage() {
  const devocionales = await cmsGet<DDevocional>('devocionales', {
    'filter[status][_eq]': 'published',
    'sort': '-date_published,-date_created',
    'limit': '25',
  })

  const featured = devocionales[0] ?? null
  const rest     = devocionales.slice(1)

  return (
    <div>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '60vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 60% 80% at 20% 60%, rgba(134,155,126,0.08), transparent 70%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 select-none">
          <span className="font-black leading-none" style={{ fontSize: 'clamp(10rem, 22vw, 20rem)', opacity: 0.035, color: SAGE }}>
            DEV
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-16 md:pt-40 md:pb-20 flex flex-col justify-end"
          style={{ minHeight: '60vh' }}>
          <div className="flex items-center gap-5 mb-12">
            <div className="w-12 h-px" style={{ background: SAGE }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${SAGE}80` }}>
              Reflexiones · Devocionales
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <h1 className="font-display font-black tracking-tighter text-white"
              style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)', lineHeight: 0.88 }}>
              Palabra<br />para hoy.
            </h1>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-6" style={{ color: 'rgba(246,243,235,0.50)' }}>
                Reflexiones escritas por nuestros líderes para nutrir tu vida espiritual cada día.
              </p>
              <Link href="/biblia"
                className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition hover:opacity-80"
                style={{ background: 'rgba(118,171,174,0.12)', color: TEAL, border: `1px solid ${TEAL}30` }}>
                <BookOpen size={12} /> Leer la Biblia
              </Link>
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
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: TEAL }}>Destacado</p>
            </div>

            <Link href={`/biblia/devocional/${featured.id}`}
              className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border transition"
              style={{ borderColor: '#D2CDB8' }}>

              {cmsImageUrl(featured.image) ? (
                <div className="lg:col-span-5 overflow-hidden h-64 lg:h-auto" style={{ minHeight: 280 }}>
                  <img src={cmsImageUrl(featured.image)!} alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
              ) : (
                <div className="lg:col-span-5 flex items-center justify-center" style={{ minHeight: 280, background: `linear-gradient(135deg, ${NAVY} 0%, #0D4A72 100%)` }}>
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
                    {featured.author && `${featured.author} · `}{fmtDate(featured.date_published ?? featured.date_created)}
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

      {/* ══ GRILLA ══════════════════════════════════════════ */}
      {rest.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: SAGE }}>— Más reflexiones</p>
              <p className="text-[11px] font-bold" style={{ color: SAGE }}>{rest.length} devocionales</p>
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

      {devocionales.length === 0 && (
        <section style={{ background: CREAM }}>
          <div className="max-w-6xl mx-auto px-6 py-32 text-center">
            <Quote size={36} style={{ color: `${TEAL}40`, margin: '0 auto 16px' }} />
            <p className="font-black text-xl mb-2" style={{ color: NAVY }}>Próximamente</p>
            <p className="text-sm max-w-sm mx-auto" style={{ color: `${NAVY}60` }}>
              Estamos preparando reflexiones para tu crecimiento espiritual.
            </p>
          </div>
        </section>
      )}

    </div>
  )
}
