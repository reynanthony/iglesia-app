import { Play, ArrowRight, Headphones } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BlockRenderer from '@/components/BlockRenderer'
import PhotoSlot from '@/components/PhotoSlot'
import { HeroVideo } from '@/components/public/HeroVideo'

export const dynamic = 'force-dynamic'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
function fmtFecha(iso: string) {
  const d = new Date(iso)
  return `${MESES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

const fallbackSermons = [
  { id: '1', titulo: 'El poder de la oración', pastor: 'Pastor Principal', fecha: 'Mayo 18, 2025', serie: 'Vida de oración',      video_url: null, image_url: null },
  { id: '2', titulo: 'Fe que mueve montañas',  pastor: 'Pastor Principal', fecha: 'Mayo 11, 2025', serie: 'Fe viva',              video_url: null, image_url: null },
  { id: '3', titulo: 'Identidad en Cristo',    pastor: 'Pastor Principal', fecha: 'Mayo 4, 2025',  serie: 'Quiénes somos',       video_url: null, image_url: null },
  { id: '4', titulo: 'El llamado de Dios',     pastor: 'Pastor Principal', fecha: 'Abr 27, 2025',  serie: 'Propósito divino',    video_url: null, image_url: null },
  { id: '5', titulo: 'Gracia y perdón',        pastor: 'Pastor Principal', fecha: 'Abr 20, 2025',  serie: 'El corazón de Dios',  video_url: null, image_url: null },
  { id: '6', titulo: 'Viviendo en victoria',   pastor: 'Pastor Principal', fecha: 'Abr 13, 2025',  serie: 'Vida abundante',      video_url: null, image_url: null },
]

export default async function PredicasPage() {
  const supabase = await createClient()

  // Fetch editorial blocks and sermon data in parallel
  const [pageResult, sermonsResult] = await Promise.all([
    supabase.from('page_content').select('content').eq('page', 'predicas').single(),
    supabase.from('ministry_content')
      .select('id, title, body, video_url, image_url, created_at, profiles(full_name), ministries(name)')
      .eq('type', 'video')
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const editorialBlocks = (pageResult.data?.content as any)?.blocks
  const hasBlocks = Array.isArray(editorialBlocks) && editorialBlocks.length > 0

  const pageContent = (pageResult.data?.content ?? {}) as Record<string, string>
  const heroEyebrow     = pageContent.hero_eyebrow     || 'Mensajes · Palabra de vida'
  const heroTitleMain   = pageContent.hero_title_main   || 'Crece\nen la'
  const heroTitleAccent = pageContent.hero_title_accent || 'Palabra.'
  const heroSubtitle    = pageContent.hero_subtitle     || 'Escucha los mensajes de nuestra iglesia y déjate transformar por la Palabra de Dios cada semana.'
  const heroImageUrl    = pageContent.hero_image_url    || null
  const heroVideoUrl    = pageContent.hero_video_url    || null

  // New CMS fields
  const featuredBadge        = pageContent.featured_badge        || 'Esta semana'
  const featuredEyebrow      = pageContent.featured_eyebrow      || 'Mensaje reciente'
  const featuredListenLabel  = pageContent.featured_listen_label || 'Escuchar ahora'
  const olderEyebrow         = pageContent.older_eyebrow         || '— Mensajes anteriores'
  const predCtaEyebrow       = pageContent.pred_cta_eyebrow      || '— Comunidad'
  const predCtaTitle         = pageContent.pred_cta_title        || '¿Listo\npara más?'
  const predCtaLabel         = pageContent.pred_cta_label        || 'Unirte a la comunidad'
  const predCtaUrl           = pageContent.pred_cta_url          || '/login'

  const dbSermons = sermonsResult.data
  const sermons: any[] = dbSermons && dbSermons.length > 0
    ? dbSermons.map(s => ({
        id: s.id,
        titulo: s.title,
        pastor: (s.profiles as any)?.full_name ?? 'Pastor Principal',
        fecha: fmtFecha(s.created_at),
        serie: (s.ministries as any)?.name ?? 'Serie',
        video_url: s.video_url,
        image_url: s.image_url,
      }))
    : fallbackSermons

  const [featured, ...rest] = sermons
  const allSeries = Array.from(new Set(sermons.map(s => s.serie)))

  return (
    <div>

      {/* ═══════════════════════════════════════
          ZONA EDITORIAL — bloques del admin, o hero hardcoded
      ═══════════════════════════════════════ */}
      {hasBlocks ? (
        <BlockRenderer blocks={editorialBlocks} />
      ) : (
        <section className="relative overflow-hidden" style={{ minHeight: '80vh', background: '#093C5D' }}>
          {heroImageUrl && !heroVideoUrl && (
            <img src={heroImageUrl} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
          )}
          {heroVideoUrl && <HeroVideo url={heroVideoUrl} />}
          {(heroImageUrl || heroVideoUrl) && (
            <div className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.45) 0%, rgba(9,60,93,0.30) 100%)' }} />
          )}
          <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none">
            <span className="font-black leading-none tracking-tighter whitespace-nowrap"
              style={{ fontSize: 'clamp(12rem, 30vw, 28rem)', opacity: 0.05, color: '#76ABAE' }}>
              PALABRA
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 50% 70% at 90% 40%, rgba(118,171,174,0.10), transparent 65%)' }} />
          <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-16 md:pt-48 md:pb-20 flex flex-col justify-end"
            style={{ minHeight: '80vh' }}>
            <div className="flex items-center gap-5 mb-14">
              <div className="w-12 h-px" style={{ background: '#76ABAE' }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: 'rgba(118,171,174,0.6)' }}>
                {heroEyebrow}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
              <h1 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
                {heroTitleMain.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
                <br /><em style={{ color: '#76ABAE' }}>{heroTitleAccent}</em>
              </h1>
              <div>
                <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: 'rgba(246,243,235,0.50)' }}>
                  {heroSubtitle}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2" style={{ color: 'rgba(118,171,174,0.60)' }}>
                    <Headphones size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{sermons.length}+ mensajes</span>
                  </div>
                  <div className="w-px h-4" style={{ background: 'rgba(118,171,174,0.20)' }} />
                  <div className="flex items-center gap-2" style={{ color: 'rgba(118,171,174,0.60)' }}>
                    <span className="text-[11px] font-bold uppercase tracking-wider">{allSeries.length} series</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          ZONA DE DATOS — siempre visible
      ═══════════════════════════════════════ */}

      {/* Sermón destacado */}
      <section className="border-b border-edge bg-card">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#76ABAE' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: '#76ABAE' }}>{featuredEyebrow}</p>
          </div>
          <a href={featured.video_url ?? '#'} target={featured.video_url ? '_blank' : undefined} rel="noopener noreferrer"
            className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border transition cursor-pointer" style={{ borderColor: 'rgba(118,171,174,0.20)' }}>
            <div className="lg:col-span-5 relative min-h-[260px] flex items-center justify-center overflow-hidden"
              style={{
                background: featured.image_url
                  ? `url(${featured.image_url}) center/cover`
                  : 'linear-gradient(135deg, #093C5D 0%, #76ABAE 100%)',
              }}>
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 70% 80% at 30% 60%, rgba(118,171,174,0.12), transparent 65%)' }} />
              <div className="absolute top-5 left-5 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                style={{ background: '#76ABAE', color: '#093C5D' }}>
                {featuredBadge}
              </div>
              <div className="relative w-20 h-20 rounded-full border border-white/25 group-hover:bg-white/20 group-hover:border-white/50 flex items-center justify-center transition duration-500 group-hover:scale-110">
                <Play size={22} className="text-white ml-1.5" />
              </div>
            </div>
            <div className="lg:col-span-7 p-10 lg:p-14 transition flex flex-col justify-between gap-8 bg-muted">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: '#76ABAE' }}>{featured.serie}</p>
                <h2 className="font-display font-black tracking-tight leading-tight mb-4"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#093C5D' }}>
                  {featured.titulo}
                </h2>
                <p className="text-sm uppercase tracking-wider" style={{ color: 'rgba(9,60,93,0.55)' }}>{featured.pastor} · {featured.fecha}</p>
              </div>
              <button className="inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition self-start group/btn"
                style={{ background: '#093C5D' }}>
                <Play size={12} /> {featuredListenLabel}
                <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </a>
        </div>
      </section>

      {/* Filtro de series */}
      <section className="bg-card border-b border-edge sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 py-0">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none -mx-6 px-6">
            <button className="flex-shrink-0 text-[11px] font-black uppercase tracking-wider text-ink border-b-2 border-ink py-4 pr-6 transition whitespace-nowrap">
              Todos
            </button>
            {allSeries.map(s => (
              <button key={s}
                className="flex-shrink-0 text-[11px] font-bold uppercase tracking-wider text-ink-3 hover:text-ink border-b-2 border-transparent hover:border-ink py-4 px-6 transition whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grilla de mensajes */}
      <section className="bg-muted border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12 border-b border-edge pb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">{olderEyebrow}</p>
            <p className="text-[11px] font-bold text-ink-3">{rest.length} mensajes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rest.map(({ id, titulo, pastor, fecha, serie, image_url, video_url }) => (
              <Link key={id} href={video_url ?? '#'} className="group block">
                <div className="relative rounded-xl overflow-hidden mb-5"
                  style={{
                    aspectRatio: '16/10',
                    background: image_url ? `url(${image_url}) center/cover` : 'linear-gradient(135deg, #093C5D 0%, #76ABAE 100%)',
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-white/25 group-hover:bg-white/20 group-hover:border-white/50 flex items-center justify-center transition duration-300 group-hover:scale-110">
                      <Play size={14} className="text-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{serie}</span>
                </div>
                <h3 className="font-black text-ink transition text-lg leading-tight mb-2 tracking-tight">{titulo}</h3>
                <p className="text-[11px] text-ink-3 uppercase tracking-wider">{pastor} · {fecha}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #051828 0%, #093C5D 60%, #76ABAE 100%)' }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 80% 50%, rgba(0,0,0,0.07), transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 mb-10">{predCtaEyebrow}</p>
            <h2 className="font-display font-black leading-[0.85] tracking-tighter text-white"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              {predCtaTitle.split('\n').map((line: string, i: number, arr: string[]) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
          </div>
          <Link href={predCtaUrl}
            className="inline-flex items-center gap-3 bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition flex-shrink-0">
            {predCtaLabel} <ArrowRight size={13} />
          </Link>
        </div>
      </section>

    </div>
  )
}
