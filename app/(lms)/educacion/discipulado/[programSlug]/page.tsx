import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle2, Clock, ChevronRight, Lock, ArrowRight } from 'lucide-react'
import { enrollInCourse } from '@/app/actions/discipleship-lms'

const NAVY = '#093C5D'
const TEAL = '#76ABAE'

const LEVEL_LABEL: Record<string, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

export default async function ProgramPage({ params }: { params: Promise<{ programSlug: string }> }) {
  const { programSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: program },
    { data: discipleship },
    { data: enrollments },
    { data: profile },
  ] = await Promise.all([
    supabase.from('discipleship_programs')
      .select('*, discipleship_stages(id, name, order_index, color), discipleship_courses(id, title, slug, description, level, duration_minutes, order_index, is_active)')
      .eq('slug', programSlug)
      .eq('is_active', true)
      .single(),
    user
      ? supabase.from('user_discipleship').select('*, discipleship_stages(*)').eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('user_course_enrollments').select('course_id, progress_pct, completed_at').eq('user_id', user.id)
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('profiles').select('role').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
  ])

  if (!program) notFound()

  const isLeader = ['admin', 'pastor', 'lider'].includes((profile as any)?.role ?? '')
  const currentStage = (discipleship?.discipleship_stages as any) ?? null
  const requiredStage = program.discipleship_stages as any
  const isLocked = !isLeader && user && requiredStage && (!currentStage || currentStage.order_index < requiredStage.order_index)

  const enrollmentMap = new Map(
    ((enrollments ?? []) as any[]).map((e: any) => [e.course_id, e])
  )

  const activeCourses = ((program.discipleship_courses as any[]) ?? [])
    .filter((c: any) => c.is_active)
    .sort((a: any, b: any) => a.order_index - b.order_index)

  // Guest view — public syllabus preview
  if (!user) {
    return (
      <div style={{ background: '#051828', minHeight: '100dvh', color: '#F6F3EB' }}>
        {/* Header */}
        <div className="relative overflow-hidden" style={{ borderBottom: '1px solid rgba(118,171,174,0.12)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.06), transparent 70%)' }} />
          <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-6">
            <Link href="/educacion/discipulado"
              className="inline-flex items-center gap-2 mb-6 text-xs font-bold"
              style={{ color: 'rgba(246,243,235,0.40)' }}>
              <ArrowLeft size={13} /> Discipulado
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.20)' }}>
                <BookOpen size={24} style={{ color: TEAL }} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-black tracking-tight mb-2"
                  style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', lineHeight: 1.05, color: '#F6F3EB' }}>
                  {program.title}
                </h1>
                {program.description && (
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.55)' }}>
                    {program.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(118,171,174,0.10)', color: `${TEAL}90` }}>
                    {activeCourses.length} curso{activeCourses.length !== 1 ? 's' : ''}
                  </span>
                  {requiredStage && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: `${requiredStage.color}15`, color: requiredStage.color, border: `1px solid ${requiredStage.color}30` }}>
                      Desde etapa {requiredStage.order_index} · {requiredStage.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus */}
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {activeCourses.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4"
                style={{ color: 'rgba(118,171,174,0.55)' }}>
                Contenido del programa
              </p>
              <div className="space-y-2">
                {activeCourses.map((course: any, idx: number) => (
                  <div key={course.id}
                    className="flex items-start gap-4 p-4 rounded-2xl"
                    style={{ background: 'rgba(118,171,174,0.05)', border: '1px solid rgba(118,171,174,0.12)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black"
                      style={{ background: 'rgba(118,171,174,0.10)', color: `${TEAL}70`, border: '1px solid rgba(118,171,174,0.15)' }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm mb-0.5" style={{ color: '#F6F3EB' }}>{course.title}</p>
                      {course.description && (
                        <p className="text-xs leading-relaxed line-clamp-2 mb-1.5"
                          style={{ color: 'rgba(246,243,235,0.45)' }}>{course.description}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {course.level && (
                          <span className="text-[10px] font-bold" style={{ color: 'rgba(246,243,235,0.30)' }}>
                            {LEVEL_LABEL[course.level] ?? course.level}
                          </span>
                        )}
                        {course.duration_minutes > 0 && (
                          <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(246,243,235,0.25)' }}>
                            <Clock size={9} /> {course.duration_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                    <Lock size={14} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0, marginTop: 3 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl p-8 text-center"
            style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}20` }}>
            <p className="font-black text-base mb-2" style={{ color: '#F6F3EB' }}>
              Accedé al contenido completo
            </p>
            <p className="text-sm mb-6" style={{ color: 'rgba(246,243,235,0.50)' }}>
              Creá una cuenta gratis para inscribirte en este programa y comenzar a aprender.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/registro"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-wider"
                style={{ background: TEAL, color: NAVY }}>
                Crear cuenta gratis <ArrowRight size={12} />
              </Link>
              <Link href={`/login?next=/educacion/discipulado/${programSlug}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider"
                style={{ border: '1px solid rgba(118,171,174,0.25)', color: 'rgba(246,243,235,0.55)' }}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated view
  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Header */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.06), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-6">
          <Link href="/app/discipulado"
            className="inline-flex items-center gap-2 mb-4 text-xs font-bold"
            style={{ color: 'rgba(246,243,235,0.40)' }}>
            <ArrowLeft size={13} /> Mi Discipulado
          </Link>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.20)' }}>
              <BookOpen size={22} style={{ color: TEAL }} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-black tracking-tight mb-1"
                style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', lineHeight: 1.1, color: '#F6F3EB' }}>
                {program.title}
              </h1>
              {program.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.50)' }}>
                  {program.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[11px] font-bold px-2 py-1 rounded-lg"
                  style={{ background: '#0D3352', color: 'rgba(246,243,235,0.50)' }}>
                  {activeCourses.length} curso{activeCourses.length !== 1 ? 's' : ''}
                </span>
                {requiredStage && (
                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: `${requiredStage.color}15`, color: requiredStage.color, border: `1px solid ${requiredStage.color}30` }}>
                    Desde etapa {requiredStage.order_index}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLocked ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <Lock size={28} style={{ color: 'rgba(246,243,235,0.20)', margin: '0 auto 12px' }} />
            <p className="font-bold text-sm mb-1" style={{ color: 'rgba(246,243,235,0.60)' }}>Programa bloqueado</p>
            <p className="text-xs" style={{ color: 'rgba(246,243,235,0.35)' }}>
              Necesitas estar en la etapa <span style={{ color: requiredStage.color }}>{requiredStage.name}</span> o superior
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCourses.map((course: any, idx: number) => {
              const enrollment = enrollmentMap.get(course.id)
              const isEnrolled = !!enrollment
              const isCompleted = !!enrollment?.completed_at
              const pct = enrollment?.progress_pct ?? 0

              return (
                <div key={course.id}>
                  {isEnrolled ? (
                    <Link
                      href={`/educacion/discipulado/${programSlug}/${course.slug}`}
                      className="block p-4 rounded-2xl transition hover:brightness-110"
                      style={{ background: '#0B2D47', border: `1px solid ${isCompleted ? 'rgba(118,171,174,0.30)' : '#0D3352'}` }}
                    >
                      <CourseCard course={course} pct={pct} isCompleted={isCompleted} idx={idx} enrollCta={false} />
                    </Link>
                  ) : (
                    <form action={enrollInCourse.bind(null, course.id)}>
                      <button type="submit" className="w-full text-left p-4 rounded-2xl transition hover:brightness-110"
                        style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                        <CourseCard course={course} pct={0} isCompleted={false} idx={idx} enrollCta />
                      </button>
                    </form>
                  )}
                </div>
              )
            })}

            {activeCourses.length === 0 && (
              <div className="py-12 text-center" style={{ color: 'rgba(246,243,235,0.35)' }}>
                <p className="text-sm">Este programa aún no tiene cursos</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function CourseCard({ course, pct, isCompleted, idx, enrollCta }: {
  course: any; pct: number; isCompleted: boolean; idx: number; enrollCta: boolean
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black"
        style={{
          background: isCompleted ? 'rgba(118,171,174,0.15)' : '#0D3352',
          color: isCompleted ? '#76ABAE' : 'rgba(246,243,235,0.30)',
          border: isCompleted ? '1px solid rgba(118,171,174,0.25)' : '1px solid #1A4A6E',
        }}>
        {isCompleted ? <CheckCircle2 size={18} style={{ color: '#76ABAE' }} /> : idx + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm mb-0.5 truncate" style={{ color: '#F6F3EB' }}>{course.title}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold" style={{ color: 'rgba(246,243,235,0.35)' }}>
            {LEVEL_LABEL[course.level] ?? course.level}
          </span>
          {course.duration_minutes > 0 && (
            <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(246,243,235,0.30)' }}>
              <Clock size={9} /> {course.duration_minutes} min
            </span>
          )}
          {isCompleted && <span className="text-[10px] font-black" style={{ color: '#76ABAE' }}>Completado</span>}
          {!isCompleted && pct > 0 && <span className="text-[10px] font-black" style={{ color: '#76ABAE' }}>{pct}%</span>}
        </div>
        {!isCompleted && pct > 0 && (
          <div className="w-full h-1 rounded-full mt-2" style={{ background: '#0D3352' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #093C5D, #76ABAE)' }} />
          </div>
        )}
        {enrollCta && (
          <p className="text-[11px] font-black mt-2 flex items-center gap-1" style={{ color: '#76ABAE' }}>
            Comenzar <ChevronRight size={11} />
          </p>
        )}
      </div>
      {!enrollCta && (
        <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0, marginTop: 2 }} />
      )}
    </div>
  )
}
