import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Plus, GraduationCap, Trash2, ChevronRight, Award, CheckCircle2 } from 'lucide-react'
import { updateProgram, deleteProgram, createCourse, issueCertificate, revokeCertificate } from '@/app/actions/discipleship-lms'

export default async function EditProgramaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: program }, { data: stages }, { data: courses }, { data: certificates }] = await Promise.all([
    supabase
      .from('discipleship_programs')
      .select('*, discipleship_stages(id, name)')
      .eq('id', id)
      .single(),
    supabase.from('discipleship_stages').select('id, name, order_index').order('order_index'),
    supabase
      .from('discipleship_courses')
      .select('*, discipleship_lessons(id)')
      .eq('program_id', id)
      .order('order_index'),
    supabase
      .from('discipleship_certificates')
      .select('id, issued_at, user_id, profiles!discipleship_certificates_user_id_fkey(id, full_name, username, avatar_url)')
      .eq('program_id', id)
      .order('issued_at', { ascending: false }),
  ])

  if (!program) notFound()

  // Find users who have completed every active course in this program
  const activeCourseIds = (courses ?? []).filter((c: any) => c.is_active).map((c: any) => c.id)
  const certUserIds     = new Set((certificates ?? []).map((c: any) => c.user_id))

  let eligibleUsers: { id: string; full_name: string; username: string; avatar_url: string | null }[] = []
  if (activeCourseIds.length > 0) {
    const { data: completedEnrollments } = await supabase
      .from('user_course_enrollments')
      .select('user_id, course_id, profiles!inner(id, full_name, username, avatar_url)')
      .in('course_id', activeCourseIds)
      .not('completed_at', 'is', null)

    // Group by user_id and count completions
    const byUser = new Map<string, { profile: any; count: number }>()
    for (const e of completedEnrollments ?? []) {
      const existing = byUser.get(e.user_id)
      if (existing) {
        existing.count++
      } else {
        byUser.set(e.user_id, { profile: (e as any).profiles, count: 1 })
      }
    }
    // Keep only users who completed ALL active courses and don't have a cert yet
    for (const [userId, { profile, count }] of byUser.entries()) {
      if (count >= activeCourseIds.length && !certUserIds.has(userId)) {
        eligibleUsers.push(profile)
      }
    }
  }

  const saveAction = updateProgram.bind(null, id)
  const deleteAction = deleteProgram.bind(null, id)
  const newCourseAction = createCourse.bind(null, id)

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.68)' }

  const LEVELS: Record<string, string> = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/discipulado/programas"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.68)' }} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs mb-0.5" style={{ color: 'rgba(246,243,235,0.62)' }}>
              <Link href="/admin/discipulado" className="hover:underline">Discipulado</Link>
              <span>/</span>
              <Link href="/admin/discipulado/programas" className="hover:underline">Programas</Link>
              <span>/</span>
              <span className="truncate">{program.title}</span>
            </div>
            <h1 className="font-bold text-lg truncate" style={{ color: '#F6F3EB' }}>{program.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">

        {/* ── Editar programa ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.62)' }}>
            Datos del programa
          </p>
          <div className="rounded-2xl p-5 space-y-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <form action={saveAction} className="space-y-4">

              <div>
                <label className={label} style={labelStyle}>Título *</label>
                <input name="title" required defaultValue={program.title}
                  className={field} style={fieldStyle} />
              </div>

              <div>
                <label className={label} style={labelStyle}>Descripción</label>
                <textarea name="description" rows={3} defaultValue={program.description ?? ''}
                  className={`${field} resize-none`} style={fieldStyle} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={label} style={labelStyle}>Etapa requerida</label>
                  <select name="required_stage_id" defaultValue={program.required_stage_id ?? ''}
                    className={field} style={fieldStyle}>
                    <option value="">Ninguna</option>
                    {stages?.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.order_index}. {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} style={labelStyle}>Orden</label>
                  <input name="order_index" type="number" defaultValue={program.order_index}
                    className={field} style={fieldStyle} />
                </div>
                <div>
                  <label className={label} style={labelStyle}>Estado</label>
                  <select name="is_active" defaultValue={program.is_active ? 'true' : 'false'}
                    className={field} style={fieldStyle}>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold"
                style={{ background: '#F6F3EB', color: '#061E30' }}>
                Guardar cambios
              </button>
            </form>
            <form action={deleteAction} className="mt-2">
              <button type="submit"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                <Trash2 size={13} /> Eliminar programa
              </button>
            </form>
          </div>
        </section>

        {/* ── Cursos ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.62)' }}>
            Cursos ({courses?.length ?? 0})
          </p>

          {courses && courses.length > 0 && (
            <div className="space-y-2 mb-4">
              {courses.map((c: any) => {
                const lessonCount = c.discipleship_lessons?.length ?? 0
                return (
                  <Link
                    key={c.id}
                    href={`/admin/discipulado/cursos/${c.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 rounded-xl transition hover:brightness-110"
                    style={{ background: '#061E30', border: '1px solid #0D3352' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                      style={{ background: '#0D3352', color: '#76ABAE' }}
                    >
                      {c.order_index}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{c.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
                          {lessonCount} lección{lessonCount !== 1 ? 'es' : ''}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: '#0D3352', color: 'rgba(246,243,235,0.50)' }}>
                          {LEVELS[c.level] ?? c.level}
                        </span>
                        {!c.is_active && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(248,113,113,0.12)', color: '#F87171' }}>
                            Inactivo
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

          {/* Nuevo curso */}
          <div className="rounded-2xl p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.62)' }}>
              <Plus size={10} className="inline mr-1" />
              Nuevo curso
            </p>
            <form action={newCourseAction} className="space-y-4">
              <div>
                <label className={label} style={labelStyle}>Título *</label>
                <input name="title" required placeholder="Ej: Salvación"
                  className={field} style={fieldStyle} />
              </div>
              <div>
                <label className={label} style={labelStyle}>Descripción</label>
                <textarea name="description" rows={2}
                  placeholder="¿Qué aprenderán en este curso?"
                  className={`${field} resize-none`} style={fieldStyle} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={label} style={labelStyle}>Autor</label>
                  <input name="author" placeholder="Ej: Pastor Principal"
                    className={field} style={fieldStyle} />
                </div>
                <div>
                  <label className={label} style={labelStyle}>Nivel</label>
                  <select name="level" className={field} style={fieldStyle}>
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className={label} style={labelStyle}>Orden</label>
                  <input name="order_index" type="number" defaultValue={(courses?.length ?? 0) + 1}
                    className={field} style={fieldStyle} />
                </div>
              </div>
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: 'rgba(118,171,174,0.15)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.25)' }}>
                <GraduationCap size={14} /> Crear curso
              </button>
            </form>
          </div>
        </section>

        {/* ── Certificaciones ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.62)' }}>
            Certificaciones
          </p>

          {/* Pending issuance */}
          {eligibleUsers.length > 0 && (
            <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.25)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(118,171,174,0.15)' }}>
                <p className="text-xs font-bold" style={{ color: '#76ABAE' }}>
                  {eligibleUsers.length} pendiente{eligibleUsers.length !== 1 ? 's' : ''} de certificar
                </p>
              </div>
              {eligibleUsers.map((u: any) => {
                const issueAction = issueCertificate.bind(null, u.id, id)
                return (
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0"
                    style={{ borderColor: '#0D3352' }}>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs"
                      style={{ background: '#0D3352', color: '#76ABAE' }}>
                      {u.avatar_url
                        ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                        : u.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{u.full_name}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>@{u.username}</p>
                    </div>
                    <form action={issueAction}>
                      <button type="submit"
                        className="flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-lg"
                        style={{ background: 'rgba(118,171,174,0.15)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.25)' }}>
                        <Award size={12} /> Emitir
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          )}

          {/* Existing certificates */}
          {certificates && certificates.length > 0 ? (
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: '#0D3352' }}>
                <p className="text-xs font-bold" style={{ color: 'rgba(246,243,235,0.68)' }}>
                  {certificates.length} certificado{certificates.length !== 1 ? 's' : ''} emitido{certificates.length !== 1 ? 's' : ''}
                </p>
              </div>
              {certificates.map((cert: any) => {
                const profile     = (cert.profiles as any)
                const revokeAction = revokeCertificate.bind(null, cert.id)
                const issuedDate  = new Date(cert.issued_at).toLocaleDateString('es-ES', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })
                return (
                  <div key={cert.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0"
                    style={{ borderColor: '#0D3352' }}>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-xs"
                      style={{ background: '#0D3352', color: '#76ABAE' }}>
                      {profile?.avatar_url
                        ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        : profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{profile?.full_name}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
                        <CheckCircle2 size={10} className="inline mr-1" style={{ color: '#76ABAE' }} />
                        {issuedDate}
                      </p>
                    </div>
                    <form action={revokeAction}>
                      <button type="submit"
                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
                        style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.15)' }}>
                        Revocar
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          ) : eligibleUsers.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <Award size={24} className="mx-auto mb-3" style={{ color: 'rgba(118,171,174,0.25)' }} />
              <p className="text-sm" style={{ color: 'rgba(246,243,235,0.62)' }}>
                Ningún certificado emitido aún
              </p>
            </div>
          ) : null}
        </section>

      </div>
    </div>
  )
}
