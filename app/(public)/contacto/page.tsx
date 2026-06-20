import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import ContactForm from '@/components/public/ContactForm'
import { HeroVideo } from '@/components/public/HeroVideo'
import { cmsSingleton, cmsImageUrl, type DContacto } from '@/lib/directus'
import { heroStyle } from '@/lib/hero-style'
import { HeroTitle, type TitleAnimation } from '@/components/public/HeroTitle'

export const dynamic = 'force-dynamic'

export default async function ContactoPage() {
  const cms = await cmsSingleton<DContacto>('contacto')
  const c = cms ?? {} as DContacto

  const address      = c.address      ?? 'Tu dirección aquí, Ciudad, País'
  const phone        = c.phone        ?? '+1 (809) 000-0000'
  const email        = c.email        ?? 'info@elmanantial.org'
  const schedule     = c.schedule     ?? 'Dom 10AM · Mié 7PM · Vie 7PM'
  const heroEyebrow  = c.hero_eyebrow ?? 'Contacto · Estamos aquí para ti'
  const heroTitle    = c.hero_title   ?? 'Visítanos.'
  const heroSubtitle = c.hero_subtitle ?? 'No importa quién eres ni qué estás viviendo. Eres bienvenido en El Manantial.'
  const infoEyebrow       = c.info_eyebrow        ?? '— Información'
  const formEyebrow       = c.form_eyebrow         ?? '— Escríbenos'
  const firstVisitTitle   = c.first_visit_title    ?? '¿Primera visita?'
  const firstVisitSubtitle = c.first_visit_subtitle ?? 'No necesitas saber nada.'
  const firstVisitBody    = c.first_visit_body     ?? 'Solo ven como eres. Nuestro equipo te recibirá con los brazos abiertos.'
  const heroImageUrl       = c.hero_image_url || cmsImageUrl(c.hero_image)
  const heroVideoUrl       = c.hero_video_url || cmsImageUrl(c.hero_video) || null
  const heroOverlayOpacity = c.hero_overlay_opacity ?? 0.65
  const heroShowGrid       = c.hero_show_grid !== false
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
    defaultTitleSize: 'lg',
  })

  const infoItems = [
    { icon: MapPin, label: 'Dirección', value: address  },
    { icon: Phone,  label: 'Teléfono',  value: phone    },
    { icon: Mail,   label: 'Email',     value: email    },
    { icon: Clock,  label: 'Servicios', value: schedule },
  ]
  return (
    <div>

      {/* ═══════════════════════════════════════
          HERO — conversacional, íntimo
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[80svh] md:min-h-[80vh] flex flex-col justify-center" style={{ background: hs.bg }}>
        {heroImageUrl && !heroVideoUrl && (
          <img src={heroImageUrl} alt="" aria-hidden fetchPriority="high" loading="eager" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: heroOverlayOpacity }} />
        )}
        {heroVideoUrl && <HeroVideo url={heroVideoUrl} opacity={heroOverlayOpacity} fallbackUrl={heroImageUrl ?? undefined} />}
        {(heroImageUrl || heroVideoUrl) && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.45) 0%, rgba(9,60,93,0.30) 100%)' }} />
        )}
        {heroShowGrid && (
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `repeating-linear-gradient(90deg, ${hs.gridColor} 0px, ${hs.gridColor} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${hs.gridColor} 0px, ${hs.gridColor} 1px, transparent 1px, transparent 90px)` }} />
        )}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-end overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', opacity: 0.06, color: hs.gridColor, paddingRight: '1rem' }}>
            HOLA
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 70% at 90% 40%, rgba(118,171,174,0.10), transparent 65%)' }} />
        <div className={`relative max-w-6xl mx-auto w-full px-6 py-12 sm:py-16 md:py-32${heroLayout === 'centered' ? ' text-center' : ''}`}>
          <div className={`flex items-center gap-5 mb-10 sm:mb-14${heroLayout === 'centered' ? ' justify-center' : ''}`}>
            {heroLayout !== 'centered' && <div className="w-12 h-px" style={{ background: hs.eyebrowLine }} />}
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: hs.eyebrowColor }}>
              {heroEyebrow}
            </p>
          </div>
          <HeroTitle
            animation={heroTitleAnimation}
            color={hs.titleColor}
            accentColor={hs.accentColor}
            className="font-display font-black tracking-tighter mb-8 leading-[0.9] md:leading-[0.85]"
            style={{ fontSize: hs.titleFontSize }}
          >
            {heroTitle}
          </HeroTitle>
          <p className="text-base leading-relaxed max-w-md" style={{ color: hs.subtitleColor }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          INFO + FORMULARIO
      ═══════════════════════════════════════ */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">

            {/* Info lateral */}
            <div className="lg:col-span-4 space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">{infoEyebrow}</p>

              <div className="space-y-3">
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 p-5 rounded-xl border border-edge hover:bg-muted transition">
                    <div className="w-9 h-9 rounded-xl border border-edge flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-ink-3" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-3 mb-1">{label}</p>
                      <p className="text-sm font-bold text-ink">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Primera visita */}
              <div className="mt-6 p-6 rounded-xl"
                style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.22)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: '#76ABAE' }}>{firstVisitTitle}</p>
                <p className="text-sm font-black text-ink mb-2">{firstVisitSubtitle}</p>
                <p className="text-sm text-ink-2 leading-relaxed">
                  {firstVisitBody}
                </p>
              </div>
            </div>

            {/* Formulario funcional */}
            <div className="lg:col-span-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-10">{formEyebrow}</p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
