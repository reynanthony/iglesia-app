import Link from 'next/link'
import { ArrowRight, BookOpen, Users, ChevronRight } from 'lucide-react'
import { cmsSingleton, cmsImageUrl, type DEducacion } from '@/lib/directus'
import { HeroVideo } from '@/components/public/HeroVideo'
import { HeroTitle, type TitleAnimation } from '@/components/public/HeroTitle'
import { heroStyle } from '@/lib/hero-style'

export const dynamic = 'force-dynamic'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

export default async function EducacionPage() {
  const cms = await cmsSingleton<DEducacion>('educacion')
  const c = cms ?? {} as DEducacion

  const heroEyebrow  = c.hero_eyebrow  ?? 'Educación · Formación espiritual'
  const heroTitle    = c.hero_title    ?? 'Antes de servir, *aprender.'
  const heroSubtitle = c.hero_subtitle ?? 'La fe sin conocimiento se apaga. La formación espiritual es el fundamento sobre el que se construye todo lo demás — la comunidad, el servicio, el impacto.'
  const heroImageUrl       = c.hero_image_url || cmsImageUrl(c.hero_image)
  const heroVideoUrl       = c.hero_video_url || cmsImageUrl(c.hero_video) || null
  const heroOverlayOpacity = c.hero_overlay_opacity ?? 0.65
  const heroShowGrid       = c.hero_show_grid !== false
  const heroWatermark      = c.hero_watermark ?? 'FE'
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

  const path1Label    = c.path1_label    ?? 'Discipulado'
  const path1Headline = c.path1_headline ?? 'Crecer en\nCristo.'
  const path1Desc     = c.path1_desc     ?? 'Un camino estructurado de siete etapas desde el primer encuentro con Dios hasta el liderazgo pleno. No es un programa — es una transformación.'
  const path1Tags     = [c.path1_tag1 ?? '7 etapas', c.path1_tag2 ?? 'Mentoría personal', c.path1_tag3 ?? 'Crecimiento espiritual'].filter(Boolean)

  const path2Label    = c.path2_label    ?? 'Estudio Bíblico'
  const path2Headline = c.path2_headline ?? 'La Palabra\nviva.'
  const path2Desc     = c.path2_desc     ?? 'Estudios semanales profundos que te llevan libro por libro, tema por tema. La Biblia no es un texto antiguo — es la voz de Dios hoy.'
  const path2Tags     = [c.path2_tag1 ?? 'Miércoles 7PM', c.path2_tag2 ?? 'Todas las edades', c.path2_tag3 ?? 'Recursos descargables'].filter(Boolean)

  const whyEyebrow = c.why_eyebrow ?? '— Por qué formamos'
  const whyTitle   = c.why_title   ?? 'La educación espiritual es el camino, no el destino.'
  const whyBody1   = c.why_body1   ?? 'Antes de que alguien pueda servir con excelencia, conectarse en comunidad, o liderar con integridad — necesita conocer a Dios profundamente.'
  const whyBody2   = c.why_body2   ?? 'Por eso nuestros programas de educación son el punto de entrada al ecosistema de El Manantial: primero formamos, luego servimos juntos.'
  const verse      = c.verse     ?? '"Procura con diligencia presentarte a Dios aprobado, como obrero que no tiene de qué avergonzarse, que usa bien la palabra de verdad."'
  const verseRef   = c.verse_ref ?? '— 2 Timoteo 2:15'
  const appTitle   = c.app_title ?? 'Continúa tu formación en la comunidad en línea'
  const appBody    = c.app_body  ?? 'En la app puedes ver tu progreso de discipulado, participar en grupos de estudio y conectar con tu mentor.'
  const ctaLabel   = c.cta_label ?? 'Comenzar mi camino'

  const PATHS = [
    {
      href: '/educacion/discipulado', n: '01', label: path1Label,
      headline: path1Headline, desc: path1Desc, icon: Users, tags: path1Tags,
      bg: NAVY, fg: CREAM, accent: TEAL,
    },
    {
      href: '/educacion/estudio-biblico', n: '02', label: path2Label,
      headline: path2Headline, desc: path2Desc, icon: BookOpen, tags: path2Tags,
      bg: '#E8EDE6', fg: NAVY, accent: SAGE,
    },
  ]

  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden flex flex-col justify-end" style={{ background: hs.bg, minHeight: '80vh' }}>
        {heroImageUrl && !heroVideoUrl && (
          <img src={heroImageUrl} alt="" aria-hidden fetchPriority="high" loading="eager"
            className="absolute inset-0 w-full h-full object-cover" style={{ opacity: heroOverlayOpacity }} />
        )}
        {heroVideoUrl && <HeroVideo url={heroVideoUrl} opacity={heroOverlayOpacity} fallbackUrl={heroImageUrl ?? undefined} />}
        {(heroImageUrl || heroVideoUrl) && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.45) 0%, rgba(9,60,93,0.25) 100%)' }} />
        )}
        {heroShowGrid && (
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        )}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 60% 70% at 90% 30%, ${TEAL}15, transparent 65%)` }} />
        {heroWatermark && (
          <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
            <span className="font-black leading-none tracking-tighter block"
              style={{ fontSize: 'clamp(14rem, 32vw, 30rem)', opacity: 0.05, color: TEAL, lineHeight: 1 }}>
              {heroWatermark}
            </span>
          </div>
        )}

        <div className={`relative max-w-6xl mx-auto w-full px-6 pt-32 pb-20 md:pt-48 md:pb-28${heroLayout === 'centered' ? ' text-center' : ''}`}>
          <div className={`flex items-center gap-5 mb-14${heroLayout === 'centered' ? ' justify-center' : ''}`}>
            <div className="w-12 h-px" style={{ background: hs.eyebrowLine }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: hs.eyebrowColor }}>
              {heroEyebrow}
            </p>
          </div>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start${heroLayout === 'centered' ? ' lg:grid-cols-1' : ''}`}>
            <HeroTitle
              animation={heroTitleAnimation}
              color={hs.titleColor}
              accentColor={hs.accentColor}
              className="font-display font-black tracking-tighter"
              style={{ fontSize: hs.titleFontSize, lineHeight: 0.85 }}
            >
              {heroTitle}
            </HeroTitle>
            {heroSubtitle && heroLayout !== 'centered' && (
              <div>
                <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: hs.subtitleColor }}>
                  {heroSubtitle}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: `${TEAL}70` }}>
                  Dos caminos de formación
                </p>
              </div>
            )}
          </div>
          {heroSubtitle && heroLayout === 'centered' && (
            <p className="text-base leading-relaxed max-w-md mx-auto mt-8" style={{ color: hs.subtitleColor }}>
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* DOS CAMINOS */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {PATHS.map(({ href, n, label, headline, desc, icon: Icon, bg, fg, accent, tags }) => (
          <Link key={href} href={href}
            className="group relative flex flex-col justify-between overflow-hidden"
            style={{ minHeight: 520, background: bg }}>
            <div className="pointer-events-none absolute right-8 bottom-0 font-black leading-none select-none overflow-hidden"
              style={{ fontSize: 'clamp(10rem, 22vw, 20rem)', opacity: 0.06, color: accent, lineHeight: 1 }}>
              {n}
            </div>
            <div className="relative p-10 md:p-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}20`, border: `1px solid ${accent}35` }}>
                  <Icon size={20} style={{ color: accent }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.35em]"
                    style={{ color: fg === CREAM ? `${CREAM}50` : `${NAVY}80` }}>{n}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>{label}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative p-10 md:p-14">
              <h2 className="font-display font-black tracking-tighter mb-5 transition"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.88, color: fg }}>
                {headline.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-sm"
                style={{ color: fg === CREAM ? `${CREAM}CC` : `${NAVY}CC` }}>
                {desc}
              </p>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition group-hover:gap-3"
                style={{ color: accent }}>
                Explorar <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Por qué importa */}
      <section style={{ background: CREAM, borderTop: '1px solid #D2CDB8', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6" style={{ color: SAGE }}>{whyEyebrow}</p>
              <h2 className="font-display font-black tracking-tighter mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                {whyTitle}
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: `${NAVY}D9` }}>{whyBody1}</p>
              <p className="text-base leading-relaxed mb-8" style={{ color: `${NAVY}D9` }}>{whyBody2}</p>
              <Link href="/registro"
                className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition"
                style={{ background: NAVY, color: CREAM }}>
                {ctaLabel} <ArrowRight size={12} />
              </Link>
            </div>
            <div className="relative">
              <div className="w-2 absolute left-0 top-0 bottom-0 rounded-full" style={{ background: TEAL }} />
              <div className="pl-8">
                <p className="font-display font-black tracking-tighter leading-tight mb-6"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: NAVY }}>
                  {verse}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: SAGE }}>
                  {verseRef}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Puente app */}
      <section style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl p-8 md:p-10"
            style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.20)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: `${TEAL}80` }}>
                También en la app
              </p>
              <h3 className="font-black text-xl text-white tracking-tight">{appTitle}</h3>
              <p className="text-sm mt-2" style={{ color: 'rgba(246,243,235,0.76)' }}>{appBody}</p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/registro"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition"
                style={{ background: TEAL, color: NAVY }}>
                Crear cuenta <ChevronRight size={13} />
              </Link>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition text-center justify-center"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.84)' }}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
