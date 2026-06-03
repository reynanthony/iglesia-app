'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowRight, ArrowLeft, X, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

type Leader = {
  id: string
  name: string
  title: string
  bio: string | null
  avatar_url: string | null
  category: string
}

const DARK  = '#051828'
const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const SAGE  = '#869B7E'
const CREAM = '#F6F3EB'

const HOVER_SHADOW = '0 0 0 1.5px rgba(134,155,126,0.40), 0 24px 56px rgba(0,0,0,0.38)'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return
    const focusable = Array.from(el.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])'))
    focusable[0]?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onEscape(); return }
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, ref, onEscape])
}

// ── Modal individual ───────────────────────────────────────────
function LeaderModal({ leader, onClose }: { leader: Leader; onClose: () => void }) {
  const initials = leader.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
  const modalRef = useRef<HTMLDivElement>(null)
  useFocusTrap(modalRef, true, onClose)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: 'rgba(5,24,40,0.92)', backdropFilter: 'blur(14px)' }}
    >
      {/* Backdrop */}
      <button onClick={onClose} aria-label="Cerrar" tabIndex={-1}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent', border: 'none', cursor: 'default' }} />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Perfil de ${leader.name}`}
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.13)' }}
      >
        <div className="relative w-full" style={{ height: 320 }}>
          {leader.avatar_url ? (
            <img src={leader.avatar_url} alt={leader.name} width={400} height={320}
              className="w-full h-full object-cover object-top"
              style={{ filter: 'contrast(1.06) saturate(0.85)' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: NAVY }}>
              <span className="font-black" aria-hidden="true" style={{ fontSize: '5rem', color: TEAL, opacity: 0.15 }}>{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.18) 0%, transparent 55%)' }} />
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
            style={{ background: 'linear-gradient(to top, #0B2D47 0%, rgba(11,45,71,0.55) 38%, transparent 68%)' }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ background: 'rgba(5,24,40,0.60)', color: CREAM }} aria-label="Cerrar">
            <X size={15} aria-hidden="true" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-7 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: SAGE }}>{leader.title}</p>
            <h3 className="font-black text-2xl leading-tight" style={{ color: CREAM }}>{leader.name}</h3>
          </div>
        </div>
        <div className="px-7 py-6">
          {leader.bio && (
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(246,243,235,0.58)' }}>{leader.bio}</p>
          )}
          <div className="space-y-2">
            <Link href="/contacto" onClick={onClose}
              className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051828]/40"
              style={{ background: TEAL, color: DARK }}>
              <span className="flex items-center gap-2"><MessageCircle size={13} aria-hidden="true" /> Enviar mensaje</span>
              <ArrowRight size={12} aria-hidden="true" className="group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
            </Link>
            <Link href="/contacto" onClick={onClose}
              className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/40"
              style={{ border: '1px solid rgba(118,171,174,0.18)', color: 'rgba(246,243,235,0.50)' }}>
              <span className="flex items-center gap-2"><Heart size={13} aria-hidden="true" /> Solicitar oración</span>
              <ArrowRight size={12} aria-hidden="true" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-[opacity,transform] motion-reduce:transition-none" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Modal pareja ───────────────────────────────────────────────
