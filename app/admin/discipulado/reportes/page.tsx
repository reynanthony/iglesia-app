import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Users, AlertTriangle, TrendingUp,
  BookOpen, CheckCircle2, Clock, UserX,
} from 'lucide-react'

export default async function ReportesDiscipuladoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor'].includes(profile.role)) redirect('/admin/discipulado')

  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const oneWeekAgo  = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: stages },
    { data: allProfiles },
    { data: allAssignments },
    { data: allEnrollments },
    { data: stagnantRaw },
    { data: recentCompletions },
    { data: activeMentorPairs },
    { data: allCourses },
  ] = await Promise.all([
    supabase.from('discipleship_stages').select('id, name, color, order_index').order('order_index'),

    supabase.from('profiles').select('id, full_name, username, avatar_url, role'),

    supabase.from('user_discipleship').select('user_id, stage_id, discipleship_stages(name, color, order_index)'),

    supabase.from('user_course_enrollments')
      .select('user_id, course_id, progress_pct, completed_at, enrolled_at'),

    // Estancados: inscriptos hace >14 días, progreso <20%, sin completar
    supabase.from('user_course_enrollments')
      .select(`
        user_id, progress_pct, enrolled_at,
        discipleship_courses!inner(title, discipleship_programs!inner(title))
      `)
      .lt('enrolled_at', twoWeeksAgo)
      .lt('progress_pct', 20)
      .is('completed_at', null)
      .limit(20),

    // Actividad reciente: lecciones completadas en los últimos 7 días
    supabase.from('user_lesson_completions')
      .select(`
        user_id, completed_at,
        discipleship_lessons!inner(title, discipleship_courses!inner(title))
      `)
      .gte('completed_at', oneWeekAgo)
      .order('completed_at', { ascending: false })
      .limit(15),

    supabase.from('discipleship_mentors').select('mentor_id, student_id, status').eq('status', 'active'),

    supabase.from('discipleship_courses')
      .select('id, title, discipleship_programs!inner(title)')
      .eq('is_active', true),
  ])

  // ── Derivaciones ──────────────────────────────────────────

  const profileMap = new Map((allProfiles ?? []).map((p: any) => [p.id, p]))
  const assignMap  = new Map((allAssignments ?? []).map((a: any) => [a.user_id, a]))

  const totalUsers  = allProfiles?.length ?? 0
  const withStage   = allAssignments?.length ?? 0
  const withoutStage = totalUsers - withStage

  // Count per stage
  const stageCounts = new Map<string, number>()
  ;(allAssignments ?? []).forEach((a: any) => {
    stageCounts.set(a.stage_id, (stageCounts.get(a.stage_id) ?? 0) + 1)
  })

  // Usuarios sin etapa (primeros 8)
  const unassignedUsers = (allProfiles ?? [])
    .filter((p: any) => !assignMap.has(p.id))
    .slice(0, 8)

  // Estancados: añadir nombre
  const stagnant = (stagnantRaw ?? []).map((e: any) => ({
    ...e,
    profile: profileMap.get(e.user_id),
  })).filter((e: any) => e.profile)

  // Mentores activos únicos
  const activeMentorIds = new Set((activeMentorPairs ?? []).map((p: any) => p.mentor_id))
  const activeStudentIds = new Set((activeMentorPairs ?? []).map((p: any) => p.student_id))
  const activeMentorCount  = activeMentorIds.size
  const activeStudentCount = activeStudentIds.size

  // Líderes/pastores sin discípulos asignados
  const leadersWithoutStudents = (allProfiles ?? [])
    .filter((p: any) =>
      ['lider', 'pastor', 'admin'].includes(p.role) &&
      !activeMentorIds.has(p.id)
    )
    .slice(0, 6)

  // Actividad reciente con nombres
  const recentActivity = (recentCompletions ?? []).map((r: any) => ({
    ...r,
    profile: profileMap.get(r.user_id),
  })).filter((r: any) => r.profile)

  // Cursos: más completados / más abandonados
  const courseCompletions = new Map<string, number>()
  const courseAbandon     = new Map<string, number>()
  ;(allEnrollments ?? []).forEach((e: any) => {
    if (e.completed_at)   courseCompletions.set(e.course_id, (courseCompletions.get(e.course_id) ?? 0) + 1)
    if (e.progress_pct === 0 && !e.completed_at)
      courseAbandon.set(e.course_id, (courseAbandon.get(e.course_id) ?? 0) + 1)
  })

  const courseMap = new Map((allCourses ?? []).map((c: any) => [c.id, c]))
  const topCompleted = [...courseCompletions.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, count]) => ({ course: courseMap.get(id), count }))
    .filter(c => c.course)

  const topAbandoned = [...courseAbandon.entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, count]) => ({ course: courseMap.get(id), count }))
    .filter(c => c.course)

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short' })
  }

  const maxStageCount = Math.max(...(stages ?? []).map((s: any) => stageCounts.get(s.id) ?? 0), 1)

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/discipulado"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Dashboard Pastoral</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
              Métricas de discipulado · Actualizado ahora
            </p>
          </div>
        </div>

        {/* ── RESUMEN GENERAL ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total miembros', value: totalUsers, icon: Users, color: '#76ABAE' },
            { label: 'Con etapa asignada', value: withStage, icon: TrendingUp, color: '#76ABAE' },
            { label: 'Sin etapa', value: withoutStage, icon: AlertTriangle, color: withoutStage > 0 ? '#F59E0B' : '#76ABAE' },
            { label: 'Pares de mentoría', value: activeMentorPairs?.length ?? 0, icon: BookOpen, color: '#76ABAE' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-4 rounded-2xl"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-wider"
                  style={{ color: 'rgba(246,243,235,0.35)' }}>{label}</p>
                <Icon size={14} style={{ color }} />
              </div>
              <p className="font-black text-3xl leading-none" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── DISTRIBUCIÓN POR ETAPA ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4"
            style={{ color: 'rgba(246,243,235,0.35)' }}>
            Distribución por etapa
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <div className="divide-y" style={{ borderColor: '#0D3352' }}>
              {(stages ?? []).map((stage: any) => {
                const count = stageCounts.get(stage.id) ?? 0
                const pct   = Math.round((count / Math.max(totalUsers, 1)) * 100)
                const barPct = Math.round((count / maxStageCount) * 100)
                return (
                  <div key={stage.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                      style={{ background: `${stage.color}20`, color: stage.color }}>
                      {stage.order_index}
                    </div>
                    <p className="text-sm font-bold w-40 flex-shrink-0 truncate" style={{ color: '#F6F3EB' }}>
                      {stage.name}
                    </p>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#0D3352' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${barPct}%`, background: stage.color, opacity: 0.7 }} />
                    </div>
                    <div className="flex items-center gap-2 w-20 flex-shrink-0 text-right justify-end">
                      <span className="font-black text-sm" style={{ color: stage.color }}>{count}</span>
                      <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.30)' }}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── ALERTAS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Sin etapa */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-1.5"
                style={{ color: withoutStage > 0 ? '#F59E0B' : 'rgba(246,243,235,0.35)' }}>
                <AlertTriangle size={10} /> Sin etapa ({withoutStage})
              </p>
              {withoutStage > 0 && (
                <Link href="/admin/discipulado"
                  className="text-[10px] font-bold"
                  style={{ color: 'rgba(118,171,174,0.60)' }}>
                  Asignar →
                </Link>
              )}
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              {unassignedUsers.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <CheckCircle2 size={18} style={{ color: '#76ABAE', margin: '0 auto 8px' }} />
                  <p className="text-xs" style={{ color: 'rgba(246,243,235,0.40)' }}>
                    Todos los miembros tienen etapa asignada
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: '#0D3352' }}>
                  {unassignedUsers.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ background: '#0D3352', color: '#76ABAE' }}>
                        {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : p.full_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{p.full_name}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(246,243,235,0.35)' }}>@{p.username}</p>
                      </div>
                    </div>
                  ))}
                  {withoutStage > 8 && (
                    <div className="px-4 py-2.5 text-center">
                      <Link href="/admin/discipulado" className="text-[10px] font-bold"
                        style={{ color: 'rgba(118,171,174,0.55)' }}>
                        +{withoutStage - 8} más →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Estancados */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-1.5"
                style={{ color: stagnant.length > 0 ? '#F59E0B' : 'rgba(246,243,235,0.35)' }}>
                <Clock size={10} /> Estancados +14 días ({stagnant.length})
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              {stagnant.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <CheckCircle2 size={18} style={{ color: '#76ABAE', margin: '0 auto 8px' }} />
                  <p className="text-xs" style={{ color: 'rgba(246,243,235,0.40)' }}>
                    No hay alumnos estancados
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: '#0D3352' }}>
                  {stagnant.map((e: any, i: number) => {
                    const course  = (e as any).discipleship_courses
                    const program = course?.discipleship_programs
                    return (
                      <div key={i} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-[9px] font-black flex-shrink-0"
                            style={{ background: '#0D3352', color: '#76ABAE' }}>
                            {e.profile?.full_name?.[0]?.toUpperCase()}
                          </div>
                          <p className="text-xs font-bold truncate" style={{ color: '#F6F3EB' }}>{e.profile?.full_name}</p>
                          <span className="text-[10px] font-black ml-auto flex-shrink-0"
                            style={{ color: '#F59E0B' }}>{e.progress_pct}%</span>
                        </div>
                        <p className="text-[10px] truncate pl-7" style={{ color: 'rgba(246,243,235,0.35)' }}>
                          {program?.title} · {course?.title}
                        </p>
                        <p className="text-[10px] pl-7 mt-0.5" style={{ color: 'rgba(246,243,235,0.25)' }}>
                          Inscripto el {fmtDate(e.enrolled_at)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

        </div>

        {/* ── MENTORÍA: LÍDERES SIN DISCÍPULOS ── */}
        {leadersWithoutStudents.length > 0 && (
          <section>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5"
              style={{ color: 'rgba(246,243,235,0.35)' }}>
              <UserX size={10} /> Líderes disponibles para mentorear ({leadersWithoutStudents.length})
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: '#0D3352' }}>
                {leadersWithoutStudents.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: '#0D3352', color: '#76ABAE' }}>
                      {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : p.full_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{p.full_name}</p>
                      <p className="text-[10px] capitalize" style={{ color: 'rgba(246,243,235,0.35)' }}>{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #0D3352' }} className="px-4 py-2.5">
                <Link href="/admin/discipulado/mentores"
                  className="text-[10px] font-bold"
                  style={{ color: 'rgba(118,171,174,0.60)' }}>
                  Asignar discípulos →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── ACTIVIDAD RECIENTE ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5"
            style={{ color: 'rgba(246,243,235,0.35)' }}>
            <TrendingUp size={10} /> Lecciones completadas esta semana ({recentActivity.length})
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            {recentActivity.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-xs" style={{ color: 'rgba(246,243,235,0.35)' }}>
                  Sin actividad en los últimos 7 días
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#0D3352' }}>
                {recentActivity.map((r: any, i: number) => {
                  const lesson = r.discipleship_lessons
                  const course = lesson?.discipleship_courses
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ background: '#0D3352', color: '#76ABAE' }}>
                        {r.profile?.avatar_url
                          ? <img src={r.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                          : r.profile?.full_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: '#F6F3EB' }}>
                          {r.profile?.full_name}
                          <span className="font-normal" style={{ color: 'rgba(246,243,235,0.40)' }}> completó </span>
                          {lesson?.title}
                        </p>
                        <p className="text-[10px] truncate mt-0.5" style={{ color: 'rgba(246,243,235,0.30)' }}>
                          {course?.title}
                        </p>
                      </div>
                      <p className="text-[10px] flex-shrink-0" style={{ color: 'rgba(246,243,235,0.30)' }}>
                        {fmtDate(r.completed_at)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── CURSOS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <section>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5"
              style={{ color: 'rgba(246,243,235,0.35)' }}>
              <CheckCircle2 size={10} /> Más completados
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              {topCompleted.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs" style={{ color: 'rgba(246,243,235,0.35)' }}>Sin completaciones aún</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: '#0D3352' }}>
                  {topCompleted.map(({ course, count }: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-[10px] font-black w-4 flex-shrink-0"
                        style={{ color: '#76ABAE' }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{course.title}</p>
                        <p className="text-[10px] truncate" style={{ color: 'rgba(246,243,235,0.35)' }}>
                          {course.discipleship_programs?.title}
                        </p>
                      </div>
                      <span className="font-black text-sm flex-shrink-0" style={{ color: '#76ABAE' }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5"
              style={{ color: 'rgba(246,243,235,0.35)' }}>
              <AlertTriangle size={10} /> Sin iniciar (posible abandono)
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              {topAbandoned.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs" style={{ color: 'rgba(246,243,235,0.35)' }}>Sin datos aún</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: '#0D3352' }}>
                  {topAbandoned.map(({ course, count }: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-[10px] font-black w-4 flex-shrink-0"
                        style={{ color: '#F59E0B' }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{course.title}</p>
                        <p className="text-[10px] truncate" style={{ color: 'rgba(246,243,235,0.35)' }}>
                          {course.discipleship_programs?.title}
                        </p>
                      </div>
                      <span className="font-black text-sm flex-shrink-0" style={{ color: '#F59E0B' }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
