import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}

export default async function MensajesPage() {
  const supabase = await createClient()

  const { data: articulos } = await supabase
    .from('ministry_content')
    .select('id, title, body, image_url, type, pinned, created_at, profiles(full_name, avatar_url), ministries(name, slug)')
    .in('type', ['articulo', 'anuncio'])
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(24)

  const items   = articulos ?? []
  const featured = items[0] ?? null
  const rest    = items.slice(1)

  const ministerios = Array.from(
    new Set(items.map((i: any) => (i.ministries as any)?.name).filter(Boolean))
  ) as string[]

  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[72svh] md:min-h-[72vh]" style={{ background: '#051828' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 70% at 90% 40%, rgba(118,171,174,0.10), transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter"
            style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', opacity: 0.04, color: TEAL, lineHeight: 1 }}>
            FE
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-10 sm:pt-32 sm:pb-16 md:pt-44 md:pb-20 flex flex-col justify-end">
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
              Mensajes · Reflexiones y artículos
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <h1 className="font-display font-black tracking-tighter text-white leading-[0.9] md:leading-[0.85]"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
              Crece en<br /><em style={{ color: TEAL }}>la Palabra.</em>
            </h1>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-6" style={{ color: 'rgba(246,243,235,0.50)' }}>
                Artículos, reflexiones y enseñanzas de nuestros líderes para que puedas leer, meditar y crecer en tu fe desde donde estés.
              </p>
              {ministerios.length > 0 && (
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: `${TEAL}60` }}>
                  {items.length} artículo{items.length !== 1 ? 's' : ''} de {ministerios.length} ministerio{ministerios.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ARTÍCULO DESTACADO */}
      {featured && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 md:py-20">
            <div className="flex items-center gap-4 mb-10">
              <BookOpen size={14} style={{ color: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: TEAL }}>Artículo destacado</p>
            </div>

            <Link href={`/predicas/${featured.id}`} className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border transition"
              style={{ borderColor: '#D2CDB8' }}>
              {featured.image_url && (
                <div className="lg:col-span-5 overflow-hidden h-64 lg:h-auto min-h-[280px]">
                  <img src={featured.image_url} alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
              )}
              <div className={`${featured.image_url ? 'lg:col-span-7' : 'lg:col-span-12'} p-10 lg:p-14 flex flex-col justify-center gap-6`}
                style={{ background: '#EDEAE0' }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: TEAL }}>
                    {(featured.ministries as any)?.name ?? 'Mensaje'}
                  </p>
                  <h2 className="font-display font-black tracking-tight leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: NAVY }}>
                    {featured.title}
                  </h2>
                  {featured.body && (
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: `${NAVY}65` }}>
                      {featured.body}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-wider" style={{ color: SAGE }}>
                    {(featured.profiles as any)?.full_name} · {fmtDate(featured.created_at)}
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

      {/* GRILLA DE MENSAJES */}
      {rest.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 md:py-28">
            <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: SAGE }}>— Más artículos</p>
              <p className="text-[11px] font-bold" style={{ color: SAGE }}>{rest.length} mensajes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((item: any) => (
                <Link key={item.id} href={`/predicas/${item.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden transition"
                  style={{ border: '1px solid #D2CDB8', background: CREAM }}>
                  {item.image_url && (
                    <div className="overflow-hidden" style={{ height: 180 }}>
                      <img src={item.image_url} alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: TEAL }}>
                      {(item.ministries as any)?.name ?? 'Mensaje'}
                    </p>
                    <h3 className="font-black text-lg tracking-tight leading-tight group-hover:opacity-70 transition" style={{ color: NAVY }}>
                      {item.title}
                    </h3>
                    {item.body && (
                      <p className="text-[12px] leading-relaxed line-clamp-3 flex-1" style={{ color: `${NAVY}60` }}>
                        {item.body}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid #D2CDB8' }}>
                      <p className="text-[10px]" style={{ color: SAGE }}>{fmtDate(item.created_at)}</p>
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                        style={{ color: TEAL }}>
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

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <section style={{ background: CREAM }}>
          <div className="max-w-6xl mx-auto px-6 py-40 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}25` }}>
              <BookOpen size={36} style={{ color: TEAL }} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: SAGE }}>Próximamente</p>
            <h2 className="text-2xl font-black tracking-tight mb-3" style={{ color: NAVY }}>Los mensajes estarán aquí pronto</h2>
            <p className="text-sm max-w-sm mx-auto mb-8" style={{ color: `${NAVY}60` }}>
              Los líderes de nuestros ministerios están preparando artículos y reflexiones para edificarte.
            </p>
            <Link href="/ministerios"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl"
              style={{ background: NAVY, color: CREAM }}>
              Ver ministerios <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-10" style={{ color: 'rgba(118,171,174,0.50)' }}>
                — También en la comunidad
              </p>
              <h2 className="font-display font-black tracking-tighter text-white leading-[0.9] md:leading-[0.85]"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
                La Palabra<br />es mejor<br /><em style={{ color: TEAL }}>en comunidad.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Únete a la comunidad en línea para comentar, compartir y discutir los mensajes con otros creyentes.
              </p>
              <Link href="/registro"
                className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-5 sm:py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                Crear mi cuenta <ArrowRight size={12} />
              </Link>
              <Link href="/en-vivo"
                className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-5 sm:py-4 rounded-xl transition group"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.60)' }}>
                Ver prédicas en video <ArrowRight size={12} className="opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
