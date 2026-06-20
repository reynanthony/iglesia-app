'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Leader = { id: string; name: string; title: string; bio: string | null; avatar_url: string | null }

export function LeadersCarousel({ leaders }: { leaders: Leader[] }) {
  const ref = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir === 'left' ? -296 : 296, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Flechas */}
      <div className="flex justify-end gap-2 mb-5">
        <button
          onClick={() => scroll('left')}
          aria-label="Anterior"
          className="w-9 h-9 rounded-full flex items-center justify-center border transition hover:opacity-80"
          style={{ borderColor: 'rgba(118,171,174,0.30)', color: '#76ABAE', background: '#0B2D47' }}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll('right')}
          aria-label="Siguiente"
          className="w-9 h-9 rounded-full flex items-center justify-center border transition hover:opacity-80"
          style={{ borderColor: 'rgba(118,171,174,0.30)', color: '#76ABAE', background: '#0B2D47' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Fade edges */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-8 z-10"
          style={{ background: 'linear-gradient(to right, #061E30, transparent)' }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-8 z-10"
          style={{ background: 'linear-gradient(to left, #061E30, transparent)' }} />

        {/* Track */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {leaders.map(l => {
            const initials = l.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
            return (
              <div
                key={l.id}
                className="snap-start flex-shrink-0 flex flex-col items-center text-center gap-5 p-7 rounded-2xl border transition"
                style={{ width: 280, background: '#0B2D47', borderColor: '#0D3352' }}
              >
                {/* Foto */}
                <div
                  className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ background: '#093C5D', border: '2px solid rgba(118,171,174,0.25)' }}
                >
                  {l.avatar_url
                    ? <img src={l.avatar_url} alt={l.name} width={96} height={96} loading="lazy" className="w-full h-full object-cover object-top" />
                    : <span className="font-black text-2xl" style={{ color: '#76ABAE' }}>{initials}</span>
                  }
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: '#76ABAE' }}>
                    {l.title}
                  </p>
                  <h3 className="font-black text-base leading-tight" style={{ color: '#F6F3EB' }}>
                    {l.name}
                  </h3>
                </div>

                {l.bio && (
                  <p className="text-[12px] leading-relaxed line-clamp-5" style={{ color: 'rgba(246,243,235,0.76)' }}>
                    {l.bio}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
