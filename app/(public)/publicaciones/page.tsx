import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Newspaper } from 'lucide-react'
import { cmsSingleton, cmsImageUrl, type DPublicacionesPage } from '@/lib/directus'
import { HeroVideo } from '@/components/public/HeroVideo'

export const revalidate = 60

const DARK  = '#051828'
const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'

const CAT_LABEL: Record<string, string> = {
  campana:           'Campaña',
  serie:             'Serie',
  'evento-especial': 'Evento',
  ministerio:        'Ministerio',
  anuncio:           'Anuncio',
  general:           'General',
}
const CAT_COLOR: Record<string, string> = {
  campana:           '#C9A227',
  serie:             '#A855F7',
  'evento-especial': '#76ABAE',
  ministerio:        '#4ADE80',
  anuncio:           '#F87171',
  general:           '#869B7E',
}

export default async function PublicacionesPage() {
  const supabase = await createClient()
  const [{ data: items }, cms] = await Promise.all([
    supabase
      .from('publicaciones')
      .select('id, slug, title, subtitle, excerpt, category, cover_image, cover_color, published_at')
      .eq('is_active', true)
      .order('published_at', { ascending: false }),
    cmsSingleton<DPublicacionesPage>('publicaciones_page'),
  ])
  const c = cms ?? {} as DPublicacionesPage

  const heroEyebrow        = c.hero_eyebrow  ?? 'El Manantial · Publicaciones'
  const heroTitle          = c.hero_title    ?? 'Campañas *y series.'
  const heroSubtitle       = c.hero_subtitle ?? 'Campañas, series y eventos especiales de la iglesia.'
  const heroImageUrl       = c.hero_image_url || cmsImageUrl(c.hero_image)
  const heroVideoUrl       = c.hero_video_url || cmsImageUrl(c.hero_video) || null
  const heroOverlayOpacity = c.hero_overlay_opacity ?? 0.60
  const heroShowGrid       = c.hero_show_grid !== false
  const heroBg             = c.hero_bg_color ?? DARK
  const heroWatermark      = c.hero_watermark ?? 'PUB'

  const [featured, ...rest] = items ?? []

  return (
    <div>

      {/* ── Hero oscuro ─────────────────────────────────── */}
      <section className="relative overflow-hidden flex flex-col justify-center"
        style={{ background: heroBg, minHeight: '60svh' }}>
        {heroImageUrl && !heroVideoUrl && (
          <img src={heroImageUrl} alt="" aria-hidden fetchPriority="high" loading="eager"
            className="absolute inset-0 w-full h-full object-cover" style={{ opacity: heroOverlayOpacity }} />
        )}
        {heroVideoUrl && <HeroVideo url={heroVideoUrl} opacity={heroOverlayOpacity} fallbackUrl={heroImageUrl ?? undefined} />}
        {(heroImageUrl || heroVideoUrl) && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.50) 0%, rgba(9,60,93,0.30) 100%)' }} />
        )}
        {heroShowGrid && (
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        )}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 70% at 90% 40%, rgba(118,171,174,0.08), transparent 65%)' }} />
        {heroWatermark && (
          <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
            <span className="font-black leading-none tracking-tighter block"
              style={{ fontSize: 'clamp(14rem, 32vw, 28rem)', opacity: 0.05, color: TEAL, lineHeight: 1, paddingRight: '1rem' }}>
              {heroWatermark}
            </span>
          </div>
        )}
        <div className="relative max-w-6xl mx-auto w-full px-6 py-16 sm:py-20 md:py-32">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-12 h-px" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]"
              style={{ color: `${TEAL}80` }}>{heroEyebrow}</p>
          </div>
          <h1 className="font-display font-black tracking-tighter text-white mb-6 leading-[0.88]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}>
            {heroTitle.includes('*')
              ? <>{heroTitle.split('*')[0]}<span style={{ color: TEAL }}>{heroTitle.split('*')[1]}</span></>
              : heroTitle}
          </h1>
          <p className="text-base leading-relaxed max-w-md" style={{ color: `${CREAM}BF` }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── Contenido claro ────────────────────────────── */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 md:py-24">

          {(!items || items.length === 0) && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 rounded-2xl border border-edge flex items-center justify-center mx-auto mb-5">
                <Newspaper size={26} className="text-ink-3" />
              </div>
              <p className="font-black text-xl text-ink mb-2">No hay publicaciones</p>
              <p className="text-sm text-ink-3">Próximamente habrá contenido aquí.</p>
            </div>
          )}

          {/* Featured */}
          {featured && (
            <Link href={`/publicaciones/${featured.slug}`} className="group block mb-10 md:mb-16">
              <article className="relative overflow-hidden rounded-2xl md:rounded-3xl"
                style={{ minHeight: 420, background: featured.cover_color ?? NAVY }}>
                {featured.cover_image && (
                  <>
                    <img src={featured.cover_image} alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(5,24,40,0.92) 0%, rgba(5,24,40,0.45) 50%, rgba(5,24,40,0.10) 100%)' }} />
                  </>
                )}
                {!featured.cover_image && (
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(246,243,235,0.05) 0%, transparent 100%)' }} />
                )}
                <div className="relative h-full flex flex-col justify-end p-6 md:p-10" style={{ minHeight: 420 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full"
                      style={{
                        background: `${CAT_COLOR[featured.category] ?? TEAL}20`,
                        color: CAT_COLOR[featured.category] ?? TEAL,
                        border: `1px solid ${CAT_COLOR[featured.category] ?? TEAL}40`,
                      }}>
                      {CAT_LABEL[featured.category] ?? featured.category}
                    </span>
                    <span className="text-[11px]" style={{ color: `${CREAM}50` }}>
                      {new Date(featured.published_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="font-display font-black leading-tight mb-3"
                    style={{ fontSize: 'clamp(24px, 4vw, 52px)', color: CREAM, maxWidth: '80%' }}>
                    {featured.title}
                  </h2>
                  {featured.subtitle && (
                    <p className="mb-4 text-sm md:text-base italic" style={{ color: `${CREAM}D9`, maxWidth: 560 }}>
                      {featured.subtitle}
                    </p>
                  )}
                  {featured.excerpt && (
                    <p className="mb-5 text-sm" style={{ color: `${CREAM}BF`, maxWidth: 560 }}>
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-[13px] font-bold transition group-hover:gap-3"
                    style={{ color: TEAL }}>
                    Leer más <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-8 border-b border-edge pb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">Más publicaciones</p>
                <span className="ml-auto text-[11px] font-bold text-ink-3">{rest.length}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {rest.map(item => {
                  const cc = CAT_COLOR[item.category] ?? TEAL
                  return (
                    <Link key={item.id} href={`/publicaciones/${item.slug}`}
                      className="group block rounded-2xl border border-edge hover:border-edge-2 overflow-hidden transition bg-card hover:bg-muted">
                      {/* Cover */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: item.cover_color ?? NAVY }}>
                        {item.cover_image ? (
                          <>
                            <img src={item.cover_image} alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0" style={{ background: 'rgba(5,24,40,0.20)' }} />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper size={24} style={{ color: `${CREAM}25` }} />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-full"
                          style={{ background: `${cc}25`, color: cc, border: `1px solid ${cc}40`, backdropFilter: 'blur(8px)' }}>
                          {CAT_LABEL[item.category] ?? item.category}
                        </span>
                      </div>
                      {/* Text */}
                      <div className="p-5">
                        <p className="text-[11px] text-ink-3 mb-2">
                          {new Date(item.published_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <h3 className="font-bold text-sm text-ink leading-snug mb-1.5 line-clamp-2 group-hover:text-ink-2 transition">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-[12px] text-ink-3 line-clamp-2">{item.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  )
}
