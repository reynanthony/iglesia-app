'use client'

import { useState } from 'react'
import { Heart, Users2, BookOpen, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    icon: Heart,
    accent: '#76ABAE',
    eyebrow: 'Bienvenido',
    title: 'El Manantial',
    subtitle: 'Un espacio donde la fe se vive, comparte y crece cada día.',
  },
  {
    icon: Users2,
    accent: '#869B7E',
    eyebrow: 'Comunidad',
    title: 'Tu familia en la fe',
    subtitle: 'Conecta con hermanos, comparte peticiones de oración y ora juntos.',
  },
  {
    icon: BookOpen,
    accent: '#C9A227',
    eyebrow: 'Crecimiento',
    title: 'Crece cada día',
    subtitle: 'Discipulado, estudios bíblicos, prédicas y recursos para tu vida espiritual.',
  },
]

interface Props {
  onComplete: (bio?: string) => void
}

export default function OnboardingFlow({ onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)

  const isLast  = current === SLIDES.length - 1
  const slide   = SLIDES[current]
  const Icon    = slide.icon
  const accent  = slide.accent

  function next() {
    if (!isLast) {
      setExiting(true)
      setTimeout(() => {
        setCurrent(c => c + 1)
        setExiting(false)
      }, 220)
    } else {
      onComplete()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col sm:items-center sm:justify-center"
      style={{ background: '#061E30' }}
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
        style={{ background: '#061E30' }}
      >
        {/* Skip */}
        <div
          className="flex justify-end px-5"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
        >
          <button
            onClick={() => onComplete()}
            className="text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-2 rounded-lg transition hover:opacity-60"
            style={{ color: 'rgba(246,243,235,0.28)' }}
          >
            Saltar
          </button>
        </div>

        {/* Slide */}
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
            <Icon size={26} style={{ color: accent }} strokeWidth={1.5} />
          </div>

          <p
            className="elm-slide-up elm-delay-1 text-[9px] font-black uppercase tracking-[0.40em] mb-3"
            style={{ color: accent }}
          >
            {slide.eyebrow}
          </p>

          <h1
            className="elm-slide-up elm-delay-2 font-black tracking-tight leading-none mb-4"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', color: '#F6F3EB' }}
          >
            {slide.title}
          </h1>

          <p
            className="elm-slide-up elm-delay-3 text-sm leading-relaxed"
            style={{ color: 'rgba(246,243,235,0.46)', maxWidth: 240 }}
          >
            {slide.subtitle}
          </p>
        </div>

        {/* Bottom controls */}
        <div
          className="relative px-5 space-y-3"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 20px, 32px)' }}
        >
          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className="transition-all duration-300"
                style={{
                  width:      i === current ? 20 : 5,
                  height:     5,
                  borderRadius: 99,
                  background: i === current ? '#76ABAE' : 'rgba(118,171,174,0.22)',
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={next}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-[0.14em] transition-transform active:scale-[0.97]"
            style={{ background: '#F6F3EB', color: '#061E30' }}
          >
            {isLast ? 'Comenzar' : 'Siguiente'}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