function CoupleModal({ leaders, onClose }: { leaders: [Leader, Leader]; onClose: () => void }) {
  const [left, right] = leaders
  const photo = left.avatar_url || right.avatar_url
  const initials = `${left.name[0]}${right.name[0]}`
  const modalRef = useRef<HTMLDivElement>(null)
  useFocusTrap(modalRef, true, onClose)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: 'rgba(5,24,40,0.92)', backdropFilter: 'blur(14px)' }}
    >
      <button onClick={onClose} aria-label="Cerrar" tabIndex={-1}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent', border: 'none', cursor: 'default' }} />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Perfil de ${left.name} y ${right.name.split(' ')[0]}`}
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.13)' }}
      >
        <div className="relative w-full" style={{ height: 320 }}>
          {photo ? (
            <img src={photo} alt={`${left.name} & ${right.name.split(' ')[0]}`} width={400} height={320}
              className="w-full h-full object-cover object-top"
              style={{ filter: 'contrast(1.06) saturate(0.85)' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: NAVY }}>
              <span className="font-black" aria-hidden="true" style={{ fontSize: '4rem', color: TEAL, opacity: 0.15 }}>{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.18) 0%, transparent 55%)' }} />
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
            style={{ background: 'linear-gradient(to top, #0B2D47 0%, rgba(11,45,71,0.55) 38%, transparent 68%)' }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ background: 'rgba(5,24,40,0.60)', color: CREAM }} aria-label="Cerrar">
            <X size={15} aria-hidden="true" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-7 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: SAGE }}>{left.title}</p>
            <h3 className="font-black text-2xl leading-tight" style={{ color: CREAM }}>
              {left.name} &amp; {right.name.split(' ')[0]}
            </h3>
          </div>
        </div>
        <div className="px-7 py-6">
          {(left.bio || right.bio) && (
            <div className="mb-6 space-y-3">
              {left.bio && <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.58)' }}>{left.bio}</p>}
              {right.bio && right.bio !== left.bio && <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.58)' }}>{right.bio}</p>}
            </div>
          )}
          <div className="space-y-2">
            <Link href="/contacto" onClick={onClose}
              className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051828]/40"
              style={{ background: TEAL, color: DARK }}>
              <span className="flex items-center gap-2"><MessageCircle size={13} aria-hidden="true" /> Enviar mensaje</span>
              <ArrowRight size={12} aria-hidden="true" className="group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
            </Link>
            <Link href="/contacto" onClick={onClose}
              className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76ABAE]/40"
              style={{ border: '1px solid rgba(118,171,174,0.18)', color: 'rgba(246,243,235,0.50)' }}>
              <span className="flex items-center gap-2"><Heart size={13} aria-hidden="true" /> Solicitar oración</span>
              <ArrowRight size={12} aria-hidden="true" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-[opacity,transform] motion-reduce:transition-none" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Card individual ────────────────────────────────────────────
