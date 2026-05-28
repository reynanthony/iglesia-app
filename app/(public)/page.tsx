import Link from 'next/link'
import { ArrowRight, Play, Zap, Heart, Music2, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import BlockRenderer from '@/components/BlockRenderer'
import { HeroVideo } from '@/components/public/HeroVideo'

export const dynamic = 'force-dynamic'

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
  const { data: pageData } = await supabase.from('page_content').select('content').eq('page', 'home').single()
  const pageContent = (pageData?.content ?? {}) as Record<string, any>

  if (Array.isArray(pageContent.blocks) && pageContent.blocks.length > 0) {
    return <BlockRenderer blocks={pageContent.blocks} />
  }

  const { data: predicasData } = await supabase.from('ministry_content')
    .select('id, title, body, video_url, pinned, created_at, profiles(full_name), ministries(name)')
    .eq('type', 'video')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  const c = pageContent

  const defaultServices = [
    { n: '01', day: 'Domingo',   time: '10:00', label: 'AM', type: 'Servicio principal' },
    { n: '02', day: 'Miércoles', time: '7:00',  label: 'PM', type: 'Estudio bíblico' },
    { n: '03', day: 'Viernes',   time: '7:00',  label: 'PM', type: 'Noche de oración' },
  ]
  const rawServices: any[] = c.services ?? defaultServices
  const services = rawServices.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }))

  const verse        = c.verse                ?? 'Vengan a mí todos los que están cansados y yo les daré descanso.'
  const verseRef     = c.verse_ref            ?? 'Mateo 11:28'
  const eventTitle   = c.featured_event_title ?? 'Retiro Anual 2026'
  const eventDesc    = c.featured_event_desc  ?? 'Junio 2026 · Un fin de semana de encuentro y renovación espiritual.'
  const heroSubtitle = c.hero_subtitle        ?? 'Una comunidad de fe viva donde encontrarás amor, propósito y una familia que te recibe como eres.'

  // CMS fields
  const heroEyebrow      = (c.hero_eyebrow      as string) ?? 'Iglesia El Manantial · Comunidad de fe'
  const heroTitleMain    = (c.hero_title_main    as string) ?? 'Donde\nfluye'
  const heroTitleAccent  = (c.hero_title_accent  as string) ?? 'la vida.'
  const heroCta1Label    = (c.hero_cta1_label    as string) ?? 'Conócenos'
  const heroCta1Url      = (c.hero_cta1_url      as string) ?? '/nosotros'
  const heroCta2Label    = (c.hero_cta2_label    as string) ?? 'Ver prédica'
  const heroCta2Url      = (c.hero_cta2_url      as string) ?? '/predicas'
  const ministry1Label   = (c.ministry1_label    as string) ?? 'Ministerio de Jóvenes'
  const ministry1Title   = (c.ministry1_title    as string) ?? 'La próxima generación.'
  const ministry1Desc    = (c.ministry1_desc     as string) ?? 'Fe y comunidad auténtica para jóvenes que quieren vivir algo real.'
  const ministry1Url     = (c.ministry1_url      as string) ?? '/ministerios'
  const ministry2Label   = (c.ministry2_label    as string) ?? 'Matrimonios'
  const ministry2Title   = (c.ministry2_title    as string) ?? 'Hogares sólidos.'
  const ministry2Desc    = (c.ministry2_desc     as string) ?? 'Principios bíblicos para la familia.'
  const ministry2Url     = (c.ministry2_url      as string) ?? '/ministerios'
  const ctaEyebrow       = (c.cta_eyebrow        as string) ?? '— Eres bienvenido'
  const ctaTitleMain     = (c.cta_title_main     as string) ?? 'Tu historia\ncomienza'
  const ctaTitleAccent   = (c.cta_title_accent   as string) ?? 'aquí.'
  const ctaBody          = (c.cta_body           as string) ?? 'No importa dónde estés ni qué hayas vivido. Hay un lugar para ti.'
  const cta1Label        = (c.cta1_label         as string) ?? 'Visítanos este domingo'
  const cta1Url          = (c.cta1_url           as string) ?? '/contacto'
  const cta2Label        = (c.cta2_label         as string) ?? 'Unirse a la comunidad en línea'
  const cta2Url          = (c.cta2_url           as string) ?? '/login'

  // New CMS fields
  const eventEyebrow     = (c.event_eyebrow      as string) ?? 'Próximo evento'
  const eventCtaLabel    = (c.event_cta_label     as string) ?? 'Más información'
  const eventCtaUrl      = (c.event_cta_url       as string) ?? '/eventos'
  const eventImageUrl    = (c.event_image_url     as string) || null
  const ministry1Cta     = (c.ministry1_cta       as string) ?? 'Explorar ministerio'
  const sermonsEyebrow   = (c.sermons_eyebrow     as string) ?? '— Mensajes'
  const sermonsTitle     = (c.sermons_title       as string) ?? 'Crece en\nla Palabra.'
  const sermonsCtaLabel  = (c.sermons_cta_label   as string) ?? 'Todos'
  const sermonsCtaUrl    = (c.sermons_cta_url     as string) ?? '/predicas'
  const sermonsBadge     = (c.sermons_badge       as string) ?? 'Esta semana'
  const ministriesEyebrow = (c.ministries_eyebrow as string) ?? '— Todos los ministerios'
  const ministriesTitle  = (c.ministries_title    as string) ?? 'Un lugar\npara todos.'
  const ministriesCta    = (c.ministries_cta      as string) ?? 'Ver todos'
  const ministriesUrl    = (c.ministries_url      as string) ?? '/ministerios'
  const mini1Name        = (c.mini1_name          as string) ?? 'Jóvenes'
  const mini1Desc        = (c.mini1_desc          as string) ?? 'Próxima generación'
  const mini1Url         = (c.mini1_url           as string) ?? '/ministerios'
  const mini2Name        = (c.mini2_name          as string) ?? 'Niños'
  const mini2Desc        = (c.mini2_desc          as string) ?? 'Fe desde pequeños'
  const mini2Url         = (c.mini2_url           as string) ?? '/ministerios'
  const mini3Name        = (c.mini3_name          as string) ?? 'Matrimonios'
  const mini3Desc        = (c.mini3_desc          as string) ?? 'Hogares fuertes'
  const mini3Url         = (c.mini3_url           as string) ?? '/ministerios'
  const mini4Name        = (c.mini4_name          as string) ?? 'Adoración'
  const mini4Desc        = (c.mini4_desc          as string) ?? 'Excelencia al Señor'
  const mini4Url         = (c.mini4_url           as string) ?? '/ministerios'

  const predicas    = predicasData ?? []
  const featured    = predicas[0]
  const moreSermons = predicas.slice(1)

  return (
    <div>

      {/* ════════════════════════════════════════════════
          1. HERO — Navy animado con tipografía dominante
      ════════════════════════════════════════════════ */}
      <section className="hero-mesh relative min-h-screen flex flex-col overflow-hidden">

        {/* Imagen de fondo opcional */}
        {pageContent.hero_image_url && !pageContent.hero_video_url && (
          <img src={pageContent.hero_image_url as string} alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
        )}
        {pageContent.hero_video_url && <HeroVideo url={pageContent.hero_video_url as string} />}

        {/* Overlay navy — más suave cuando hay imagen/video, completo sin ella */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: (pageContent.hero_image_url || pageContent.hero_video_url)
            ? 'linear-gradient(160deg, rgba(5,24,40,0.50) 0%, rgba(9,60,93,0.40) 60%, rgba(118,171,174,0.15) 100%)'
            : 'linear-gradient(160deg, rgba(5,24,40,0.90) 0%, rgba(9,60,93,0.80) 60%, rgba(118,171,174,0.30) 100%)'
          }} />

        {/* Grid sutil */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />

        {/* Número decorativo */}
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black text-white leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(20rem, 45vw, 42rem)', opacity: 0.04, lineHeight: 1 }}>
            26
          </span>
        </div>

        {/* Contenido */}
        <div className="relative flex-1 flex flex-col justify-end max-w-6xl mx-auto w-full px-6 pb-20 pt-36">

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-10 anim-up anim-d1">
            <div className="w-10 h-px" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: `${TEAL}99` }}>
              {heroEyebrow}
            </p>
          </div>

          {/* H1 */}
          <h1 className="font-display font-black tracking-tighter text-white mb-12 max-w-5xl anim-up anim-d2"
            style={{ fontSize: 'clamp(3.8rem, 12vw, 11rem)', lineHeight: 0.85 }}>
            {heroTitleMain.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
            <em className="block" style={{ color: TEAL }}> {heroTitleAccent}</em>
          </h1>

          {/* Subtítulo + CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl anim-up anim-d3">
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.60)' }}>
              {heroSubtitle}
            </p>
            <div className="flex flex-col gap-3">
              <Link href={heroCta1Url}
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                {heroCta1Label}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={heroCta2Url}
                className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                style={{ border: `1px solid ${TEAL}50`, color: `${CREAM}BB` }}>
                <span className="flex items-center gap-2.5"><Play size={11} />{heroCta2Label}</span>
                <ArrowRight size={13} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll marker */}
        <div className="relative h-14 flex items-center px-6">
          <div className="w-px h-8 bg-gradient-to-b" style={{ backgroundImage: `linear-gradient(to bottom, ${TEAL}60, transparent)` }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          2. HORARIOS — franja cream con números grandes
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
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <p className="font-black tracking-tighter leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: NAVY }}>
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
          3. EVENTO DESTACADO — sage claro con navy
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#E8EDE6', minHeight: '50vh' }}>

        {/* Sin imagen: número decorativo de fondo */}
        {!eventImageUrl && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center overflow-hidden select-none">
            <span className="font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(16rem, 35vw, 32rem)', opacity: 0.06, color: NAVY, lineHeight: 1, paddingRight: '2rem' }}>
              06
            </span>
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28" style={{ minHeight: '50vh' }}>
          <div className={`flex flex-col justify-end h-full ${eventImageUrl ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' : ''}`}>

            {/* Texto */}
            <div className={eventImageUrl ? '' : 'max-w-xl'}>
              <div className="w-12 h-1 rounded-full mb-8" style={{ background: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: SAGE }}>
                {eventEyebrow}
              </p>
              <h2 className="font-display font-black tracking-tighter mb-5"
                style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5rem)', lineHeight: 0.9, color: NAVY }}>
                {eventTitle}
              </h2>
              <p className="text-base leading-relaxed mb-10" style={{ color: `${NAVY}70` }}>
                {eventDesc}
              </p>
              <Link href={eventCtaUrl}
                className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition"
                style={{ background: NAVY, color: CREAM }}>
                {eventCtaLabel} <ArrowRight size={12} />
              </Link>
            </div>

            {/* Imagen lateral */}
            {eventImageUrl && (
              <div className="relative rounded-2xl overflow-hidden w-full" style={{ aspectRatio: '4/3' }}>
                <img src={eventImageUrl} alt={eventTitle}
                  className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          4. MINISTERIOS FEATURED — 2 tarjetas editoriales
      ════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-3" style={{ minHeight: '500px' }}>

        {/* Tarjeta grande — navy oscuro */}
        <Link href={ministry1Url}
          className="group relative md:col-span-2 flex flex-col justify-between overflow-hidden"
          style={{ minHeight: '440px', background: NAVY }}>

          {/* Textura sutil */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: `repeating-linear-gradient(45deg, ${CREAM} 0px, ${CREAM} 1px, transparent 1px, transparent 20px)` }} />
          {/* Número decorativo */}
          <div className="pointer-events-none absolute right-8 top-8 font-black leading-none select-none"
            style={{ fontSize: 'clamp(8rem, 18vw, 16rem)', opacity: 0.06, color: TEAL, lineHeight: 1 }}>
            01
          </div>

          {/* Top label */}
          <div className="relative p-10 md:p-14">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${TEAL}20` }}>
                <Zap size={20} style={{ color: TEAL }} strokeWidth={2} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: `${TEAL}80` }}>
                {ministry1Label}
              </p>
            </div>
          </div>

          {/* Bottom content */}
          <div className="relative p-10 md:p-14">
            <h2 className="font-display font-black text-white tracking-tighter mb-5 transition"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
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

        {/* Tarjeta pequeña — teal */}
        <Link href={ministry2Url}
          className="group relative flex flex-col justify-between overflow-hidden"
          style={{ minHeight: '440px', background: TEAL }}>

          {/* Número decorativo */}
          <div className="pointer-events-none absolute right-4 bottom-0 font-black leading-none select-none overflow-hidden"
            style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', opacity: 0.12, color: NAVY, lineHeight: 1 }}>
            02
          </div>

          <div className="relative p-8 md:p-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Heart size={20} className="text-white" strokeWidth={2} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/60 mb-2">{ministry2Label}</p>
          </div>

          <div className="relative p-8 md:p-10">
            <h3 className="font-display font-black text-white tracking-tighter mb-3 transition"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', lineHeight: 0.9 }}>
              {ministry2Title}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              {ministry2Desc}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition flex items-center gap-2">
              Ver <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </section>

      {/* ════════════════════════════════════════════════
          5. VERSÍCULO — cream con decoración teal
      ════════════════════════════════════════════════ */}
      <section style={{ background: CREAM, borderTop: `1px solid #D2CDB8`, borderBottom: `1px solid #D2CDB8` }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          {/* Línea decorativa teal */}
          <div className="w-full h-px mb-14 opacity-30" style={{ background: `linear-gradient(to right, transparent, ${TEAL}, transparent)` }} />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] hidden md:block" style={{ color: SAGE, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {verseRef}
              </p>
            </div>
            <div className="md:col-span-11">
              <p className="font-display font-black tracking-tighter leading-[0.88]"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', color: NAVY }}>
                "{verse.split(' ').slice(0, -1).join(' ')}{' '}
                <span style={{ color: TEAL }}>{verse.split(' ').slice(-1)}."</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mt-8 md:hidden" style={{ color: SAGE }}>
                — {verseRef}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6. MENSAJES — fondo ligeramente diferente
      ════════════════════════════════════════════════ */}
      <section style={{ background: '#EDEAE0', borderBottom: `1px solid #D2CDB8` }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">

          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: `1px solid #D2CDB8` }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>
                {sermonsEyebrow}
              </p>
              <h2 className="font-display font-black tracking-tighter" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
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

          {/* Sermón destacado */}
          {featured ? (
            <Link href="/predicas" className="group grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden mb-4 transition hover:shadow-lg"
              style={{ border: `1px solid #D2CDB8` }}>
              <div className="lg:col-span-2 relative min-h-[220px] flex items-center justify-center overflow-hidden"
                style={{ background: (featured as any).image_url ? undefined : `linear-gradient(135deg, ${NAVY} 0%, ${TEAL} 100%)` }}>
                {(featured as any).image_url && (
                  <img src={(featured as any).image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                )}
                <div className="absolute top-5 left-5 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                  style={{ background: TEAL, color: CREAM }}>
                  {sermonsBadge}
                </div>
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center transition duration-300"
                  style={{ border: `1px solid rgba(246,243,235,0.35)`, background: 'rgba(255,255,255,0.08)' }}>
                  <Play size={20} className="text-white ml-1 transition" />
                </div>
              </div>
              <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-center" style={{ background: CREAM }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: TEAL }}>
                  {(featured as any).ministries?.name ?? 'Prédica'}
                </p>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3" style={{ color: NAVY }}>
                  {(featured as any).title}
                </h3>
                <p className="text-sm uppercase tracking-wider" style={{ color: SAGE }}>
                  {(featured as any).profiles?.full_name ?? 'Pastor'} · {fmtFechaLarga((featured as any).created_at)}
                </p>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl p-10 mb-4 text-center" style={{ border: `1px solid #D2CDB8`, color: SAGE }}>
              Aún no hay prédicas publicadas.{' '}
              <Link href="/admin/predicas/nuevo" className="font-bold hover:underline" style={{ color: NAVY }}>Agregar la primera →</Link>
            </div>
          )}

          {/* Lista más sermons */}
          {moreSermons.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid #D2CDB8` }}>
              {(moreSermons as any[]).map((p, i) => (
                <Link key={p.id} href="/predicas"
                  className="group flex items-center gap-6 px-6 py-5 transition"
                  style={{ background: CREAM, borderBottom: i < moreSermons.length - 1 ? `1px solid #D2CDB8` : undefined }}>
                  <span className="text-[10px] font-bold w-6 flex-shrink-0" style={{ color: SAGE }}>
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition duration-200 group-hover:border-teal"
                    style={{ border: `1px solid #D2CDB8` }}>
                    <Play size={10} className="ml-0.5 transition" style={{ color: SAGE }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: NAVY }}>{p.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: SAGE }}>{p.ministries?.name}</p>
                  </div>
                  <p className="text-[11px] flex-shrink-0 hidden sm:block" style={{ color: SAGE }}>
                    {fmtFechaCorta(p.created_at)}
                  </p>
                  <ArrowRight size={13} className="flex-shrink-0 group-hover:translate-x-1 transition-all" style={{ color: SAGE }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          7. MINISTERIOS GRID — navy con 4 tarjetas de colores
      ════════════════════════════════════════════════ */}
      <section style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: `1px solid rgba(118,171,174,0.2)` }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: `${TEAL}80` }}>
                {ministriesEyebrow}
              </p>
              <h2 className="font-display font-black tracking-tighter text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
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
              { n: '01', Icon: Zap,    bg: CREAM,     fg: NAVY,  nombre: mini1Name, desc: mini1Desc, url: mini1Url },
              { n: '02', Icon: Star,   bg: TEAL,      fg: CREAM, nombre: mini2Name, desc: mini2Desc, url: mini2Url },
              { n: '03', Icon: Heart,  bg: SAGE,      fg: CREAM, nombre: mini3Name, desc: mini3Desc, url: mini3Url },
              { n: '04', Icon: Music2, bg: '#0D4A72', fg: CREAM, nombre: mini4Name, desc: mini4Desc, url: mini4Url },
            ].map(({ n, Icon, bg, fg, nombre, desc, url }) => (
              <Link key={n} href={url}
                className="group p-7 rounded-2xl flex flex-col gap-5 transition hover:brightness-110"
                style={{ background: bg }}>
                <span className="text-[9px] font-bold tracking-widest" style={{ color: fg === CREAM ? `${CREAM}50` : `${NAVY}40` }}>{n}</span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: fg === CREAM ? 'rgba(255,255,255,0.15)' : `${NAVY}12` }}>
                  <Icon size={20} style={{ color: fg }} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight mb-1" style={{ color: fg }}>{nombre}</h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: fg === CREAM ? `${CREAM}60` : `${NAVY}60` }}>{desc}</p>
                </div>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-all mt-auto" style={{ color: fg === CREAM ? `${CREAM}40` : `${NAVY}40` }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          8. CTA FINAL — navy a teal diagonal
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 55%, ${TEAL} 100%)` }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.06), transparent 70%)' }} />
        <div className="pointer-events-none absolute left-0 bottom-0 overflow-hidden select-none">
          <span className="text-[22vw] font-black leading-none tracking-tighter block"
            style={{ color: CREAM, opacity: 0.04 }}>
            VIDA
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-12" style={{ color: `${TEAL}70` }}>
                {ctaEyebrow}
              </p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.83 }}>
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
                  className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group"
                  style={{ background: CREAM, color: NAVY }}>
                  {cta1Label}
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href={cta2Url}
                  className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group"
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
