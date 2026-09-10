'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Users2, BookOpen, Sprout, UsersRound, ChevronRight } from 'lucide-react'
import { BG, MUTED, GOLD, GOLD_INK, INK, CARD, BORDER } from '@/lib/gold-theme'

const SLIDES = [
  {
    icon: Heart,
    accent: GOLD,
    eyebrow: 'Bienvenido',
    title: null, // usa siteName
    subtitle: 'Detente un momento. Un espacio apartado del ruido, para encontrarte con la Palabra y crecer en Cristo.',
  },
  {
    icon: Users2,
    accent: '#869B7E',
    eyebrow: 'Comunidad',
    title: 'Tu familia en la fe',
    subtitle: 'Conecta con hermanos, comparte peticiones de oración y ora juntos.',
  },
]

const INTERESTS = [
  { icon: BookOpen,   label: 'Leer la Biblia',    href: '/biblia',           accent: GOLD },
  { icon: Sprout,     label: 'Empezar un curso',  href: '/app/discipulado',  accent: '#869B7E' },
  { icon: UsersRound, label: 'Unirme a un grupo', href: '/app/grupos',       accent: '#60A5FA' },
]

interface Props {
  onComplete: (bio?: string) => void
  siteName?: string
}

export default function OnboardingFlow({ onComplete, siteName }: Props) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)

  const isInterestStep = current === SLIDES.length
  const slide   = SLIDES[current]
  const Icon    = slide?.icon
  const accent  = slide?.accent ?? GOLD
  const title   = slide?.title ?? (siteName || 'El Manantial')

  function advance() {
    setExiting(true)
    setTimeout(() => {
      setCurrent(c => c + 1)
      setExiting(false)
    }, 220)
  }

  function finish(href?: string) {
    onComplete()
    if (href) router.push(href)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col sm:items-center sm:justify-center"
      style={{ background: BG }}
    >
      {/* Desktop backdrop */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block" style={{ background: 'rgba(0,0,0,0.38)' }} />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 65% 45% at 50% 18%, ${accent}12, transparent 62%)`,
          transition: 'background 0.6s ease',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 flex w-full flex-1 flex-col sm:flex-initial sm:h-[560px] sm:w-[400px] sm:rounded-3xl sm:overflow-hidden sm:border sm:border-white/[0.06]"
        style={{ background: BG }}
      >
        {/* Skip */}
        <div
          className="flex justify-end px-5"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
        >
          <button
            onClick={() => finish()}
            className="text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-2 rounded-lg transition hover:opacity-60"
            style={{ color: MUTED }}
          >
            Saltar
          </button>
        </div>

        {isInterestStep ? (
          <div
            key="interests"
            className="flex-1 flex flex-col items-center justify-center px-8 text-center"
            style={{
              opacity:    exiting ? 0 : 1,
              transform:  exiting ? 'translateX(-24px)' : 'translateX(0)',
              transition: 'opacity 0.22s ease, transform 0.22s ease',
            }}
          >
            <p className="elm-slide-up text-[9px] font-black uppercase tracking-[0.40em] mb-3" style={{ color: GOLD }}>
              Para empezar
            </p>
            <h1 className="elm-slide-up elm-delay-1 font-black tracking-tight leading-none mb-3" style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', color: INK }}>
              ¿Por dónde quieres empezar?
            </h1>
            <p className="elm-slide-up elm-delay-2 text-sm leading-relaxed mb-7" style={{ color: MUTED, maxWidth: 260 }}>
              Puedes cambiarlo cuando quieras — esto solo personaliza tu primer paso.
            </p>
            <div className="w-full space-y-2.5">
              {INTERESTS.map(({ icon: IIcon, label, href, accent: iAccent }) => (
                <button
                  key={href}
                  onClick={() => finish(href)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition hover:opacity-85 active:scale-[0.98]"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${iAccent}1E` }}>
                    <IIcon size={16} style={{ color: iAccent }} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: INK }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            key={current}
            className="flex-1 flex flex-col items-center justify-center px-8 text-center"
            style={{
              opacity:    exiting ? 0 : 1,
              transform:  exiting ? 'translateX(-24px)' : 'translateX(0)',
              transition: 'opacity 0.22s ease, transform 0.22s ease',
            }}
          >
            <div
              className="elm-scale-in w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
              style={{ background: `${accent}16`, border: `1px solid ${accent}26` }}
            >
              {Icon && <Icon size={26} style={{ color: accent }} strokeWidth={1.5} />}
            </div>

            <p
              className="elm-slide-up elm-delay-1 text-[9px] font-black uppercase tracking-[0.40em] mb-3"
              style={{ color: accent }}
            >
              {slide.eyebrow}
            </p>

            <h1
              className="elm-slide-up elm-delay-2 font-black tracking-tight leading-none mb-4"
              style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', color: INK }}
            >
              {title}
            </h1>

            <p
              className="elm-slide-up elm-delay-3 text-sm leading-relaxed"
              style={{ color: MUTED, maxWidth: 240 }}
            >
              {slide.subtitle}
            </p>
          </div>
        )}

        {/* Bottom controls */}
        <div
          className="relative px-5 space-y-3"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 20px, 32px)' }}
        >
          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5">
            {[...SLIDES, null].map((_, i) => (
              <div
                key={i}
                className="transition-all duration-300"
                style={{
                  width:      i === current ? 20 : 5,
                  height:     5,
                  borderRadius: 99,
                  background: i === current ? GOLD : `${GOLD}38`,
                }}
              />
            ))}
          </div>

          {/* CTA */}
          {!isInterestStep && (
            <button
              onClick={advance}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-[0.14em] transition-transform active:scale-[0.97]"
              style={{ background: GOLD, color: GOLD_INK }}
            >
              Siguiente
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