function LeaderCard({ leader, photoHeight = 260, compact = false }: { leader: Leader; photoHeight?: number; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const reducedMotion = useReducedMotion()
  const initials = leader.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)

  // Compact mode: full-photo card, all text overlaid, hover reveals extra info
  if (compact) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative w-full text-left rounded-xl overflow-hidden transition-[transform,box-shadow] duration-300 motion-reduce:transition-none"
          style={{
            height: photoHeight,
            background: NAVY,
            transform: !reducedMotion && hovered ? 'translateY(-5px)' : 'translateY(0)',
            boxShadow: hovered ? HOVER_SHADOW : 'none',
          }}
        >
          {leader.avatar_url ? (
            <img src={leader.avatar_url} alt={leader.name} width={180} height={photoHeight}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              style={{ filter: 'contrast(1.06) saturate(0.85)' }} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: NAVY }}>
              <span className="font-black" style={{ fontSize: '2.5rem', color: TEAL, opacity: 0.12 }}>{initials}</span>
            </div>
          )}

          {/* Base gradient */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(5,24,40,0.95) 0%, rgba(5,24,40,0.20) 50%, transparent 100%)' }} />

          {/* Hover overlay */}
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{ background: 'linear-gradient(to top, rgba(5,24,40,0.98) 0%, rgba(5,24,40,0.50) 60%, transparent 100%)', opacity: hovered ? 1 : 0 }} />

          {/* Contenido siempre visible: nombre */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
            {/* Cargo — siempre visible */}
            <p className="font-bold uppercase truncate mb-0.5"
              style={{ fontSize: 9, letterSpacing: '0.20em', color: SAGE }}>
              {leader.title}
            </p>
            <h3 className="font-black leading-tight truncate" style={{ fontSize: 14, color: CREAM }}>
              {leader.name.split(' ').slice(0, 2).join(' ')}
            </h3>
            {/* Ver Perfil — solo en hover desktop */}
            <div className="hidden sm:flex items-center gap-1 font-bold uppercase mt-0.5 transition-[opacity,transform] duration-300 motion-reduce:transition-none"
              style={{
                fontSize: 8, letterSpacing: '0.18em', color: TEAL,
                opacity: hovered ? 1 : 0,
                transform: !reducedMotion && hovered ? 'translateY(0)' : reducedMotion ? 'none' : 'translateY(4px)',
              }}>
              Ver Perfil <ArrowRight size={8} aria-hidden="true" />
            </div>
          </div>
        </button>

        {open && <LeaderModal leader={leader} onClose={() => setOpen(false)} />}
      </>
    )
  }

  // Standard mode
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group w-full text-left rounded-2xl overflow-hidden transition-[transform,box-shadow] duration-300 motion-reduce:transition-none"
        style={{
          background: '#0B2D47',
          transform: !reducedMotion && hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered ? HOVER_SHADOW : 'none',
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ height: photoHeight }}>
          {leader.avatar_url ? (
            <img src={leader.avatar_url} alt={leader.name} width={400} height={photoHeight}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              style={{ filter: 'contrast(1.06) saturate(0.85)' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: NAVY }}>
              <span className="font-black" style={{ fontSize: '4.5rem', color: TEAL, opacity: 0.12 }}>{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.18) 0%, transparent 55%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0B2D47 0%, rgba(11,45,71,0.60) 32%, transparent 62%)' }} />
        </div>
        <div className="px-5 pb-6 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.20em] mb-2" style={{ color: SAGE }}>
            {leader.title}
          </p>
          <h3 className="font-black leading-tight mb-2.5" style={{ fontSize: 22, color: CREAM }}>
            {leader.name}
          </h3>
          {leader.bio && (
            <p className="text-[13px] leading-relaxed line-clamp-2 mb-4"
              style={{ color: 'rgba(246,243,235,0.45)' }}>
              {leader.bio}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-[opacity,transform] duration-300 motion-reduce:transition-none"
            style={{
              color: TEAL,
              opacity: hovered ? 1 : 0,
              transform: !reducedMotion && hovered ? 'translateY(0)' : reducedMotion ? 'none' : 'translateY(4px)',
            }}>
            Ver Perfil
            <ArrowRight size={11} aria-hidden="true" style={{ transform: !reducedMotion && hovered ? 'translateX(3px)' : 'translateX(0)', transition: reducedMotion ? 'none' : 'transform 0.3s' }} />
          </div>
        </div>
      </button>

      {open && <LeaderModal leader={leader} onClose={() => setOpen(false)} />}
    </>
  )
}

// ── Card pareja — foto única ───────────────────────────────────
function CoupleCard({ leaders }: { leaders: [Leader, Leader] }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const reducedMotion = useReducedMotion()
  const [left, right] = leaders
  const photo = left.avatar_url || right.avatar_url
  const initials = `${left.name[0]}${right.name[0]}`

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group w-full text-left rounded-2xl overflow-hidden transition-[transform,box-shadow] duration-300 motion-reduce:transition-none"
        style={{
          background: '#0B2D47',
          transform: !reducedMotion && hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered ? HOVER_SHADOW : 'none',
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ height: 360 }}>
          {photo ? (
            <img src={photo} alt={`${left.name} & ${right.name.split(' ')[0]}`} width={400} height={360}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              style={{ filter: 'contrast(1.06) saturate(0.85)' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: NAVY }}>
              <span className="font-black" style={{ fontSize: '4rem', color: TEAL, opacity: 0.12 }}>{initials}</span>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.18) 0%, transparent 55%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0B2D47 0%, rgba(11,45,71,0.60) 32%, transparent 62%)' }} />
        </div>
        <div className="px-5 pb-6 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.20em] mb-2" style={{ color: SAGE }}>
            {left.title}
          </p>
          <h3 className="font-black leading-tight mb-2.5" style={{ fontSize: 22, color: CREAM }}>
            {left.name} &amp; {right.name.split(' ')[0]}
          </h3>
          {(left.bio || right.bio) && (
            <p className="text-[13px] leading-relaxed line-clamp-2 mb-4"
              style={{ color: 'rgba(246,243,235,0.45)' }}>
              {left.bio || right.bio}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-[opacity,transform] duration-300 motion-reduce:transition-none"
            style={{
              color: TEAL,
              opacity: hovered ? 1 : 0,
              transform: !reducedMotion && hovered ? 'translateY(0)' : reducedMotion ? 'none' : 'translateY(4px)',
            }}>
            Ver Perfil
            <ArrowRight size={11} aria-hidden="true" style={{ transform: !reducedMotion && hovered ? 'translateX(3px)' : 'translateX(0)', transition: reducedMotion ? 'none' : 'transform 0.3s' }} />
          </div>
        </div>
      </button>

      {open && <CoupleModal leaders={leaders} onClose={() => setOpen(false)} />}
    </>
  )
}

// ── Carrusel líderes de ministerios ───────────────────────────
function MinistryCarousel({ leaders }: { leaders: Leader[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 170 : -170, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Track — overflow clip en el padre para no romper el layout */}
      <div className="overflow-hidden -mx-6 px-6">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-3"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
        >
          <style>{`[data-carousel]::-webkit-scrollbar{display:none}`}</style>
          {leaders.map(l => (
            <div key={l.id} className="flex-none w-[180px]"
              style={{ scrollSnapAlign: 'start' }}>
              <LeaderCard leader={l} photoHeight={170} compact />
            </div>
          ))}
          {/* Spacer final para que el último card no quede pegado al borde */}
          <div className="flex-none w-2" aria-hidden />
        </div>
      </div>

      {/* Controles — solo visibles en desktop */}
      <div className="hidden sm:flex items-center justify-between mt-5">
        <div className="flex gap-1.5">
          {leaders.map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full"
              style={{ background: 'rgba(118,171,174,0.25)' }} />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-70 active:scale-95"
            style={{ border: '1px solid rgba(118,171,174,0.22)', color: 'rgba(246,243,235,0.55)' }}
            aria-label="Anterior"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-70 active:scale-95"
            style={{ border: '1px solid rgba(118,171,174,0.22)', color: 'rgba(246,243,235,0.55)' }}
            aria-label="Siguiente"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Export principal ───────────────────────────────────────────
export function LeaderCards({ pastoral, ministerio }: { pastoral: Leader[]; ministerio: Leader[] }) {
  return (
    <div className="space-y-20">

      {/* Pastores */}
      {pastoral.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-px h-5" style={{ background: TEAL }} />
            <p className="text-[9px] font-bold uppercase tracking-[0.38em]"
              style={{ color: 'rgba(246,243,235,0.28)' }}>
              Liderazgo pastoral
            </p>
          </div>

          {pastoral.length === 2 ? (
            <div className="max-w-sm">
              <CoupleCard leaders={[pastoral[0], pastoral[1]]} />
            </div>
          ) : (
            <div className={`grid gap-5 ${
              pastoral.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {pastoral.map(l => <LeaderCard key={l.id} leader={l} photoHeight={300} />)}
            </div>
          )}
        </div>
      )}

      {/* Líderes de ministerios — carrusel */}
      {ministerio.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-px h-5" style={{ background: TEAL }} />
            <p className="text-[9px] font-bold uppercase tracking-[0.38em]"
              style={{ color: 'rgba(246,243,235,0.28)' }}>
              Líderes de ministerios
            </p>
          </div>
          <MinistryCarousel leaders={ministerio} />
        </div>
      )}

    </div>
  )
}
