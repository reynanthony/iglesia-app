'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Users, Heart, BookOpen, Droplets, HandHeart,
  UserCheck, Crown, GraduationCap,
  ChevronLeft, ChevronRight, BookMarked, Info,
} from 'lucide-react'

const CREAM = '#F6F3EB'

const STAGE_META = [
  { icon: Users },
  { icon: Heart },
  { icon: BookOpen },
  { icon: Droplets },
  { icon: HandHeart },
  { icon: UserCheck },
  { icon: Crown },
]

interface Course {
  id: string
  title: string
  level?: string
  is_active: boolean
}

interface Program {
  id: string
  title: string
  description?: string
  courses: Course[]
}

interface StageCardProps {
  name: string
  orderIndex: number
  color: string
  description?: string
  programs: Program[]
}

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
}

const LEVEL_LABEL: Record<string, string> = {
  beginner:     'Principiante',
  intermediate: 'Intermedio',
  advanced:     'Avanzado',
}

export function StageCard({ name, orderIndex, color, description, programs }: StageCardProps) {
  const [progIdx,    setProgIdx]    = useState(0)
  const [courseIdx,  setCourseIdx]  = useState(0)
  const [progDir,    setProgDir]    = useState(1)
  const [courseDir,  setCourseDir]  = useState(1)
  const [showProgDesc, setShowProgDesc] = useState(false)

  const Icon = (STAGE_META[(orderIndex - 1) % STAGE_META.length]?.icon ?? GraduationCap) as React.ElementType
  const clr  = color

  const program      = programs[progIdx]
  const activeCourses = program?.courses.filter(c => c.is_active) ?? []
  const course        = activeCourses[courseIdx]

  const goProgram = (d: number) => {
    const next = progIdx + d
    if (next < 0 || next >= programs.length) return
    setProgDir(d)
    setProgIdx(next)
    setCourseIdx(0)
    setShowProgDesc(false)
  }

  const goCourse = (i: number) => {
    if (i === courseIdx) return
    setCourseDir(i > courseIdx ? 1 : -1)
    setCourseIdx(i)
  }

  const hasPrograms = programs.length > 0

  /* ── nav button style ── */
  const navBtn = (disabled: boolean): React.CSSProperties => ({
    width: 26, height: 26, borderRadius: 7, border: 'none', padding: 0, cursor: disabled ? 'default' : 'pointer',
    background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
    color: disabled ? 'rgba(246,243,235,0.18)' : CREAM,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  })

  return (
    <div style={{
      background: '#1A3048',
      border: '1px solid rgba(255,255,255,0.08)',
      borderLeft: `4px solid ${clr}`,
      borderRadius: 16,
      padding: '24px 22px 20px',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── stage header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <p style={{
          fontSize: 9, fontWeight: 900, letterSpacing: '0.38em',
          textTransform: 'uppercase', color: `${clr}80`,
        }}>
          Etapa {String(orderIndex).padStart(2, '0')}
          {orderIndex === 1 ? ' · Entrada' : orderIndex === 7 ? ' · Meta' : ''}
        </p>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `${clr}20`, border: `1px solid ${clr}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={15} style={{ color: clr }} strokeWidth={1.8} />
        </div>
      </div>

      {/* ── stage name + description ── */}
      <h3 style={{
        fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em',
        color: CREAM, lineHeight: 1.1, marginBottom: 10,
      }}>
        {name}
      </h3>
      {description && (
        <p style={{
          fontSize: 13.5, lineHeight: 1.68,
          color: 'rgba(246,243,235,0.72)',
          fontStyle: 'italic',
          marginBottom: hasPrograms ? 18 : 0,
        }}>
          &ldquo;{description}&rdquo;
        </p>
      )}

      {/* ── programs + courses ── */}
      {hasPrograms && program && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14, flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* program row: prev arrow | label | info | next arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <button onClick={() => goProgram(-1)} style={navBtn(progIdx === 0)} disabled={progIdx === 0}>
              <ChevronLeft size={12} />
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <BookMarked size={11} style={{ color: `${clr}80`, flexShrink: 0 }} strokeWidth={2} />
                <p style={{
                  fontSize: 11, fontWeight: 900, color: CREAM,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {program.title}
                </p>
                {program.description && (
                  <button
                    onClick={() => setShowProgDesc(v => !v)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      flexShrink: 0, display: 'flex', alignItems: 'center',
                    }}
                    title="Ver descripción del programa"
                  >
                    <Info size={11} style={{ color: showProgDesc ? clr : 'rgba(246,243,235,0.30)' }} />
                  </button>
                )}
              </div>
              {programs.length > 1 && (
                <p style={{ fontSize: 9, color: 'rgba(246,243,235,0.35)', marginTop: 2 }}>
                  {progIdx + 1} de {programs.length} programas
                </p>
              )}
            </div>

            <button onClick={() => goProgram(1)} style={navBtn(progIdx === programs.length - 1)} disabled={progIdx === programs.length - 1}>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* program description (collapsible) */}
          <AnimatePresence>
            {showProgDesc && program.description && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ overflow: 'hidden', marginBottom: 10 }}
              >
                <p style={{
                  fontSize: 12, lineHeight: 1.6,
                  color: 'rgba(246,243,235,0.60)',
                  padding: '8px 10px',
                  background: `${clr}0D`,
                  borderRadius: 8,
                  borderLeft: `2px solid ${clr}40`,
                }}>
                  {program.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* courses carousel */}
          {activeCourses.length > 0 ? (
            <>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <AnimatePresence custom={courseDir} mode="wait">
                  <motion.div
                    key={`${progIdx}-${courseIdx}`}
                    custom={courseDir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <div style={{
                      padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 900, color: CREAM, lineHeight: 1.3 }}>
                          {course.title}
                        </p>
                        {course.level && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.2em', whiteSpace: 'nowrap',
                            padding: '2px 7px', borderRadius: 999,
                            background: `${clr}20`, color: `${clr}CC`,
                            flexShrink: 0,
                          }}>
                            {LEVEL_LABEL[course.level] ?? course.level}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 10, color: 'rgba(246,243,235,0.38)' }}>
                        Curso {courseIdx + 1} de {activeCourses.length}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* course navigation */}
              {activeCourses.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12 }}>
                  <button
                    onClick={() => goCourse(Math.max(0, courseIdx - 1))}
                    disabled={courseIdx === 0}
                    style={navBtn(courseIdx === 0)}
                    aria-label="Curso anterior"
                  >
                    <ChevronLeft size={12} />
                  </button>

                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {activeCourses.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: i === courseIdx ? 20 : 5,
                          height: 5, borderRadius: 999,
                          background: i === courseIdx ? clr : 'rgba(255,255,255,0.15)',
                          transition: 'all 0.25s ease',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => goCourse(Math.min(activeCourses.length - 1, courseIdx + 1))}
                    disabled={courseIdx === activeCourses.length - 1}
                    style={navBtn(courseIdx === activeCourses.length - 1)}
                    aria-label="Curso siguiente"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ fontSize: 11, fontStyle: 'italic', color: 'rgba(246,243,235,0.28)', marginTop: 4 }}>
              Cursos próximamente.
            </p>
          )}
        </div>
      )}

      {!hasPrograms && (
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'rgba(246,243,235,0.22)', marginTop: 8 }}>
          Próximamente.
        </p>
      )}
    </div>
  )
}
