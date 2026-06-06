'use client'

import { useState } from 'react'
import { Cross, Users2, BookOpen, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    icon: Cross,
    accent: '#76ABAE',
    eyebrow: 'Bienvenido',
    title: 'El Manantial',
    subtitle: 'Tu hogar espiritual digital. Un espacio donde la fe se vive, comparte y crece.',
  },
  {
    icon: Users2,
    accent: '#869B7E',
    eyebrow: 'Comunidad',
    title: 'Tu familia en la fe',
    subtitle: 'Conecta con hermanos, comparte peticiones de oración y ora juntos cada día.',
  },
  {
    icon: BookOpen,
    accent: '#C9A227',
    eyebrow: 'Crecimiento',
    title: 'Crece cada día',
    subtitle: 'Accede a discipulado, estudios bíblicos, predicas y recursos para tu vida espiritual.',
  },
]

interface Props {
  onComplete: () => void
}

export default function OnboardingFlow({ onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)

  function next() {
    if (current < SLIDES.length - 1) {
      setExiting(true)
      setTimeout(() => {
        setCurrent(c => c + 1)
        setExiting(false)
      }, 220)
    } else {
      onComplete()
    }
  }

  const slide = SLIDES[current]
  const Icon  = slide.icon
  const isLast = current === SLIDES.length - 1

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: '#061E30' }}
    >
      {/* Radial ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 20%, ${slide.accent}14, transparent 65%)`,
          transition: 'background 0.6s ease',
        }}
      />

      {/* Skip */}
      <div className="relative flex justify-end px-5 pt-safe-top" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 20px)' }}>
        <button
          onClick={onComplete}
          className="text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition"
          style={{ color: 'rgba(246,243,235,0.35)' }}
        >
          Saltar
        </button>
      </div>

      {/* Slide content */}
      <div
        key={current}
        className="flex-1 flex flex-col items-center justify-center px-8 text-center"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? 'translateX(-24px)' : 'translateX(0)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        {/* Icon */}
        <div
          className="elm-scale-in w-20 h-20 rounded-3xl flex items-center justify-center mb-10"
          style={{ background: `${slide.accent}18`, border: `1px solid ${slide.accent}30` }}
        >
          <Icon size={34} style={{ color: slide.accent }} strokeWidth={1.5} />
        </div>

        {/* Eyebrow */}
        <p
          className="elm-slide-up elm-delay-1 text-[10px] font-black uppercase tracking-[0.35em] mb-3"
          style={{ color: slide.accent }}
        >
          {slide.eyebrow}
        </p>

        {/* Headline */}
        <h1
          className="elm-slide-up elm-delay-2 font-black tracking-tight leading-none mb-5"
          style={{
            fontSize: 'clamp(2.4rem, 9vw, 3.5rem)',
            color: '#F6F3EB',
          }}
        >
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p
          className="elm-slide-up elm-delay-3 text-base leading-relaxed max-w-xs"
          style={{ color: 'rgba(246,243,235,0.50)' }}
        >
          {slide.subtitle}
        </p>
      </div>

      {/* Bottom controls */}
      <div
        className="relative px-6 pb-10 space-y-6"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 24px, 40px)' }}
      >
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300"
              style={{
                width:  i === current ? 24 : 6,
                height: 6,
                borderRadius: 99,
                background: i === current ? '#76ABAE' : 'rgba(118,171,174,0.25)',
              }}
              aria-label={`Ir a slide ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-transform active:scale-[0.97]"
          style={{ background: '#F6F3EB', color: '#061E30' }}
        >
          {isLast ? 'Comenzar' : 'Siguiente'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
