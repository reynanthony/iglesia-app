'use client'
import type { CSSProperties } from 'react'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'

export interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  initials: string
  color: string
}

interface Props {
  testimonials: Testimonial[]
  autoPlay?: boolean
  interval?: number
  title?: string
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center:               { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}

export function TestimonialCard({ testimonials, autoPlay = true, interval = 5000, title = 'Testimonios' }: Props) {
  const [index, setIndex] = useState(0)
  const [dir,   setDir]   = useState(1)

  useEffect(() => {
    if (!autoPlay || testimonials.length < 2) return
    const t = setInterval(() => {
      setDir(1)
      setIndex(i => (i + 1) % testimonials.length)
    }, interval)
    return () => clearInterval(t)
  }, [autoPlay, interval, testimonials.length])

  const go = (d: number) => {
    setDir(d)
    setIndex(i => (i + d + testimonials.length) % testimonials.length)
  }

  const t = testimonials[index]
  if (!t) return null

  const navBtn: CSSProperties = {
    width: 30, height: 30, borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: CREAM, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
  }

  return (
    <div style={{
      background: '#1A3048',
      border: '1px solid rgba(255,255,255,0.08)',
      borderLeft: `4px solid ${TEAL}`,
      borderRadius: 16,
      padding: '24px 22px 20px',
      overflow: 'hidden',
    }}>
      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <p style={{
          fontSize: 9, fontWeight: 900, letterSpacing: '0.35em',
          textTransform: 'uppercase', color: `${TEAL}80`,
        }}>
          {title}
        </p>
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={() => go(-1)} style={navBtn} aria-label="Anterior">
            <ChevronLeft size={13} />
          </button>
          <button onClick={() => go(1)} style={navBtn} aria-label="Siguiente">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* animated content */}
      <div style={{ overflow: 'hidden', minHeight: 172 }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {/* stars */}
            <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  fill={i < t.rating ? TEAL : 'transparent'}
                  style={{ color: i < t.rating ? TEAL : 'rgba(118,171,174,0.22)' }}
                />
              ))}
            </div>

            {/* quote */}
            <p style={{
              fontSize: 13.5, lineHeight: 1.68,
              color: 'rgba(246,243,235,0.78)',
              fontStyle: 'italic',
              marginBottom: 18,
            }}>
              &ldquo;{t.content}&rdquo;
            </p>

            {/* author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `${t.color}28`,
                border: `1px solid ${t.color}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900, color: t.color,
                flexShrink: 0,
              }}>
                {t.initials}
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 900, color: CREAM, lineHeight: 1.2 }}>
                  {t.name}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(246,243,235,0.42)', marginTop: 2 }}>
                  {t.role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dot indicators */}
      {testimonials.length > 1 && (
        <div style={{ display: 'flex', gap: 5, marginTop: 16, justifyContent: 'center' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > index ? 1 : -1); setIndex(i) }}
              aria-label={`Testimonio ${i + 1}`}
              style={{
                width: i === index ? 20 : 5,
                height: 5, borderRadius: 999,
                background: i === index ? TEAL : 'rgba(255,255,255,0.15)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
