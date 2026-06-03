import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, Video, FileText, ChevronRight, BookOpen } from 'lucide-react'
import { enrollInCourse } from '@/app/actions/discipleship-lms'

export default async function CoursePage({ params }: { params: Promise<{ programSlug: string; courseSlug: string }> }) {
  const { programSlug, courseSlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('discipleship_courses')
    .select('*, discipleship_programs!inner(id, title, slug)')
    .eq('slug', courseSlug)
    .eq('discipleship_programs.slug', programSlug)
    .eq('is_active', true)
    .single()

  if (!course) notFound()

  const program = course.discipleship_programs as any

  const [{ data: lessons }, { data: enrollment }, { data: completions }] = await Promise.all([
    supabase.from('discipleship_lessons')
      .select('id, title, order_index, video_url, pdf_url, is_active')
      .eq('course_id', course.id)
      .eq('is_active', true)
      .order('order_index'),
    supabase.from('user_course_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle(),
    supabase.from('user_lesson_completions')
      .select('lesson_id')
      .eq('user_id', user.id),
  ])

  const completedIds = new Set((completions ?? []).map((c: any) => c.lesson_id))
  const isEnrolled = !!enrollment
  const pct = enrollment?.progress_pct ?? 0
  const isCompleted = !!enrollment?.completed_at
  const lastLessonId = enrollment?.last_lesson_id

  const activeLessons = (lessons ?? []).sort((a: any, b: any) => a.order_index - b.order_index)
  const nextLesson = activeLessons.find((l: any) => !completedIds.has(l.id)) ?? activeLessons[0]

  const LEVEL_LABEL: Record<string, string> = {
    basico: 'BÃ¡sico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
  }

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Header */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.06), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-6">
          <Link href={`/educacion/discipulado/${programSlug}`}
            className="inline-flex items-center gap-2 mb-4 text-xs font-bold"
            style={{ color: 'rgba(246,243,235,0.40)' }}>
            <ArrowLeft size={13} /> {program.title}
          </Link>

          <h1 className="font-black tracking-tight mb-2"
            style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', lineHeight: 1.1, color: '#F6F3EB' }}>
            {course.title}
          </h1>

          {course.description && (
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(246,243,235,0.50)' }}>
              {course.description}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2 py-1 rounded-lg"
              style={{ background: '#0D3352', color: 'rgba(246,243,235,0.45)' }}>
              {activeLessons.length} lecciÃ³n{activeLessons.length !== 1 ? 'es' : ''}
            </span>
            {course.level && (
              <span className="text-[11px] font-bold px-2 py-1 rounded-lg"
                style={{ background: '#0D3352', color: 'rgba(246,243,235,0.45)' }}>
                {LEVEL_LABEL[course.level] ?? course.level}
              </span>
            )}
            {isEnrolled && (
              <span className="text-[11px] font-black px-2 py-1 rounded-lg"
                style={{ background: isCompleted ? 'rgba(118,171,174,0.15)' : '#0D3352', color: isCompleted ? '#76ABAE' : 'rgba(246,243,235,0.45)' }}>
                {isCompleted ? 'Completado' : `${pct}% completado`}
              </span>
            )}
          </div>

          {isEnrolled && !isCompleted && pct > 0 && (
            <div className="w-full h-1.5 rounded-full mt-3" style={{ background: '#0D3352' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #093C5D, #76ABAE)' }} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* CTA si no estÃ¡ inscripto */}
        {!isEnrolled && nextLesson && (
          <form action={enrollInCourse.bind(null, course.id)}>
            <button type="submit"
              className="w-full flex items-center justify-between p-4 rounded-2xl transition hover:brightness-110"
              style={{ background: 'rgba(118,171,174,0.12)', border: '1px solid rgba(118,171,174,0.25)' }}>
              <div className="flex items-center gap-3">
                <BookOpen size={18} style={{ color: '#76ABAE' }} />
                <span className="font-bold text-sm" style={{ color: '#F6F3EB' }}>Comenzar este curso</span>
              </div>
              <ChevronRight size={15} style={{ color: '#76ABAE' }} />
            </button>
          </form>
        )}

        {/* CTA continuar */}
        {isEnrolled && !isCompleted && nextLesson && (
          <Link
            href={`/educacion/discipulado/${programSlug}/${courseSlug}/${nextLesson.id}`}
            className="flex items-center justify-between p-4 rounded-2xl transition hover:brightness-110"
            style={{ background: 'rgba(118,171,174,0.12)', border: '1px solid rgba(118,171,174,0.25)' }}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} style={{ color: '#76ABAE' }} />
              <div>
                <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>
                  {pct === 0 ? 'Comenzar curso' : 'Continuar donde lo dejÃ©'}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>{nextLesson.title}</p>
              </div>
            </div>
            <ChevronRight size={15} style={{ color: '#76ABAE' }} />
          </Link>
        )}

        {/* Lista de lecciones */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: '#0D3352' }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(118,171,174,0.55)' }}>
              Lecciones
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: '#0D3352' }}>
            {activeLessons.map((lesson: any, idx: number) => {
              const done = completedIds.has(lesson.id)
              const isCurrent = lesson.id === lastLessonId && !done
              return (
                <Link
                  key={lesson.id}
                  href={`/educacion/discipulado/${programSlug}/${courseSlug}/${lesson.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:brightness-110"
                  style={{ background: isCurrent ? 'rgba(118,171,174,0.04)' : 'transparent' }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: done ? 'rgba(118,171,174,0.15)' : isCurrent ? 'rgba(118,171,174,0.10)' : '#0D3352' }}>
                    {done
                      ? <CheckCircle2 size={16} style={{ color: '#76ABAE' }} />
                      : <span className="text-[11px] font-black" style={{ color: isCurrent ? '#76ABAE' : 'rgba(246,243,235,0.25)' }}>{idx + 1}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate"
                      style={{ color: done ? 'rgba(246,243,235,0.60)' : '#F6F3EB' }}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {lesson.video_url && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(118,171,174,0.55)' }}>
                          <Video size={9} /> Video
                        </span>
                      )}
                      {lesson.pdf_url && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(118,171,174,0.55)' }}>
                          <FileText size={9} /> PDF
                        </span>
                      )}
                      {isCurrent && <span className="text-[10px] font-black" style={{ color: '#76ABAE' }}>En progreso</span>}
                    </div>
                  </div>
                  <ChevronRight size={13} style={{ color: 'rgba(246,243,235,0.20)', flexShrink: 0 }} />
                </Link>
              )
            })}
          </div>
        </div>

        {activeLessons.length === 0 && (
          <div className="py-12 text-center" style={{ color: 'rgba(246,243,235,0.35)' }}>
            <p className="text-sm">Este curso aÃºn no tiene lecciones</p>
          </div>
        )}
      </div>
    </div>
  )
}

