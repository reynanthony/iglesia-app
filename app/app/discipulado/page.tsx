import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, GraduationCap, User, Lock, ArrowRight, CheckCircle2, Award } from 'lucide-react'

export default async function DiscipuladoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: discipleship },
    { data: stages },
    { data: enrollments },
    { data: programs },
    { data: mentorPair },
    { count: certCount },
  ] = await Promise.all([
    supabase.from('user_discipleship').select('*, discipleship_stages(*)').eq('user_id', user.id).maybeSingle(),
    supabase.from('discipleship_stages').select('*').order('order_index'),
    supabase.from('user_course_enrollments')
      .select('*, discipleship_courses!inner(id, title, slug, discipleship_programs!inner(id, slug))')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false }),
    supabase.from('discipleship_programs')
      .select('*, discipleship_stages(id, order_index, name, color), discipleship_courses(id, title, slug, level, duration_minutes, is_active)')
      .eq('is_active', true)
      .order('order_index'),
    supabase.from('discipleship_mentors')
      .select('mentor_id, profiles!discipleship_mentors_mentor_id_fkey(full_name, avatar_url)')
      .eq('student_id', user.id).eq('status', 'active').maybeSingle(),
    supabase.from('discipleship_certificates')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  const currentStage  = (discipleship?.discipleship_stages as any) ?? null
  const totalCerts    = certCount ?? 0
  const sorted       = (stages ?? []).sort((a: any, b: any) => a.order_index - b.order_index)
  const mentor       = (mentorPair?.profiles as any) ?? null
  const nextStage    = currentStage
    ? sorted.find((s: any) => s.order_index === currentStage.order_index + 1) ?? null
    : sorted[0] ?? null

  const activeEnrollment = (enrollments ?? []).find((e: any) => !e.completed_at && e.progress_pct > 0)
    ?? (enrollments ?? []).find((e: any) => !e.completed_at)

  const enrolledCourseIds = new Set((enrollments ?? []).map((e: any) => e.course_id))

  const allPrograms = programs ?? []
  const myPrograms  = allPrograms.filter((p: any) => {
    const req = p.discipleship_stages
    if (!req) return true
    if (!currentStage) return false
    return currentStage.order_index >= req.order_index
  })
  const lockedPrograms = allPrograms.filter((p: any) => {
    const req = p.discipleship_stages
    return req && (!currentStage || currentStage.order_index < req.order_index)
  })

  const STAGE_DESC: Record<number, string> = {
    1: 'Estás conociendo la comunidad y dando tus primeros pasos en la fe.',
    2: 'Has comenzado un camino de fe genuino. Esta es la etapa más emocionante.',
    3: 'Estás aprendiendo las bases bíblicas que sostienen tu vida cristiana.',
    4: 'Has declarado públicamente tu fe a través del bautismo.',
    5: 'Estás sirviendo activamente y usando tus dones para edificar la comunidad.',
    6: 'Estás acompañando a otros en su camino, multiplicando lo que has recibido.',
    7: 'Eres un líder maduro que guía y equipa a otros con propósito y sabiduría.',
  }

  const NEXT_STEP: Record<number, string> = {
    1: 'Conversá con un pastor sobre tu decisión de fe y conocé la comunidad.',
    2: 'Completá los programas de Fundamentos y preparate para el bautismo en agua.',
    3: 'Tomá el paso del bautismo en agua como declaración pública de tu fe.',
    4: 'Encontrá tu área de servicio y comenzá a usar tus dones en la comunidad.',
    5: 'Comenzá a acompañar a alguien más joven en la fe — convertite en mentor.',
    6: 'Tu pastor te evaluará para avanzar a un rol de liderazgo formal.',
    7: '¡Llegaste a la etapa de liderazgo pleno! Seguí formando a otros.',
  }

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <h1 className="font-black tracking-tighter mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5.5vw, 2.8rem)', lineHeight: 0.95, color: '#F6F3EB' }}>
            Mi camino de<br /><span style={{ color: '#76ABAE' }}>Discipulado.</span>
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            {currentStage ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
                style={{ background: `${currentStage.color}18`, color: currentStage.color, border: `1px solid ${currentStage.color}35` }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                  style={{ background: currentStage.color, color: '#061E30' }}>
                  {currentStage.order_index}
                </span>
                {currentStage.name}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: '#0D3352', color: 'rgba(246,243,235,0.40)' }}>
                Sin etapa asignada
              </span>
            )}
            {mentor && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: '#0D3352', color: 'rgba(246,243,235,0.55)' }}>
                <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center" style={{ background: '#1A4A6E' }}>
                  {mentor.avatar_url
                    ? <img src={mentor.avatar_url} alt="" className="w-full h-full object-cover" />
                    : <User size={8} />}
                </div>
                Mentor: {mentor.full_name?.split(' ')[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* ── CONTINUAR ── */}
        {activeEnrollment && (() => {
          const course  = (activeEnrollment as any).discipleship_courses
          const program = course?.discipleship_programs
          const pct     = activeEnrollment.progress_pct ?? 0
          return (
            <section>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(118,171,174,0.55)' }}>
                Continuar
              </p>
              <Link href={`/educacion/discipulado/${program?.slug}/${course?.slug}`}
                className="block rounded-2xl overflow-hidden transition hover:brightness-110 group"
                style={{ background: 'linear-gradient(135deg, #0B2D47 0%, #093C5D 100%)', border: '1px solid rgba(118,171,174,0.25)' }}>
                {/* Barra teal superior */}
                <div className="h-[3px]" style={{ background: `linear-gradient(90deg, #76ABAE ${pct}%, #0D3352 ${pct}%)` }} />
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: 'rgba(118,171,174,0.55)' }}>
                    {program?.title}
                  </p>
                  <p className="font-black text-xl tracking-tight mb-4 leading-tight" style={{ color: '#F6F3EB' }}>
                    {course?.title}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="font-black tabular-nums" style={{ fontSize: '2.8rem', lineHeight: 1, color: '#76ABAE' }}>
                        {pct}<span className="text-2xl">%</span>
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: 'rgba(246,243,235,0.30)' }}>
                        {pct === 0 ? 'Sin comenzar' : 'Completado'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-black pb-1 group-hover:gap-2.5 transition-all"
                      style={{ color: '#76ABAE' }}>
                      {pct === 0 ? 'Comenzar' : 'Continuar'}
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )
        })()}

        {/* ── MI RUTA ── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(118,171,174,0.55)' }}>
            Mi ruta
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>

            {/* Barra de etapas */}
            <div className="p-5 pb-4">
              <div className="flex items-center mb-5">
                {sorted.map((stage: any, i: number) => {
                  const isCurrent = stage.id === currentStage?.id
                  const isDone    = currentStage && stage.order_index < currentStage.order_index
                  const isLast    = i === sorted.length - 1
                  return (
                    <div key={stage.id} className="flex items-center" style={{ flex: isLast ? 'none' : 1 }}>
                      <div title={stage.name}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0"
                        style={{
                          background: isCurrent ? stage.color : isDone ? `${stage.color}35` : '#0D3352',
                          border: isCurrent ? `2px solid ${stage.color}` : isDone ? `1px solid ${stage.color}40` : '1px solid #1A4A6E',
                          color: isCurrent ? '#061E30' : isDone ? stage.color : 'rgba(246,243,235,0.20)',
                        }}>
                        {isDone ? <CheckCircle2 size={14} /> : stage.order_index}
                      </div>
                      {!isLast && <div className="h-0.5 flex-1 mx-1" style={{ background: isDone ? `${stage.color}40` : '#0D3352' }} />}
                    </div>
                  )
                })}
              </div>

              {currentStage ? (
                <div>
                  <p className="font-black text-sm mb-1" style={{ color: currentStage.color }}>
                    {currentStage.order_index}. {currentStage.name}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(246,243,235,0.50)' }}>
                    {STAGE_DESC[currentStage.order_index]}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-center" style={{ color: 'rgba(246,243,235,0.35)' }}>
                  Un pastor asignará tu etapa pronto
                </p>
              )}
            </div>

            {/* Próximo paso */}
            {currentStage && currentStage.order_index < 7 && nextStage && (
              <div className="px-5 py-4" style={{ borderTop: '1px solid #0D3352', background: 'rgba(118,171,174,0.04)' }}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(118,171,174,0.50)' }}>
                  Próximo paso → {nextStage.name}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(246,243,235,0.45)' }}>
                  {NEXT_STEP[currentStage.order_index]}
                </p>
              </div>
            )}
            {currentStage?.order_index === 7 && (
              <div className="px-5 py-4" style={{ borderTop: '1px solid #0D3352', background: 'rgba(118,171,174,0.04)' }}>
                <p className="text-xs font-black" style={{ color: '#76ABAE' }}>
                  🎉 {NEXT_STEP[7]}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── PROGRAMAS PARA TU ETAPA ── */}
        {myPrograms.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(118,171,174,0.55)' }}>
              {currentStage ? 'Para tu etapa' : 'Programas disponibles'}
            </p>
            <div className="space-y-3">
              {myPrograms.map((p: any) => {
                const activeCourses  = (p.discipleship_courses ?? []).filter((c: any) => c.is_active)
                const enrolledCount  = activeCourses.filter((c: any) => enrolledCourseIds.has(c.id)).length
                const completedCount = (enrollments ?? []).filter((e: any) =>
                  e.completed_at && activeCourses.some((c: any) => c.id === e.course_id)
                ).length
                const progPct  = activeCourses.length > 0 ? Math.round((completedCount / activeCourses.length) * 100) : 0
                const allDone  = activeCourses.length > 0 && completedCount === activeCourses.length
                const started  = enrolledCount > 0 && !allDone
                const req      = p.discipleship_stages
                const isMyStage = req && currentStage && req.order_index === currentStage.order_index

                return (
                  <Link key={p.id} href={`/educacion/discipulado/${p.slug}`}
                    className="block rounded-2xl overflow-hidden transition hover:brightness-110 group"
                    style={{
                      background: '#0B2D47',
                      border: `1px solid ${allDone ? 'rgba(118,171,174,0.35)' : started ? '#1A4A6E' : '#0D3352'}`,
                    }}>

                    {/* Cabecera de la card */}
                    <div className="px-5 pt-5 pb-4"
                      style={{ background: allDone ? 'rgba(118,171,174,0.07)' : 'linear-gradient(135deg, rgba(26,74,110,0.5) 0%, transparent 100%)' }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {isMyStage && (
                            <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mb-2"
                              style={{ background: `${currentStage.color}22`, color: currentStage.color, border: `1px solid ${currentStage.color}35` }}>
                              Tu etapa
                            </span>
                          )}
                          <h3 className="font-black tracking-tight leading-tight"
                            style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', color: '#F6F3EB' }}>
                            {p.title}
                          </h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: allDone ? 'rgba(118,171,174,0.18)' : 'rgba(118,171,174,0.10)',
                            border: `1px solid ${allDone ? 'rgba(118,171,174,0.30)' : 'rgba(118,171,174,0.15)'}`,
                          }}>
                          {allDone
                            ? <CheckCircle2 size={22} style={{ color: '#76ABAE' }} />
                            : <GraduationCap size={22} style={{ color: '#76ABAE' }} />}
                        </div>
                      </div>
                    </div>

                    {/* Pie de la card */}
                    <div className="px-5 pb-4 pt-3 flex items-center justify-between gap-4"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-5">
                        <div>
                          <span className="font-black text-2xl tabular-nums leading-none"
                            style={{ color: allDone ? '#76ABAE' : '#F6F3EB' }}>
                            {activeCourses.length}
                          </span>
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5"
                            style={{ color: 'rgba(246,243,235,0.35)' }}>
                            curso{activeCourses.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {(started || allDone) && (
                          <div>
                            <span className="font-black text-2xl tabular-nums leading-none"
                              style={{ color: allDone ? '#76ABAE' : '#F6F3EB' }}>
                              {completedCount}
                            </span>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5"
                              style={{ color: 'rgba(246,243,235,0.35)' }}>
                              complet.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px] font-black group-hover:gap-2.5 transition-all"
                        style={{ color: '#76ABAE' }}>
                        {allDone ? 'Ver' : started ? 'Continuar' : 'Ver programa'}
                        <ArrowRight size={14} />
                      </div>
                    </div>

                    {/* Barra de progreso si está en curso */}
                    {started && (
                      <div className="h-1" style={{ background: '#0D3352' }}>
                        <div className="h-full" style={{ width: `${progPct}%`, background: 'linear-gradient(90deg, #1A4A6E, #76ABAE)' }} />
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── PROGRAMAS BLOQUEADOS ── */}
        {lockedPrograms.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(246,243,235,0.20)' }}>
              Próximamente en tu camino
            </p>
            <div className="space-y-2">
              {lockedPrograms.map((p: any) => {
                const req = p.discipleship_stages
                return (
                  <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352', opacity: 0.45 }}>
                    <div className="px-5 py-4 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(246,243,235,0.04)', border: '1px solid rgba(246,243,235,0.07)' }}>
                        <Lock size={18} style={{ color: 'rgba(246,243,235,0.20)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-base truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>{p.title}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.22)' }}>
                          Se desbloquea en etapa {req.order_index} · {req.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── CERTIFICADOS ── */}
        <Link href="/app/discipulado/certificados"
          className="block rounded-2xl overflow-hidden transition hover:brightness-110 group"
          style={{
            background: totalCerts > 0 ? 'linear-gradient(135deg, #0B2D47, #093C5D)' : '#0B2D47',
            border: `1px solid ${totalCerts > 0 ? 'rgba(118,171,174,0.30)' : '#0D3352'}`,
          }}>
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: totalCerts > 0 ? 'rgba(118,171,174,0.18)' : 'rgba(246,243,235,0.05)',
                border: `1px solid ${totalCerts > 0 ? 'rgba(118,171,174,0.28)' : 'rgba(246,243,235,0.08)'}`,
              }}>
              <Award size={22} style={{ color: totalCerts > 0 ? '#76ABAE' : 'rgba(246,243,235,0.22)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-base" style={{ color: totalCerts > 0 ? '#F6F3EB' : 'rgba(246,243,235,0.55)' }}>
                Mis certificados
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.38)' }}>
                {totalCerts > 0
                  ? `${totalCerts} certificado${totalCerts !== 1 ? 's' : ''} obtenido${totalCerts !== 1 ? 's' : ''}`
                  : 'Completa un programa para obtener tu primer certificado'}
              </p>
            </div>
            {totalCerts > 0 && (
              <div className="flex items-center gap-1 text-[13px] font-black group-hover:gap-2 transition-all"
                style={{ color: '#76ABAE' }}>
                Ver <ArrowRight size={14} />
              </div>
            )}
          </div>
        </Link>

      </div>
    </div>
  )
}
