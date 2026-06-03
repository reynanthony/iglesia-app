import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react'

export default async function MentoriaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pairs } = await supabase
    .from('discipleship_mentors')
    .select(`
      id, status,
      profiles!discipleship_mentors_student_id_fkey(
        id, full_name, username, avatar_url
      )
    `)
    .eq('mentor_id', user.id)
    .eq('status', 'active')
    .order('assigned_at', { ascending: false })

  const students = (pairs ?? []).map((p: any) => p.profiles).filter(Boolean)
  const studentIds = students.map((s: any) => s.id)

  const [{ data: discipleships }, { data: enrollments }] = await Promise.all([
    studentIds.length
      ? supabase.from('user_discipleship')
          .select('user_id, discipleship_stages(name, color, order_index)')
          .in('user_id', studentIds)
      : Promise.resolve({ data: [] }),
    studentIds.length
      ? supabase.from('user_course_enrollments')
          .select('user_id, progress_pct, completed_at')
          .in('user_id', studentIds)
      : Promise.resolve({ data: [] }),
  ])

  const stageMap    = new Map((discipleships ?? []).map((d: any) => [d.user_id, d.discipleship_stages]))
  const enrollMap   = new Map<string, any[]>()
  ;(enrollments ?? []).forEach((e: any) => {
    if (!enrollMap.has(e.user_id)) enrollMap.set(e.user_id, [])
    enrollMap.get(e.user_id)!.push(e)
  })

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <h1 className="font-black tracking-tighter mb-1"
            style={{ fontSize: 'clamp(1.8rem, 5.5vw, 2.8rem)', lineHeight: 0.95, color: '#F6F3EB' }}>
            Mis discípulos.
          </h1>
          <p className="text-sm mt-2" style={{ color: 'rgba(246,243,235,0.40)' }}>
            {students.length === 0
              ? 'Aún no tienes discípulos asignados'
              : `${students.length} discípulo${students.length !== 1 ? 's' : ''} activo${students.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {students.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <Users size={24} style={{ color: 'rgba(118,171,174,0.40)' }} />
            </div>
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.35)' }}>
              Un pastor o líder te asignará discípulos cuando estés listo para acompañar a otros.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {(pairs ?? []).map((pair: any) => {
              const student  = pair.profiles
              if (!student) return null
              const stage    = stageMap.get(student.id)
              const myEnroll = enrollMap.get(student.id) ?? []
              const active   = myEnroll.filter((e: any) => !e.completed_at)
              const done     = myEnroll.filter((e: any) => e.completed_at)
              const avgPct   = active.length
                ? Math.round(active.reduce((s: number, e: any) => s + e.progress_pct, 0) / active.length)
                : 0

              return (
                <Link
                  key={pair.id}
                  href={`/app/mentoria/${student.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl transition hover:brightness-110"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-black text-lg"
                    style={{ background: '#0D3352', color: '#76ABAE' }}>
                    {student.avatar_url
                      ? <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                      : student.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: '#F6F3EB' }}>
                      {student.full_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {stage ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${stage.color}18`, color: stage.color }}>
                          {stage.order_index}. {stage.name}
                        </span>
                      ) : (
                        <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.30)' }}>Sin etapa</span>
                      )}
                      {active.length > 0 && (
                        <span className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(246,243,235,0.40)' }}>
                          <BookOpen size={9} /> {active.length} en curso · {avgPct}%
                        </span>
                      )}
                      {done.length > 0 && (
                        <span className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(118,171,174,0.60)' }}>
                          <CheckCircle2 size={9} /> {done.length} completado{done.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.25)', flexShrink: 0 }} />
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
