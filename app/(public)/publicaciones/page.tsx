import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Newspaper } from 'lucide-react'

export const revalidate = 60

const CAT_LABEL: Record<string, string> = {
  campana:          'Campaña',
  serie:            'Serie',
  'evento-especial': 'Evento',
  ministerio:       'Ministerio',
  anuncio:          'Anuncio',
  general:          'General',
}
const CAT_COLOR: Record<string, string> = {
  campana:          '#C9A227',
  serie:            '#A855F7',
  'evento-especial': '#76ABAE',
  ministerio:       '#4ADE80',
  anuncio:          '#F87171',
  general:          'rgba(246,243,235,0.50)',
}

export default async function PublicacionesPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('publicaciones')
    .select('id, slug, title, subtitle, excerpt, category, cover_image, cover_color, published_at')
    .eq('is_active', true)
    .order('published_at', { ascending: false })

  const [featured, ...rest] = items ?? []

  return (
    <div style={{ background: '#051828', color: '#F6F3EB', minHeight: '100vh' }}>

      {/* ── HERO HEADER ─────────────────────────────────────────── */}
      <section className="relative border-b" style={{ borderColor: 'rgba(246,243,235,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3"
                style={{ color: '#76ABAE' }}>
                El Manantial
              </p>
              <h1 className="font-display font-black leading-[0.9]"
                style={{ fontSize: 'clamp(48px, 8vw, 96px)', color: '#F6F3EB' }}>
                Publicaciones
              </h1>
              <p className="mt-3 text-sm md:text-base" style={{ color: 'rgba(246,243,235,0.45)' }}>
                Campañas, series y eventos especiales
              </p>
            </div>
            {/* Decorative rule */}
            <div className="hidden md:block flex-1 max-w-xs">
              <div className="h-px" style={{ background: 'linear-gradient(to right, rgba(118,171,174,0.4), transparent)' }} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">

        {(!items || items.length === 0) && (
          <div className="py-24 text-center">
            <Newspaper size={40} style={{ color: 'rgba(246,243,235,0.12)', margin: '0 auto 16px' }} />
            <p style={{ color: 'rgba(246,243,235,0.35)' }}>No hay publicaciones disponibles.</p>
          </div>
        )}

        {/* ── FEATURED ─────────────────────────────────────────── */}
        {featured && (
          <Link href={`/publicaciones/${featured.slug}`} className="group block mb-10 md:mb-16">
            <article className="relative overflow-hidden rounded-2xl md:rounded-3xl"
              style={{ minHeight: 420, background: featured.cover_color ?? '#093C5D' }}>
              {featured.cover_image && (
                <>
                  <img src={featured.cover_image} alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,24,40,0.92) 0%, rgba(5,24,40,0.45) 50%, rgba(5,24,40,0.15) 100%)' }} />
                </>
              )}
              {!featured.cover_image && (
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(246,243,235,0.04) 0%, transparent 100%)' }} />
              )}

              <div className="relative h-full flex flex-col justify-end p-6 md:p-10" style={{ minHeight: 420 }}>
                {/* Category + date */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full"
                    style={{
                      background: `${CAT_COLOR[featured.category] ?? '#76ABAE'}20`,
                      color: CAT_COLOR[featured.category] ?? '#76ABAE',
                      border: `1px solid ${CAT_COLOR[featured.category] ?? '#76ABAE'}40`,
                    }}>
                    {CAT_LABEL[featured.category] ?? featured.category}
                  </span>
                  <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.45)' }}>
                    {new Date(featured.published_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="font-display font-black leading-tight mb-3 transition-all group-hover:opacity-90"
                  style={{ fontSize: 'clamp(24px, 4vw, 52px)', color: '#F6F3EB', maxWidth: '80%' }}>
                  {featured.title}
                </h2>

                {featured.subtitle && (
                  <p className="mb-4 text-sm md:text-base italic" style={{ color: 'rgba(246,243,235,0.70)', maxWidth: 560 }}>
                    {featured.subtitle}
                  </p>
                )}

                {featured.excerpt && (
                  <p className="mb-5 text-sm" style={{ color: 'rgba(246,243,235,0.55)', maxWidth: 560 }}>
                    {featured.excerpt}
                  </p>
                )}

                <span className="inline-flex items-center gap-2 text-[13px] font-bold transition group-hover:gap-3"
                  style={{ color: '#76ABAE' }}>
                  Leer más <ArrowRight size={14} />
                </span>
              </div>
            </article>
          </Link>
        )}

        {/* ── GRID ─────────────────────────────────────────────── */}
        {rest.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: 'rgba(246,243,235,0.30)' }}>
                Más publicaciones
              </p>
              <div className="flex-1 h-px" style={{ background: 'rgba(246,243,235,0.08)' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {rest.map(item => {
                const cc = CAT_COLOR[item.category] ?? '#76ABAE'
                return (
                  <Link key={item.id} href={`/publicaciones/${item.slug}`}
                    className="group block rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
                    style={{ background: '#0B2D47', border: '1px solid rgba(246,243,235,0.07)' }}>

                    {/* Cover */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: item.cover_color ?? '#093C5D' }}>
                      {item.cover_image && (
                        <>
                          <img src={item.cover_image} alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0" style={{ background: 'rgba(5,24,40,0.25)' }} />
                        </>
                      )}
                      {!item.cover_image && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper size={24} style={{ color: 'rgba(246,243,235,0.15)' }} />
                        </div>
                      )}
                      {/* Category chip over image */}
                      <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-full"
                        style={{ background: `${cc}25`, color: cc, border: `1px solid ${cc}40`, backdropFilter: 'blur(8px)' }}>
                        {CAT_LABEL[item.category] ?? item.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <p className="text-[11px] mb-2" style={{ color: 'rgba(246,243,235,0.35)' }}>
                        {new Date(item.published_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <h3 className="font-bold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-[#76ABAE] transition-colors"
                        style={{ color: '#F6F3EB' }}>
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-[12px] line-clamp-2" style={{ color: 'rgba(246,243,235,0.45)' }}>
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
