import Link from 'next/link'
import { ArrowRight, Play, Zap, Heart, Music2, Star, BookOpen } from 'lucide-react'
import { cmsSingleton, cmsImageUrl, type DHomepage } from '@/lib/directus'
import PWAInstallBanner from '@/components/public/PWAInstallBanner'
import { getDailyVerse, getDailyVerseDate } from '@/lib/daily-verse'
import { HeroVideo } from '@/components/public/HeroVideo'
import { createClient } from '@/lib/supabase/server'
import { heroStyle } from '@/lib/hero-style'
import { HeroTitle, type TitleAnimation } from '@/components/public/HeroTitle'

export const dynamic = 'force-dynamic'

const DARK  = '#051828'
const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const SAGE  = '#869B7E'
const CREAM = '#F6F3EB'

const MESES_LARGO = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
function fmtFechaLarga(iso: string) {
  const d = new Date(iso)
  return `${d.getUTCDate()} de ${MESES_LARGO[d.getUTCMonth()]} de ${d.getUTCFullYear()}`
}
function fmtFechaCorta(iso: string) {
  const d = new Date(iso)
  return `${MESES_CORTO[d.getUTCMonth()]} ${d.getUTCDate()}`
}

export default async function HomePage() {
  const supabase = await createClient()
  const [cms, { data: pageData }, { data: predicasRows }] = await Promise.all([
    cmsSingleton<DHomepage>('homepage'),
    supabase.from('page_content').select('content').eq('page', 'home').single(),
    supabase
      .from('ministry_content')
      .select('id, title, body, image_url, video_url, created_at, profiles(full_name), ministries(name, slug)')
      .in('type', ['video', 'articulo', 'anuncio'])
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5),
  ])
  const predicas = predicasRows ?? []

  const c = cms ?? {} as Partial<DHomepage>
  // Admin panel image overrides (uploaded to Supabase Storage, stored as direct URLs)
  const pc = (pageData?.content ?? {}) as Record<string, string>
  const dailyVerse    = getDailyVerse()
  const dailyVerseDate = getDailyVerseDate()

  // Hero
  const heroEyebrow     = c.hero_eyebrow     ?? 'Iglesia El Manantial · Comunidad de fe'
  const heroTitleMain   = c.hero_title_main   ?? 'Donde\nfluye'
  const heroTitleAccent = c.hero_title_accent ?? 'la vida.'
  const heroSubtitle    = c.hero_subtitle     ?? 'Una comunidad de fe viva donde encontrarás amor, propósito y una familia que te recibe como eres.'
  const heroCta1Label   = c.hero_cta1_label   ?? 'Conócenos'
  const heroCta1Url     = c.hero_cta1_url     ?? '/nosotros'
  const heroCta2Label   = c.hero_cta2_label   ?? 'Ver prédica'
  const heroCta2Url     = c.hero_cta2_url     ?? '/predicas'
  const heroImageUrl    = pc.hero_image_url   || cmsImageUrl(c.hero_image)
  const heroVideoUrl    = pc.hero_video_url   || c.hero_video_url    || null
  const heroWatermark      = c.hero_watermark || null
  const heroShowGrid       = c.hero_show_grid      !== false
  const heroGridOpacity    = c.hero_grid_opacity   ?? 0.04
  const heroOverlayOpacity = c.hero_overlay_opacity ?? (heroImageUrl || heroVideoUrl ? 0.60 : 0.92)
  const heroTitleAnimation = (c.hero_title_animation ?? 'none') as TitleAnimation
  const heroLayout         = c.hero_layout ?? 'default'
  const hs = heroStyle({
    textColor:        c.hero_text_color,
    bgColor:          c.hero_bg_color,
    titleSize:        c.hero_title_size,
    titleColorHex:    c.hero_title_color,
    accentColorHex:   c.hero_accent_color,
    subtitleColorHex: c.hero_subtitle_color,
    eyebrowColorHex:  c.hero_eyebrow_color,
    defaultBg: '#051828',
    defaultTitleSize: 'xl',
  })

  // Services
  const defaultServices = [
    { n: '01', day: 'Domingo',   time: '10:00', label: 'AM', type: 'Servicio principal' },
    { n: '02', day: 'Miércoles', time: '7:00',  label: 'PM', type: 'Estudio bíblico' },
    { n: '03', day: 'Viernes',   time: '7:00',  label: 'PM', type: 'Noche de oración' },
  ]
  const services = c.svc1_day ? [
    { n: '01', day: c.svc1_day,       time: c.svc1_time ?? '10:00', label: c.svc1_ampm ?? 'AM', type: c.svc1_type ?? '' },
    { n: '02', day: c.svc2_day ?? '', time: c.svc2_time ?? '7:00',  label: c.svc2_ampm ?? 'PM', type: c.svc2_type ?? '' },
    { n: '03', day: c.svc3_day ?? '', time: c.svc3_time ?? '7:00',  label: c.svc3_ampm ?? 'PM', type: c.svc3_type ?? '' },
  ] : defaultServices

  // Event
  const eventTitle    = c.featured_event_title ?? 'Retiro Anual 2026'
  const eventDesc     = c.featured_event_desc  ?? 'Junio 2026 · Un fin de semana de encuentro y renovación espiritual.'
  const eventEyebrow  = c.event_eyebrow        ?? 'Próximo evento'
  const eventCtaLabel = c.event_cta_label      ?? 'Más información'
  const eventCtaUrl   = c.event_cta_url        ?? '/eventos'
  const eventImageUrl = pc.event_image_url || cmsImageUrl(c.event_image)

  // Ministries featured
  const ministry1Label = c.ministry1_label ?? 'Ministerio de Jóvenes'
  const ministry1Title = c.ministry1_title ?? 'La próxima generación.'
  const ministry1Desc  = c.ministry1_desc  ?? 'Fe y comunidad auténtica para jóvenes que quieren vivir algo real.'
  const ministry1Url   = c.ministry1_url   ?? '/ministerios'
  const ministry1Cta   = c.ministry1_cta   ?? 'Explorar ministerio'
  const ministry2Label = c.ministry2_label ?? 'Matrimonios'
  const ministry2Title = c.ministry2_title ?? 'Hogares sólidos.'
  const ministry2Desc  = c.ministry2_desc  ?? 'Principios bíblicos para la familia.'
  const ministry2Url      = c.ministry2_url      ?? '/ministerios'
  const ministry1ImageUrl = pc.ministry1_image || cmsImageUrl(c.ministry1_image)
  const ministry2ImageUrl = pc.ministry2_image || cmsImageUrl(c.ministry2_image)

  // Sermons
  const sermonsEyebrow  = c.sermons_eyebrow   ?? '— Mensajes'
  const sermonsTitle    = c.sermons_title     ?? 'Crece en\nla Palabra.'
  const sermonsCtaLabel = c.sermons_cta_label ?? 'Todos'
  const sermonsCtaUrl   = c.sermons_cta_url   ?? '/predicas'
  const sermonsBadge    = c.sermons_badge     ?? 'Esta semana'

  // Ministries grid
  const ministriesEyebrow = c.ministries_eyebrow ?? '— Todos los ministerios'
  const ministriesTitle   = c.ministries_title   ?? 'Un lugar\npara todos.'
  const ministriesCta     = c.ministries_cta     ?? 'Ver todos'
  const ministriesUrl     = c.ministries_url     ?? '/ministerios'
  const mini1Name = c.mini1_name ?? 'Jóvenes';      const mini1Desc = c.mini1_desc ?? 'Próxima generación';    const mini1Url = c.mini1_url ?? '/ministerios'; const mini1Img = pc.mini1_image || cmsImageUrl(c.mini1_image)
  const mini2Name = c.mini2_name ?? 'Niños';        const mini2Desc = c.mini2_desc ?? 'Fe desde pequeños';     const mini2Url = c.mini2_url ?? '/ministerios'; const mini2Img = pc.mini2_image || cmsImageUrl(c.mini2_image)
  const mini3Name = c.mini3_name ?? 'Matrimonios';  const mini3Desc = c.mini3_desc ?? 'Hogares fuertes';       const mini3Url = c.mini3_url ?? '/ministerios'; const mini3Img = pc.mini3_image || cmsImageUrl(c.mini3_image)
  const mini4Name = c.mini4_name ?? 'Adoración';    const mini4Desc = c.mini4_desc ?? 'Excelencia al Señor';   const mini4Url = c.mini4_url ?? '/ministerios'; const mini4Img = pc.mini4_image || cmsImageUrl(c.mini4_image)

  // CTA
  const ctaEyebrow     = c.cta_eyebrow     ?? '— Eres bienvenido'
  const ctaTitleMain   = c.cta_title_main  ?? 'Tu historia\ncomienza'
  const ctaTitleAccent = c.cta_title_accent ?? 'aquí.'
  const ctaBody        = c.cta_body        ?? 'No importa dónde estés ni qué hayas vivido. Hay un lugar para ti.'
  const cta1Label      = c.cta1_label      ?? 'Visítanos este domingo'
  const cta1Url        = c.cta1_url        ?? '/contacto'
  const cta2Label      = c.cta2_label      ?? 'Unirse a la comunidad en línea'
  const cta2Url        = c.cta2_url        ?? '/login'

  const featured      = predicas[0] ?? null
  const moreSermons   = predicas.slice(1)
  const featuredThumb = featured?.image_url ?? null

  return (
    <div>

      {/* ════════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════════ */}
      <section className="hero-mesh relative min-h-[100svh] md:min-h-screen flex flex-col overflow-hidden"
        style={{ background: hs.bg }}>

        {heroImageUrl && !heroVideoUrl && (
          <img src={heroImageUrl} alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.45 }} />
        )}
        {heroVideoUrl && <HeroVideo url={heroVideoUrl} />}

        <div className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(160deg, rgba(5,24,40,${heroOverlayOpacity}) 0%, rgba(9,60,93,${Math.max(0, heroOverlayOpacity - 0.10)}) 60%, rgba(118,171,174,0.15) 100%)` }} />

        {heroShowGrid && (
          <div className="pointer-events-none absolute inset-0"
            style={{ opacity: heroGridOpacity, backgroundImage: `repeating-linear-gradient(90deg, ${hs.gridColor} 0px, ${hs.gridColor} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${hs.gridColor} 0px, ${hs.gridColor} 1px, transparent 1px, transparent 90px)` }} />
        )}

        {heroWatermark && (
          <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
            <span className="font-black leading-none tracking-tighter block"
              style={{ fontSize: 'clamp(20rem, 45vw, 42rem)', opacity: 0.04, lineHeight: 1, color: hs.gridColor }}>
              {heroWatermark}
            </span>
          </div>
        )}

        <div className={`relative flex-1 flex flex-col justify-end max-w-6xl mx-auto w-full px-6 pb-16 sm:pb-20 pt-28 sm:pt-36${heroLayout === 'centered' ? ' items-center text-center' : ''}`}>

          <div className={`flex items-center gap-4 mb-8 sm:mb-10${heroLayout === 'centered' ? ' justify-center' : ''}`}>
            {heroLayout !== 'centered' && <div className="w-10 h-px" style={{ background: hs.eyebrowLine }} />}
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: hs.eyebrowColor }}>
              {heroEyebrow}
            </p>
          </div>

          <HeroTitle
            animation={heroTitleAnimation}
            color={hs.titleColor}
            accentColor={hs.accentColor}
            className="font-display font-black tracking-tighter mb-10 sm:mb-12 max-w-5xl leading-[0.9] md:leading-[0.85]"
            style={{ fontSize: hs.titleFontSize }}
          >
            {heroTitleMain.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
            <em className="block" style={{ color: hs.accentColor }}> {heroTitleAccent}</em>
          </HeroTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-2xl">
            <p className="text-sm leading-relaxed" style={{ color: hs.subtitleColor }}>
              {heroSubtitle}
            </p>
            <div className="flex flex-col gap-3">
              <Link href={heroCta1Url}
                className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                {heroCta1Label}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={heroCta2Url}
                className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                style={{ border: `1px solid ${TEAL}50`, color: `${CREAM}BB` }}>
                <span className="flex items-center gap-2.5"><Play size={11} />{heroCta2Label}</span>
                <ArrowRight size={13} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative h-14 flex items-center px-6">
          <div className="w-px h-8 bg-gradient-to-b"
            style={{ backgroundImage: `linear-gradient(to bottom, ${TEAL}60, transparent)` }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          2. HORARIOS
      ════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, borderBottom: `1px solid #D2CDB8` }}>
        <div className="max-w-6xl mx-auto px-6 py-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D2CDB8]">
            {services.map(({ n, day, time, label, type }) => (
              <div key={n} className="flex sm:block items-center gap-6 px-6 sm:px-8 py-6 sm:py-10">
                <span className="text-[9px] font-black uppercase tracking-[0.35em] block mb-0 sm:mb-5 flex-shrink-0"
                  style={{ color: TEAL }}>
                  {n}
                </span>
                <div className="flex-1 sm:flex-none">
                  <div className="flex items-baseline gap-1.5 mb-1" style={{ whiteSpace: 'nowrap' }}>
                    <p className="font-black tracking-tighter leading-none"
                      style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: NAVY }}>
                      {time}
                    </p>
                    <p className="text-lg font-black" style={{ color: SAGE }}>{label}</p>
                  </div>
                  <p className="text-[12px] font-bold mt-1" style={{ color: NAVY }}>{type}</p>
                  <p className="text-[10px] uppercase tracking-[0.25em] mt-0.5" style={{ color: SAGE }}>{day}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3. EVENTO DESTACADO
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#E8EDE6', minHeight: '50vh' }}>

        {eventImageUrl ? (<>
          <div className="lg:hidden absolute inset-0">
            <img src={eventImageUrl} alt="" className="w-full h-full object-cover" />
            <div className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, #E8EDE6 0%, rgba(232,237,230,0.55) 40%, rgba(232,237,230,0.55) 60%, #E8EDE6 100%)' }} />
            <div className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(to right, #E8EDE6 0%, transparent 60%)' }} />
          </div>
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2">
            <img src={eventImageUrl} alt="" className="w-full h-full object-cover" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-48"
              style={{ background: 'linear-gradient(to right, #E8EDE6, transparent)' }} />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24"
              style={{ background: 'linear-gradient(to bottom, #E8EDE6, transparent)' }} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(to top, #E8EDE6, transparent)' }} />
          </div>
        </>) : (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center overflow-hidden select-none">
            <span className="font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(16rem, 35vw, 32rem)', opacity: 0.06, color: NAVY, lineHeight: 1, paddingRight: '2rem' }}>
              06
            </span>
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-20 md:py-28 flex flex-col justify-end"
          style={{ minHeight: '50vh' }}>
          <div className="max-w-xl">
            <div className="w-12 h-1 rounded-full mb-8" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: SAGE }}>
              {eventEyebrow}
            </p>
            <h2 className="font-display font-black tracking-tighter mb-5 leading-[0.9] md:leading-[0.88]"
              style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5rem)', color: NAVY }}>
              {eventTitle}
            </h2>
            <p className="text-base leading-relaxed mb-8 sm:mb-10" style={{ color: `${NAVY}70` }}>
              {eventDesc}
            </p>
            <Link href={eventCtaUrl}
              className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition"
              style={{ background: NAVY, color: CREAM }}>
              {eventCtaLabel} <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          4. MINISTERIOS FEATURED
      ════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-3" style={{ minHeight: '500px' }}>

        <Link href={ministry1Url}
          className="group relative md:col-span-2 flex flex-col justify-between overflow-hidden"
          style={{ minHeight: '400px', background: DARK }}>
          {ministry1ImageUrl && (
            <img src={ministry1ImageUrl} alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.30 }} />
          )}
          <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: `repeating-linear-gradient(45deg, ${CREAM} 0px, ${CREAM} 1px, transparent 1px, transparent 20px)` }} />
          <div className="pointer-events-none absolute right-8 top-8 font-black leading-none select-none"
            style={{ fontSize: 'clamp(8rem, 18vw, 16rem)', opacity: 0.06, color: TEAL, lineHeight: 1 }}>
            01
          </div>
          <div className="relative p-8 md:p-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${TEAL}20` }}>
                <Zap size={20} style={{ color: TEAL }} strokeWidth={2} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: `${TEAL}80` }}>
                {ministry1Label}
              </p>
            </div>
          </div>
          <div className="relative p-8 md:p-14">
            <h2 className="font-display font-black text-white tracking-tighter mb-5 leading-[0.9]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {ministry1Title}
            </h2>
            <p className="text-sm leading-relaxed mb-8 max-w-sm" style={{ color: `${CREAM}60` }}>
              {ministry1Desc}
            </p>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition"
              style={{ color: TEAL }}>
              {ministry1Cta}
              <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
            </span>
          </div>
        </Link>

        <Link href={ministry2Url}
          className="group relative flex flex-col justify-between overflow-hidden"
          style={{ minHeight: '400px', background: TEAL }}>
          {ministry2ImageUrl && (
            <img src={ministry2ImageUrl} alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.25 }} />
          )}
          <div className="pointer-events-none absolute right-4 bottom-0 font-black leading-none select-none overflow-hidden"
            style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', opacity: 0.12, color: NAVY, lineHeight: 1 }}>
            02
          </div>
          <div className="relative p-8 md:p-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Heart size={20} className="text-white" strokeWidth={2} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/60 mb-2">{ministry2Label}</p>
          </div>
          <div className="relative p-8 md:p-10">
            <h3 className="font-display font-black text-white tracking-tighter mb-3 leading-[0.9]"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
              {ministry2Title}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">{ministry2Desc}</p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition flex items-center gap-2">
              Ver <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </section>

      {/* ════════════════════════════════════════════════
          5. VERSÍCULO DEL DÍA
      ════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, borderTop: '1px solid #D2CDB8', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 md:py-28">

          <div className="flex items-center gap-4 mb-8 sm:mb-10">
            <BookOpen size={14} style={{ color: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: TEAL }} suppressHydrationWarning>
              Versículo del día · {dailyVerseDate}
            </p>
          </div>

          <div className="w-full h-px mb-10 sm:mb-14 opacity-30"
            style={{ background: `linear-gradient(to right, transparent, ${TEAL}, transparent)` }} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-1 hidden md:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em]"
                style={{ color: SAGE, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                suppressHydrationWarning>
                {dailyVerse.reference}
              </p>
            </div>
            <div className="md:col-span-11">
              <p className="font-display font-black tracking-tight leading-[0.9] md:leading-[0.88]"
                style={{ fontSize: 'clamp(1.7rem, 4.5vw, 3.8rem)', color: NAVY }}
                suppressHydrationWarning>
                &ldquo;{dailyVerse.text.split(' ').slice(0, -1).join(' ')}{' '}
                <span style={{ color: TEAL }}>{dailyVerse.text.split(' ').slice(-1)[0]}.&rdquo;</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mt-6 md:hidden"
                style={{ color: SAGE }} suppressHydrationWarning>
                — {dailyVerse.reference}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6. MENSAJES
      ════════════════════════════════════════════════ */}
      <section style={{ background: '#EDEAE0', borderBottom: `1px solid #D2CDB8` }}>
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 md:py-32">

          <div className="flex items-end justify-between mb-10 sm:mb-14 pb-7" style={{ borderBottom: `1px solid #D2CDB8` }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>
                {sermonsEyebrow}
              </p>
              <h2 className="font-display font-black tracking-tighter leading-[0.9] md:leading-[0.88]"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: NAVY }}>
                {sermonsTitle.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
            </div>
            <Link href={sermonsCtaUrl}
              className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition"
              style={{ color: SAGE }}>
              {sermonsCtaLabel} <ArrowRight size={12} />
            </Link>
          </div>

          {featured ? (
            <Link href={`/predicas/${featured.id}`}
              className="group grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden mb-4 transition hover:shadow-lg"
              style={{ border: `1px solid #D2CDB8` }}>
              <div className="lg:col-span-2 relative min-h-[220px] flex items-center justify-center overflow-hidden"
                style={{ background: featuredThumb ? undefined : `linear-gradient(135deg, ${DARK} 0%, ${TEAL} 100%)` }}>
                {featuredThumb && (
                  <img src={featuredThumb} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                )}
                <div className="absolute top-5 left-5 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                  style={{ background: TEAL, color: CREAM }}>
                  {sermonsBadge}
                </div>
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ border: `1px solid rgba(246,243,235,0.35)`, background: 'rgba(255,255,255,0.08)' }}>
                  <Play size={20} className="text-white ml-1" />
                </div>
              </div>
              <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-center" style={{ background: CREAM }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: TEAL }}>
                  {(featured.ministries as any)?.name ?? 'Mensaje'}
                </p>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3" style={{ color: NAVY }}>
                  {featured.title}
                </h3>
                <p className="text-sm uppercase tracking-wider" style={{ color: SAGE }}>
                  {(featured.profiles as any)?.full_name ?? 'Pastor'}{featured.created_at ? ` · ${fmtFechaLarga(featured.created_at)}` : ''}
                </p>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl p-10 mb-4 text-center" style={{ border: `1px solid #D2CDB8`, color: SAGE }}>
              Aún no hay prédicas publicadas.
            </div>
          )}

          {moreSermons.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid #D2CDB8` }}>
              {moreSermons.map((p, i) => (
                <Link key={p.id} href={`/predicas/${p.id}`}
                  className="group flex items-center gap-4 sm:gap-6 px-5 sm:px-6 py-5 transition"
                  style={{ background: CREAM, borderBottom: i < moreSermons.length - 1 ? `1px solid #D2CDB8` : undefined }}>
                  <span className="text-[10px] font-bold w-6 flex-shrink-0" style={{ color: SAGE }}>
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ border: `1px solid #D2CDB8` }}>
                    <Play size={10} className="ml-0.5" style={{ color: SAGE }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: NAVY }}>{p.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: SAGE }}>{(p.ministries as any)?.name ?? ''}</p>
                  </div>
                  {p.created_at && (
                    <p className="text-[11px] flex-shrink-0 hidden sm:block" style={{ color: SAGE }}>
                      {fmtFechaCorta(p.created_at)}
                    </p>
                  )}
                  <ArrowRight size={13} className="flex-shrink-0 group-hover:translate-x-1 transition-all" style={{ color: SAGE }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          7. MINISTERIOS GRID
      ════════════════════════════════════════════════ */}
      <section style={{ background: DARK }}>
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 md:py-32">
          <div className="flex items-end justify-between mb-10 sm:mb-14 pb-7"
            style={{ borderBottom: `1px solid rgba(118,171,174,0.2)` }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: `${TEAL}80` }}>
                {ministriesEyebrow}
              </p>
              <h2 className="font-display font-black tracking-tighter text-white leading-[0.9] md:leading-[0.88]"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {ministriesTitle.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
            </div>
            <Link href={ministriesUrl}
              className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition"
              style={{ color: `${TEAL}70` }}>
              {ministriesCta} <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: '01', Icon: Zap,    bg: CREAM,     fg: NAVY,  nombre: mini1Name, desc: mini1Desc, url: mini1Url, img: mini1Img },
              { n: '02', Icon: Star,   bg: TEAL,      fg: CREAM, nombre: mini2Name, desc: mini2Desc, url: mini2Url, img: mini2Img },
              { n: '03', Icon: Heart,  bg: SAGE,      fg: CREAM, nombre: mini3Name, desc: mini3Desc, url: mini3Url, img: mini3Img },
              { n: '04', Icon: Music2, bg: '#0D4A72', fg: CREAM, nombre: mini4Name, desc: mini4Desc, url: mini4Url, img: mini4Img },
            ].map(({ n, Icon, bg, fg, nombre, desc, url, img }) => (
              <Link key={n} href={url}
                className="group relative p-5 sm:p-7 rounded-2xl flex flex-col gap-4 sm:gap-5 transition hover:brightness-110 overflow-hidden"
                style={{ background: bg }}>
                {img && (
                  <>
                    <img src={img} alt="" aria-hidden
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.10) 100%)' }} />
                  </>
                )}
                <span className="relative text-[9px] font-bold tracking-widest"
                  style={{ color: img ? 'rgba(255,255,255,0.45)' : fg === CREAM ? `${CREAM}50` : `${NAVY}40` }}>{n}</span>
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                  style={{ background: img ? 'rgba(255,255,255,0.15)' : fg === CREAM ? 'rgba(255,255,255,0.15)' : `${NAVY}12` }}>
                  <Icon size={18} style={{ color: img ? CREAM : fg }} strokeWidth={2} />
                </div>
                <div className="relative">
                  <h3 className="font-black text-base sm:text-lg leading-tight mb-1" style={{ color: img ? CREAM : fg }}>{nombre}</h3>
                  <p className="text-[11px] leading-relaxed"
                    style={{ color: img ? 'rgba(246,243,235,0.65)' : fg === CREAM ? `${CREAM}60` : `${NAVY}60` }}>{desc}</p>
                </div>
                <ArrowRight size={13} className="relative group-hover:translate-x-1 transition-all mt-auto"
                  style={{ color: img ? 'rgba(246,243,235,0.45)' : fg === CREAM ? `${CREAM}40` : `${NAVY}40` }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          8. INSTALAR APP
      ════════════════════════════════════════════════ */}
      <PWAInstallBanner />

      {/* ════════════════════════════════════════════════
          9. CTA FINAL
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 55%, ${TEAL} 100%)` }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.06), transparent 70%)' }} />
        <div className="pointer-events-none absolute left-0 bottom-0 overflow-hidden select-none">
          <span className="text-[22vw] font-black leading-none tracking-tighter block"
            style={{ color: CREAM, opacity: 0.04 }}>
            VIDA
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-24 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10 sm:mb-12"
                style={{ color: `${TEAL}70` }}>
                {ctaEyebrow}
              </p>
              <h2 className="font-display font-black tracking-tighter text-white leading-[0.9] md:leading-[0.83]"
                style={{ fontSize: 'clamp(3rem, 10vw, 9rem)' }}>
                {ctaTitleMain.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
                <br /><em style={{ color: TEAL }}>{ctaTitleAccent}</em>
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-base leading-relaxed max-w-xs" style={{ color: `${CREAM}60` }}>
                {ctaBody}
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <Link href={cta1Url}
                  className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                  style={{ background: CREAM, color: NAVY }}>
                  {cta1Label}
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href={cta2Url}
                  className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                  style={{ border: `1px solid ${TEAL}40`, color: `${CREAM}70` }}>
                  {cta2Label}
                  <ArrowRight size={13} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
