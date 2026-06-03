import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { assignMentor, removeMentorPair, updateMentorPairStatus } from '@/app/actions/discipleship-lms'

export default async function AdminMentoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor', 'lider'].includes(profile.role)) redirect('/app')

  const [{ data: pairs }, { data: allUsers }] = await Promise.all([
    supabase.from('discipleship_mentors')
      .select(`
        id, status, assigned_at,
        mentor:profiles!discipleship_mentors_mentor_id_fkey(id, full_name, avatar_url),
        student:profiles!discipleship_mentors_student_id_fkey(id, full_name, avatar_url)
      `)
      .order('assigned_at', { ascending: false }),
    supabase.from('profiles')
      .select('id, full_name, username')
      .order('full_name'),
  ])

  const STATUS_COLOR: Record<string, string> = {
    active:    '#76ABAE',
    paused:    '#869B7E',
    completed: '#94A3B8',
  }
  const STATUS_LABEL: Record<string, string> = {
    active:    'Activo',
    paused:    'Pausado',
    completed: 'Completado',
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/discipulado"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Asignaciones de Mentoría</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
              {pairs?.length ?? 0} par{pairs?.length !== 1 ? 'es' : ''} registrados
            </p>
          </div>
        </div>

        {/* ── Nuevo par ── */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.25)' }}>
          <p className="text-sm font-black mb-4" style={{ color: '#F6F3EB' }}>Nueva asignación</p>
          <form action={assignMentor} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(246,243,235,0.40)' }}>
                Mentor
              </label>
              <select name="mentor_id" required
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                style={{ background: '#061E30', border: '1px solid #0D3352', color: '#F6F3EB' }}>
                <option value="">Seleccionar mentor...</option>
                {allUsers?.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.full_name} (@{u.username})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(246,243,235,0.40)' }}>
                Discípulo
              </label>
              <select name="student_id" required
                className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                style={{ background: '#061E30', border: '1px solid #0D3352', color: '#F6F3EB' }}>
                <option value="">Seleccionar discípulo...</option>
                {allUsers?.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.full_name} (@{u.username})</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-black transition hover:brightness-110"
                style={{ background: '#76ABAE', color: '#061E30' }}>
                Asignar
              </button>
            </div>
          </form>
        </div>

        {/* ── Lista de pares ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: '#0D3352' }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: 'rgba(118,171,174,0.55)' }}>
              Todos los pares
            </p>
          </div>

          {!pairs || pairs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm" style={{ color: 'rgba(246,243,235,0.35)' }}>
                Aún no hay pares de mentoría registrados
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#0D3352' }}>
              {pairs.map((pair: any) => {
                const mentor  = pair.mentor
                const student = pair.student
                const color   = STATUS_COLOR[pair.status] ?? '#76ABAE'

                return (
                  <div key={pair.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">

                    {/* Mentor → Discípulo */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background: '#0D3352', color: '#76ABAE' }}>
                          {mentor?.avatar_url
                            ? <img src={mentor.avatar_url} alt="" className="w-full h-full object-cover" />
                            : mentor?.full_name?.[0]?.toUpperCase() ?? 'M'}
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: '#F6F3EB' }}>{mentor?.full_name}</p>
                          <p className="text-[10px]" style={{ color: 'rgba(246,243,235,0.35)' }}>mentor</p>
                        </div>
                      </div>

                      <span className="text-xs px-2" style={{ color: 'rgba(246,243,235,0.25)' }}>→</span>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background: '#0D3352', color: '#76ABAE' }}>
                          {student?.avatar_url
                            ? <img src={student.avatar_url} alt="" className="w-full h-full object-cover" />
                            : student?.full_name?.[0]?.toUpperCase() ?? 'D'}
                        </div>
                        <div>
                          <p className="text-xs font-bold" style={{ color: '#F6F3EB' }}>{student?.full_name}</p>
                          <p className="text-[10px]" style={{ color: 'rgba(246,243,235,0.35)' }}>discípulo</p>
                        </div>
                      </div>
                    </div>

                    {/* Status + fecha */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <form action={updateMentorPairStatus.bind(null, pair.id, pair.status === 'active' ? 'paused' : 'active')}>
                        <button type="submit"
                          className="text-[10px] font-black px-2.5 py-1 rounded-full"
                          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                          {STATUS_LABEL[pair.status]}
                        </button>
                      </form>

                      <p className="text-[10px] hidden sm:block" style={{ color: 'rgba(246,243,235,0.25)' }}>
                        {fmtDate(pair.assigned_at)}
                      </p>

                      <form action={removeMentorPair.bind(null, pair.id)}>
                        <button type="submit"
                          className="w-8 h-8 flex items-center justify-center rounded-lg transition hover:bg-red-900/20"
                          style={{ color: 'rgba(246,243,235,0.30)' }}
                          title="Eliminar par">
                          <Trash2 size={13} />
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
