import { createClient } from '@/lib/supabase/server'
import { setUserStage, advanceUserStage } from '@/app/actions/discipleship'
import { ChevronRight, BookOpen, GraduationCap, Users, BarChart2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDiscipuladoPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>
}) {
  const { stage: stageFilter } = await searchParams
  const supabase = await createClient()

  const [{ data: stages }, { data: allUsers }, { data: assignments }, { data: programs }] = await Promise.all([
    supabase.from('discipleship_stages').select('*').order('order_index'),
    supabase.from('profiles').select('id, full_name, username, avatar_url, role').order('full_name'),
    supabase.from('user_discipleship').select('*, discipleship_stages(*)'),
    supabase.from('discipleship_programs').select('id, title, is_active, discipleship_courses(id)').order('order_index'),
  ])

  const assignmentMap = new Map(
    (assignments ?? []).map((a: any) => [a.user_id, a])
  )

  const stagesById = new Map((stages ?? []).map((s: any) => [s.id, s]))

  const users = (allUsers ?? []).map((u: any) => ({
    ...u,
    discipleship: assignmentMap.get(u.id) ?? null,
  }))

  const filtered = stageFilter
    ? users.filter(u => u.discipleship?.stage_id === stageFilter)
    : users

  // Count per stage
  const stageCounts = new Map<string, number>()
  users.forEach(u => {
    if (u.discipleship?.stage_id) {
      stageCounts.set(u.discipleship.stage_id, (stageCounts.get(u.discipleship.stage_id) ?? 0) + 1)
    }
  })
  const unassigned = users.filter(u => !u.discipleship).length

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Discipulado</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(246,243,235,0.68)' }}>
            {users.length} usuarios · {unassigned} sin etapa asignada
          </p>
        </div>

        {/* Acceso rápido a Contenido */}
        <Link
          href="/admin/discipulado/programas"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl mb-6 transition hover:brightness-110"
          style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.25)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(118,171,174,0.12)', border: '1px solid rgba(118,171,174,0.20)' }}>
            <GraduationCap size={18} style={{ color: '#76ABAE' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>Contenido del LMS</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              {programs?.length ?? 0} programa{programs?.length !== 1 ? 's' : ''} ·{' '}
              {programs?.reduce((n: number, p: any) => n + (p.discipleship_courses?.length ?? 0), 0)} cursos
            </p>
          </div>
          <ChevronRight size={16} style={{ color: 'rgba(246,243,235,0.55)' }} />
        </Link>

        {/* Acceso rápido a Reportes */}
        <Link
          href="/admin/discipulado/reportes"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl mb-4 transition hover:brightness-110"
          style={{ background: '#0B2D47', border: '1px solid rgba(118,171,174,0.20)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(118,171,174,0.12)', border: '1px solid rgba(118,171,174,0.20)' }}>
            <BarChart2 size={18} style={{ color: '#76ABAE' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>Dashboard Pastoral</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Métricas, alertas y actividad reciente
            </p>
          </div>
          <ChevronRight size={16} style={{ color: 'rgba(246,243,235,0.55)' }} />
        </Link>

        {/* Acceso rápido a Mentoría */}
        <Link
          href="/admin/discipulado/mentores"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl mb-4 transition hover:brightness-110"
          style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(118,171,174,0.08)', border: '1px solid #0D3352' }}>
            <Users size={18} style={{ color: 'rgba(118,171,174,0.70)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>Asignaciones de Mentoría</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Asignar mentores a discípulos y gestionar pares
            </p>
          </div>
          <ChevronRight size={16} style={{ color: 'rgba(246,243,235,0.55)' }} />
        </Link>

        {/* Separador seguimiento */}
        <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.55)' }}>
          Seguimiento de etapas
        </p>

        {/* Stage summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <a href="/admin/discipulado"
            className="p-3 rounded-xl text-center transition"
            style={{
              background: !stageFilter ? '#0D3352' : '#0B2D47',
              border: `1px solid ${!stageFilter ? '#1A4A6E' : '#0D3352'}`,
            }}>
            <p className="font-black text-lg" style={{ color: '#F6F3EB' }}>{unassigned}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
              style={{ color: 'rgba(246,243,235,0.68)' }}>Sin etapa</p>
          </a>
          {stages?.map((s: any) => (
            <a key={s.id} href={`/admin/discipulado?stage=${s.id}`}
              className="p-3 rounded-xl text-center transition"
              style={{
                background: stageFilter === s.id ? '#0D3352' : '#0B2D47',
                border: `1px solid ${stageFilter === s.id ? s.color + '60' : '#0D3352'}`,
              }}>
              <p className="font-black text-lg" style={{ color: stageFilter === s.id ? s.color : '#F6F3EB' }}>
                {stageCounts.get(s.id) ?? 0}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate"
                style={{ color: 'rgba(246,243,235,0.68)' }}>{s.name}</p>
            </a>
          ))}
        </div>

        {/* Users table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: '#0D3352' }}>
            <p className="text-xs font-bold" style={{ color: 'rgba(246,243,235,0.68)' }}>
              {filtered.length} usuarios
            </p>
          </div>

          {filtered.map((u: any) => {
            const disc    = u.discipleship
            const curStage = disc ? (disc.discipleship_stages as any) : null
            const nextStage = curStage
              ? (stages ?? []).find((s: any) => s.order_index === curStage.order_index + 1)
              : null
            const setAction = setUserStage.bind(null, u.id)
            const advAction = advanceUserStage.bind(null, u.id)

            return (
              <div key={u.id} className="flex flex-col md:flex-row md:items-center gap-3 px-5 py-4 border-b"
                style={{ borderColor: '#0D3352' }}>

                {/* User info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
                    style={{ background: '#0D3352', color: '#76ABAE' }}>
                    {u.avatar_url
                      ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                      : u.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{u.full_name}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>@{u.username}</p>
                  </div>
                </div>

                {/* Current stage */}
                <div className="flex items-center gap-2">
                  {curStage ? (
                    <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: `${curStage.color}18`, color: curStage.color, border: `1px solid ${curStage.color}30` }}>
                      {curStage.order_index}. {curStage.name}
                    </span>
                  ) : (
                    <span className="text-[11px] px-3 py-1.5 rounded-lg"
                      style={{ background: '#0D3352', color: 'rgba(246,243,235,0.62)' }}>
                      Sin etapa
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {nextStage && (
                    <form action={advAction}>
                      <button type="submit"
                        className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg"
                        style={{ background: `${nextStage.color}18`, color: nextStage.color, border: `1px solid ${nextStage.color}30` }}
                        title={`Avanzar a ${nextStage.name}`}>
                        <ChevronRight size={12} /> {nextStage.name}
                      </button>
                    </form>
                  )}
                  <form action={setAction} className="flex items-center gap-2">
                    <select name="stage_id" defaultValue={disc?.stage_id ?? ''}
                      className="text-[11px] px-2 py-1.5 rounded-lg focus:outline-none"
                      style={{ background: '#0D3352', color: '#F6F3EB', border: '1px solid #1A4A6E' }}>
                      <option value="">Sin etapa</option>
                      {stages?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.order_index}. {s.name}</option>
                      ))}
                    </select>
                    <button type="submit"
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: '#F6F3EB', color: '#061E30' }}>
                      Asignar
                    </button>
                  </form>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center" style={{ color: 'rgba(246,243,235,0.68)' }}>
              <p className="text-sm">No hay usuarios en esta etapa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
