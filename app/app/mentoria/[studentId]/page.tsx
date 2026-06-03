import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle2, BookHeart, MessageSquarePlus } from 'lucide-react'
import { ObservationForm } from '@/components/lms/ObservationForm'

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify active mentor pair
  const { data: pair } = await supabase
    .from('discipleship_mentors')
    .select('id, status')
    .eq('mentor_id', user.id)
    .eq('student_id', studentId)
    .eq('status', 'active')
    .maybeSingle()

  if (!pair) notFound()

  const [
    { data: student },
    { data: discipleship },
    { data: enrollments },
    { data: reflections },
    { data: observations },
  ] = await Promise.all([
    supabase.from('profiles')
      .select('id, full_name, username, avatar_url')
      .eq('id', studentId)
      .single(),

    supabase.from('user_discipleship')
      .select('*, discipleship_stages(name, color, order_index)')
      .eq('user_id', studentId)
      .maybeSingle(),

    supabase.from('user_course_enrollments')
      .select(`
        progress_pct, completed_at, enrolled_at,
        discipleship_courses!inner(
          title, slug,
          discipleship_programs!inner(slug)
        )
      `)
      .eq('user_id', studentId)
      .order('enrolled_at', { ascending: false }),

    supabase.from('user_reflections')
      .select(`
        what_learned, god_spoke, must_change, must_apply, updated_at,
        discipleship_lessons!inner(title, discipleship_courses!inner(title))
      `)
      .eq('user_id', studentId)
      .eq('is_shared_with_mentor', true)
      .order('updated_at', { ascending: false })
      .limit(10),

    supabase.from('mentor_observations')
      .select('id, content, created_at')
      .eq('mentor_id', user.id)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }),
  ])

  if (!student) notFound()

  const stage = (discipleship as any)?.discipleship_stages ?? null
  const initial = student.full_name?.[0]?.toUpperCase() ?? 'U'

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/app/mentoria"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-black"
              style={{ background: '#0D3352', color: '#76ABAE' }}>
              {student.avatar_url
                ? <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                : initial}
            </div>
            <div className="min-w-0">
              <p className="font-black text-base truncate" style={{ color: '#F6F3EB' }}>{student.full_name}</p>
              {stage && (
                <span className="text-[10px] font-black"
                  style={{ color: stage.color }}>
                  Etapa {stage.order_index} · {stage.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* ── CURSOS ── */}
        {enrollments && enrollments.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-1.5"
              style={{ color: 'rgba(118,171,174,0.55)' }}>
              <BookOpen size={10} /> Progreso en cursos
            </p>
            <div className="space-y-2">
              {enrollments.map((e: any, i: number) => {
                const course  = e.discipleship_courses
                const isCompleted = !!e.completed_at
                return (
                  <div key={i} className="p-4 rounded-2xl"
                    style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-sm truncate flex-1 mr-3" style={{ color: '#F6F3EB' }}>
                        {course?.title}
                      </p>
                      {isCompleted
                        ? <CheckCircle2 size={15} style={{ color: '#76ABAE', flexShrink: 0 }} />
                        : <span className="text-xs font-black flex-shrink-0" style={{ color: '#76ABAE' }}>{e.progress_pct}%</span>
                      }
                    </div>
                    {!isCompleted && (
                      <div className="w-full h-1 rounded-full" style={{ background: '#0D3352' }}>
                        <div className="h-full rounded-full" style={{
                          width: `${e.progress_pct}%`,
                          background: 'linear-gradient(90deg, #093C5D, #76ABAE)',
                        }} />
                      </div>
                    )}
                    {isCompleted && (
                      <p className="text-[10px]" style={{ color: 'rgba(118,171,174,0.55)' }}>
                        Completado el {fmtDate(e.completed_at)}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── REFLEXIONES COMPARTIDAS ── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-1.5"
            style={{ color: 'rgba(118,171,174,0.55)' }}>
            <BookHeart size={10} /> Reflexiones compartidas
          </p>
          {!reflections || reflections.length === 0 ? (
            <div className="p-5 rounded-2xl text-center"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <p className="text-sm" style={{ color: 'rgba(246,243,235,0.35)' }}>
                Aún no hay reflexiones compartidas contigo.
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(246,243,235,0.25)' }}>
                Tu discípulo puede elegir compartirlas desde la lección.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reflections.map((r: any, i: number) => {
                const lesson  = r.discipleship_lessons
                const course  = lesson?.discipleship_courses
                const entries = [
                  { label: '¿Qué aprendió?', value: r.what_learned },
                  { label: '¿Qué le habló Dios?', value: r.god_spoke },
                  { label: '¿Qué necesita cambiar?', value: r.must_change },
                  { label: '¿Qué aplicará?', value: r.must_apply },
                ].filter(e => e.value)

                return (
                  <div key={i} className="rounded-2xl overflow-hidden"
                    style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                    <div className="px-4 py-3 flex items-center justify-between"
                      style={{ borderBottom: '1px solid #0D3352' }}>
                      <div>
                        <p className="text-xs font-black" style={{ color: '#F6F3EB' }}>{lesson?.title}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(246,243,235,0.35)' }}>{course?.title}</p>
                      </div>
                      <p className="text-[10px] flex-shrink-0 ml-3" style={{ color: 'rgba(246,243,235,0.30)' }}>
                        {fmtDate(r.updated_at)}
                      </p>
                    </div>
                    <div className="p-4 space-y-3">
                      {entries.map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[10px] font-black mb-1" style={{ color: 'rgba(118,171,174,0.55)' }}>{label}</p>
                          <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.75)' }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── OBSERVACIONES DEL MENTOR ── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-1.5"
            style={{ color: 'rgba(118,171,174,0.55)' }}>
            <MessageSquarePlus size={10} /> Mis observaciones
          </p>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <div className="p-4" style={{ borderBottom: '1px solid #0D3352' }}>
              <ObservationForm studentId={studentId} />
            </div>
            {observations && observations.length > 0 ? (
              <div className="divide-y" style={{ borderColor: '#0D3352' }}>
                {observations.map((obs: any) => (
                  <div key={obs.id} className="px-4 py-4">
                    <p className="text-sm leading-relaxed mb-2" style={{ color: 'rgba(246,243,235,0.80)' }}>
                      {obs.content}
                    </p>
                    <p className="text-[10px]" style={{ color: 'rgba(246,243,235,0.30)' }}>
                      {fmtDate(obs.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm" style={{ color: 'rgba(246,243,235,0.30)' }}>
                  Aún no tienes observaciones sobre este discípulo
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
