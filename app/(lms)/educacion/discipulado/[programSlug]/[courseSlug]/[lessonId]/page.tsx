import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, CheckCircle2, Video, FileText, BookMarked, Zap } from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import { markLessonComplete } from '@/app/actions/discipleship-lms'
import { ReflectionForm } from '@/components/lms/ReflectionForm'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ programSlug: string; courseSlug: string; lessonId: string }>
}) {
  const { programSlug, courseSlug, lessonId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lesson } = await supabase
    .from('discipleship_lessons')
    .select(`
      *,
      discipleship_courses!inner(
        id, title, slug, is_active,
        discipleship_programs!inner(id, title, slug)
      )
    `)
    .eq('id', lessonId)
    .eq('discipleship_courses.slug', courseSlug)
    .eq('discipleship_courses.discipleship_programs.slug', programSlug)
    .eq('is_active', true)
    .single()

  if (!lesson) notFound()

  const course  = lesson.discipleship_courses as any
  const program = course?.discipleship_programs as any

  const [
    { data: allLessons },
    { data: verses },
    { data: challenges },
    { data: completion },
    { data: reflection },
    { data: mentorPair },
  ] = await Promise.all([
    supabase.from('discipleship_lessons')
      .select('id, title, order_index')
      .eq('course_id', course.id)
      .eq('is_active', true)
      .order('order_index'),
    supabase.from('lesson_bible_verses')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index'),
    supabase.from('lesson_challenges')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index'),
    supabase.from('user_lesson_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle(),
    supabase.from('user_reflections')
      .select('what_learned, god_spoke, must_change, must_apply, is_shared_with_mentor')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle(),
    supabase.from('discipleship_mentors')
      .select('id')
      .eq('student_id', user.id)
      .eq('status', 'active')
      .maybeSingle(),
  ])

  const isCompleted = !!completion
  const hasMentor   = !!mentorPair
  const sortedLessons = (allLessons ?? []).sort((a: any, b: any) => a.order_index - b.order_index)
  const currentIdx   = sortedLessons.findIndex((l: any) => l.id === lessonId)
  const prevLesson   = currentIdx > 0 ? sortedLessons[currentIdx - 1] : null
  const nextLesson   = currentIdx < sortedLessons.length - 1 ? sortedLessons[currentIdx + 1] : null

  const htmlBody = lesson.body
    ? DOMPurify.sanitize(await marked.parse(lesson.body as string, { breaks: true }))
    : null

  const completeAction = markLessonComplete.bind(null, lessonId, course.id)

  function getEmbedUrl(url: string): string | null {
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
        const vid = u.searchParams.get('v') ?? u.pathname.split('/').pop()
        return vid ? `https://www.youtube.com/embed/${vid}` : null
      }
      if (u.hostname.includes('vimeo.com')) {
        const id = u.pathname.split('/').pop()
        return id ? `https://player.vimeo.com/video/${id}` : null
      }
    } catch { return null }
    return null
  }

  const embedUrl = lesson.video_url ? getEmbedUrl(lesson.video_url) : null

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #0D3352', background: '#061E30' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/educacion/discipulado/${programSlug}/${courseSlug}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold truncate" style={{ color: 'rgba(246,243,235,0.35)' }}>
              {course.title}
            </p>
            <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{lesson.title}</p>
          </div>
          {isCompleted && (
            <CheckCircle2 size={18} style={{ color: '#76ABAE', flexShrink: 0 }} />
          )}
        </div>

        {/* Progress bar within course */}
        {sortedLessons.length > 1 && (
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="flex gap-1">
              {sortedLessons.map((l: any, i: number) => (
                <div key={l.id} className="h-0.5 flex-1 rounded-full"
                  style={{ background: i <= currentIdx ? '#76ABAE' : '#0D3352' }} />
              ))}
            </div>
            <p className="text-[10px] mt-1.5 text-right" style={{ color: 'rgba(246,243,235,0.30)' }}>
              {currentIdx + 1} / {sortedLessons.length}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* â”€â”€ Video â”€â”€ */}
        {embedUrl && (
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Video link si no es YouTube/Vimeo */}
        {lesson.video_url && !embedUrl && (
          <a href={lesson.video_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition hover:brightness-110"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <Video size={18} style={{ color: '#76ABAE' }} />
            <span className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Ver video</span>
            <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.30)', marginLeft: 'auto' }} />
          </a>
        )}

        {/* â”€â”€ PDF â”€â”€ */}
        {lesson.pdf_url && (
          <a href={lesson.pdf_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition hover:brightness-110"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <FileText size={18} style={{ color: '#76ABAE' }} />
            <span className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Descargar material</span>
            <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.30)', marginLeft: 'auto' }} />
          </a>
        )}

        {/* â”€â”€ Contenido â”€â”€ */}
        {htmlBody && (
          <div className="prose-lesson" dangerouslySetInnerHTML={{ __html: htmlBody }} />
        )}

        {/* â”€â”€ VersÃ­culos â”€â”€ */}
        {verses && verses.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5"
              style={{ color: 'rgba(118,171,174,0.55)' }}>
              <BookMarked size={10} /> VersÃ­culos base
            </p>
            <div className="space-y-2">
              {verses.map((v: any) => (
                <div key={v.id} className="p-4 rounded-2xl"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                  <p className="text-xs font-black mb-1.5" style={{ color: '#76ABAE' }}>{v.reference}</p>
                  <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(246,243,235,0.75)' }}>
                    &ldquo;{v.verse_text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* â”€â”€ DesafÃ­os â”€â”€ */}
        {challenges && challenges.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5"
              style={{ color: 'rgba(118,171,174,0.55)' }}>
              <Zap size={10} /> DesafÃ­os prÃ¡cticos
            </p>
            <div className="space-y-2">
              {challenges.map((c: any) => (
                <div key={c.id} className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-black mt-0.5"
                    style={{ background: 'rgba(118,171,174,0.12)', color: '#76ABAE' }}>
                    S{c.week_number}
                  </div>
                  <p className="text-sm leading-relaxed pt-1" style={{ color: 'rgba(246,243,235,0.80)' }}>
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Diario de reflexión ── */}
        <ReflectionForm lessonId={lessonId} initial={reflection ?? null} hasMentor={hasMentor} />

        {/* ── Marcar completada ── */}
        {!isCompleted ? (
          <form action={completeAction}>
            <button type="submit"
              className="w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #093C5D, #76ABAE)', color: '#F6F3EB' }}>
              <CheckCircle2 size={18} />
              Marcar como completada
            </button>
          </form>
        ) : (
          <div className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.25)' }}>
            <CheckCircle2 size={16} style={{ color: '#76ABAE' }} />
            <span className="text-sm font-black" style={{ color: '#76ABAE' }}>LecciÃ³n completada</span>
          </div>
        )}

        {/* â”€â”€ NavegaciÃ³n prev/next â”€â”€ */}
        <div className="flex gap-3">
          {prevLesson ? (
            <Link
              href={`/educacion/discipulado/${programSlug}/${courseSlug}/${prevLesson.id}`}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl transition hover:brightness-110"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
            >
              <ArrowLeft size={13} style={{ color: 'rgba(246,243,235,0.40)' }} />
              <div className="min-w-0">
                <p className="text-[10px]" style={{ color: 'rgba(246,243,235,0.35)' }}>Anterior</p>
                <p className="text-xs font-bold truncate" style={{ color: '#F6F3EB' }}>{prevLesson.title}</p>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {nextLesson ? (
            <Link
              href={`/educacion/discipulado/${programSlug}/${courseSlug}/${nextLesson.id}`}
              className="flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-xl transition hover:brightness-110"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
            >
              <div className="min-w-0 text-right">
                <p className="text-[10px]" style={{ color: 'rgba(246,243,235,0.35)' }}>Siguiente</p>
                <p className="text-xs font-bold truncate" style={{ color: '#F6F3EB' }}>{nextLesson.title}</p>
              </div>
              <ChevronRight size={13} style={{ color: 'rgba(246,243,235,0.40)' }} />
            </Link>
          ) : (
            <Link
              href={`/educacion/discipulado/${programSlug}/${courseSlug}`}
              className="flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-xl transition hover:brightness-110"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
            >
              <div className="text-right">
                <p className="text-[10px]" style={{ color: 'rgba(246,243,235,0.35)' }}>Finalizar</p>
                <p className="text-xs font-bold" style={{ color: '#76ABAE' }}>Ver todos los cursos</p>
              </div>
              <ChevronRight size={13} style={{ color: '#76ABAE' }} />
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

