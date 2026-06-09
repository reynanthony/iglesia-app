'use client'

import { useState } from 'react'
import { ArrowRight, Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

// ── TeamMemberCard — liderazgo pastoral ───────────────────────
function PastoralCard({ leader }: { leader: Leader }) {
  const [expanded, setExpanded] = useState(false)
  const parts     = leader.name.split(' ')
  const firstName = parts[0]
  const lastName  = parts.slice(1).join(' ')
  const initials  = `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()

  const expandedContent = (
    <motion.div
      key="expanded"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div className="pt-6 flex flex-col gap-4">
        {leader.bio && (
          <p className="text-sm leading-[1.8]" style={{ color: 'rgba(246,243,235,0.55)' }}>
            {leader.bio}
          </p>
        )}
        <div className="space-y-2">
          <Link href="/contacto"
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition group"
            style={{ background: TEAL, color: DARK }}>
            <span className="flex items-center gap-2"><MessageCircle size={12} /> Enviar mensaje</span>
            <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/contacto"
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition group"
            style={{ border: '1px solid rgba(118,171,174,0.22)', color: 'rgba(246,243,235,0.65)' }}>
            <span className="flex items-center gap-2"><Heart size={12} /> Solicitar oración</span>
            <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Cargo */}
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-5 text-[10px] font-bold tracking-[0.38em] uppercase"
        style={{ color: `${TEAL}70` }}
      >
        {leader.title}
      </motion.p>

      {/* ── Desktop ── */}
      <div className="hidden sm:inline-flex flex-col">
        {/* Foto con degradado inferior */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: 480, height: 520 }}
        >
          {leader.avatar_url ? (
            <img src={leader.avatar_url} alt={leader.name}
              className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
              style={{ filter: 'contrast(1.06) saturate(0.85)' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: NAVY }}>
              <span style={{ fontSize: '5rem', fontWeight: 900, color: TEAL, opacity: 0.12 }}>{initials}</span>
            </div>
          )}
          {/* Degradado inferior */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
            style={{ height: 160, background: 'linear-gradient(to top, #051828 0%, rgba(5,24,40,0.6) 40%, transparent 100%)' }} />
        </motion.div>

        {/* Nombre e info fuera de la foto, debajo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
          style={{ paddingTop: 24, maxWidth: 480 }}
        >
          <p style={{ lineHeight: 1.0, letterSpacing: '-0.03em', color: CREAM, marginBottom: 32 }}>
            <span style={{ fontSize: 'clamp(2.8rem, 5vw, 5.5rem)', fontWeight: 300, display: 'block' }}>
              {firstName}
            </span>
            <span style={{ fontSize: 'clamp(2.8rem, 5vw, 5.5rem)', fontWeight: 900, display: 'block' }}>
              {lastName}
            </span>
          </p>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(v => !v)}
            className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300"
            style={{
              border: `1px solid ${expanded ? `${TEAL}60` : 'rgba(118,171,174,0.28)'}`,
              background: expanded ? `${TEAL}12` : 'transparent',
            }}
            aria-label={expanded ? 'Cerrar' : `Ver más sobre ${leader.name}`}
          >
            <motion.div animate={{ rotate: expanded ? -45 : 0 }} transition={{ duration: 0.3 }}>
              <ArrowRight size={22} style={{ color: TEAL }} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {expanded && expandedContent}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Mobile ── */}
      <div className="sm:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full overflow-hidden"
          style={{ height: 340 }}
        >
          {leader.avatar_url ? (
            <img src={leader.avatar_url} alt={leader.name}
              className="h-full w-full object-cover object-top"
              style={{ filter: 'contrast(1.06) saturate(0.85)' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: NAVY }}>
              <span style={{ fontSize: '5rem', fontWeight: 900, color: TEAL, opacity: 0.12 }}>{initials}</span>
            </div>
          )}
          {/* Degradado inferior */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
            style={{ height: 100, background: 'linear-gradient(to top, #051828 0%, rgba(5,24,40,0.5) 50%, transparent 100%)' }} />
        </motion.div>

        {/* Nombre e info fuera de la foto */}
        <div className="mt-5 px-1">
          <p style={{ lineHeight: 1.0, letterSpacing: '-0.03em', color: CREAM, marginBottom: 20 }}>
            <span style={{ fontSize: 'clamp(1.9rem, 7.5vw, 3rem)', fontWeight: 300, display: 'block' }}>
              {firstName}
            </span>
            <span style={{ fontSize: 'clamp(1.9rem, 7.5vw, 3rem)', fontWeight: 900, display: 'block' }}>
              {lastName}
            </span>
          </p>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(v => !v)}
            className="flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300"
            style={{
              border: `1px solid ${expanded ? `${TEAL}60` : 'rgba(118,171,174,0.28)'}`,
              background: expanded ? `${TEAL}12` : 'transparent',
            }}
            aria-label={expanded ? 'Cerrar' : `Ver más sobre ${leader.name}`}
          >
            <motion.div animate={{ rotate: expanded ? -45 : 0 }} transition={{ duration: 0.3 }}>
              <ArrowRight size={17} style={{ color: TEAL }} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {expanded && expandedContent}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ── Tarjeta individual del carrusel ───────────────────────────
function ProfileCard({ leader }: { leader: Leader }) {
  const [expanded, setExpanded] = useState(false)
  const parts     = leader.name.split(' ')
  const firstName = parts[0]
  const lastName  = parts.slice(1).join(' ')
  const initials  = `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()

  return (
    <div style={{ width: 220, flexShrink: 0 }}>
      {/* Foto con degradado inferior */}
      <div className="relative overflow-hidden" style={{ height: 290, background: NAVY }}>
        {leader.avatar_url ? (
          <img src={leader.avatar_url} alt={leader.name}
            className="w-full h-full object-cover object-top"
            style={{ filter: 'contrast(1.06) saturate(0.85)' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ fontSize: '3rem', fontWeight: 900, color: TEAL, opacity: 0.12 }}>{initials}</span>
          </div>
        )}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
          style={{ height: 110, background: 'linear-gradient(to top, #051828 0%, rgba(5,24,40,0.55) 45%, transparent 100%)' }} />
      </div>

      {/* Nombre y cargo fuera de la foto */}
      <div style={{ paddingTop: 16 }}>
        <p style={{ lineHeight: 1.0, letterSpacing: '-0.03em', color: CREAM, marginBottom: 6 }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 300, display: 'block' }}>{firstName}</span>
          <span style={{ fontSize: '1.35rem', fontWeight: 900, display: 'block' }}>{lastName}</span>
        </p>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: SAGE, marginBottom: 14 }}>
          {leader.title}
        </p>

        {/* Botón circular — igual que PastoralCard */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(v => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300"
          style={{
            border: `1px solid ${expanded ? `${TEAL}60` : 'rgba(118,171,174,0.28)'}`,
            background: expanded ? `${TEAL}12` : 'transparent',
          }}
          aria-label={expanded ? 'Cerrar' : `Ver más de ${leader.name}`}
        >
          <motion.div animate={{ rotate: expanded ? -45 : 0 }} transition={{ duration: 0.3 }}>
            <ArrowRight size={15} style={{ color: TEAL }} />
          </motion.div>
        </motion.button>

        {/* Contenido expandible */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {leader.bio && (
                  <p style={{ fontSize: 12, lineHeight: 1.7, color: 'rgba(246,243,235,0.52)', marginBottom: 4 }}>
                    {leader.bio}
                  </p>
                )}
                <Link href="/contacto"
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.12em] transition group"
                  style={{ background: TEAL, color: DARK }}>
                  <span className="flex items-center gap-1.5"><MessageCircle size={11} /> Mensaje</span>
                  <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/contacto"
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.12em] transition group"
                  style={{ border: '1px solid rgba(118,171,174,0.22)', color: 'rgba(246,243,235,0.65)' }}>
                  <span className="flex items-center gap-1.5"><Heart size={11} /> Oración</span>
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Carrusel de perfil ─────────────────────────────────────────
function ProfileCarousel({ leaders }: { leaders: Leader[] }) {
  const [startIdx, setStartIdx] = useState(0)
  const CARD_W = 220
  const GAP    = 24

  const canPrev = startIdx > 0
  const canNext = startIdx < leaders.length - 1
  const prev = () => setStartIdx(i => Math.max(0, i - 1))
  const next = () => setStartIdx(i => Math.min(leaders.length - 1, i + 1))

  const navBtn = (disabled: boolean): React.CSSProperties => ({
    width: 36, height: 36, borderRadius: '50%', padding: 0, flexShrink: 0,
    cursor: disabled ? 'default' : 'pointer',
    background: disabled ? 'rgba(118,171,174,0.05)' : 'rgba(118,171,174,0.10)',
    border: `1px solid ${disabled ? 'rgba(118,171,174,0.08)' : 'rgba(118,171,174,0.20)'}`,
    color: disabled ? 'rgba(246,243,235,0.20)' : CREAM,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

  return (
    <div>
      {/* Track deslizante */}
      <div style={{ overflow: 'hidden' }}>
        <motion.div
          style={{ display: 'flex', gap: GAP }}
          animate={{ x: -(startIdx * (CARD_W + GAP)) }}
          transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        >
          {leaders.map(leader => (
            <ProfileCard key={leader.id} leader={leader} />
          ))}
        </motion.div>
      </div>

      {/* Navegación */}
      {leaders.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
          <button onClick={prev} disabled={!canPrev} style={navBtn(!canPrev)} aria-label="Anterior">
            <ChevronLeft size={15} />
          </button>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {leaders.map((_, i) => (
              <button key={i} onClick={() => setStartIdx(i)} aria-label={`Líder ${i + 1}`}
                style={{
                  width: i === startIdx ? 18 : 5, height: 5, borderRadius: 999,
                  border: 'none', padding: 0, cursor: 'pointer',
                  background: i === startIdx ? TEAL : 'rgba(118,171,174,0.22)',
                  transition: 'all 0.25s ease',
                }} />
            ))}
          </div>
          <button onClick={next} disabled={!canNext} style={navBtn(!canNext)} aria-label="Siguiente">
            <ChevronRight size={15} />
          </button>
        </div>
      )}
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
          <div className="flex items-center gap-3 mb-12">
            <div className="w-px h-5" style={{ background: TEAL }} />
            <p className="text-[9px] font-bold uppercase tracking-[0.38em]"
              style={{ color: 'rgba(246,243,235,0.28)' }}>
              Liderazgo pastoral
            </p>
          </div>

          {pastoral[0] && <PastoralCard leader={pastoral[0]} />}
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
          <ProfileCarousel leaders={ministerio} />
        </div>
      )}

    </div>
  )
}
