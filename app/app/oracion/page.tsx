import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Flame, Mic2, ChevronRight, Sparkles } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  nueva: 'Nueva', seguimiento: 'En seguimiento', respondida: 'Respondida',
}
const STATUS_COLOR: Record<string, string> = {
  nueva: '#76ABAE', seguimiento: '#F59E0B', respondida: '#4ADE80',
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60)    return 'Ahora'
  if (s < 3600)  return `Hace ${Math.floor(s / 60)} min`
  if (s < 86400) return `Hace ${Math.floor(s / 3600)} h`
  return new Date(date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
}

export default async function OracionPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('prayer_requests')
    .select('id, title, is_anonymous, status, created_at, user_id, testimony_post_id, profiles!prayer_requests_user_id_fkey(full_name, username)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (estado && estado !== 'todas') query = query.eq('status', estado)

  const { data: requests, error } = await query

  const tabs = [
    { key: 'todas',       label: 'Todas' },
    { key: 'nueva',       label: 'Nuevas' },
    { key: 'seguimiento', label: 'En seguimiento' },
    { key: 'respondida',  label: 'Respondidas' },
  ]

  const activeTab = estado ?? 'todas'

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Header */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: '#0D3352' }}>
                <Flame size={18} style={{ color: '#76ABAE' }} />
              </div>
              <h1 className="font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
                Peticiones de<br /><span style={{ color: '#76ABAE' }}>Oración.</span>
              </h1>
              <p className="text-sm mt-3 max-w-xs leading-relaxed"
                style={{ color: 'rgba(246,243,235,0.45)' }}>
                Comparte tu petición y deja que la comunidad ore contigo.
              </p>
            </div>
            <Link href="/app/oracion/nueva"
              className="flex-shrink-0 flex items-center gap-2 text-sm font-black uppercase tracking-wider px-5 py-3 rounded-xl transition"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              <Plus size={14} /> Nueva
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-4 px-4">
            {tabs.map(tab => (
              <Link key={tab.key}
                href={tab.key === 'todas' ? '/app/oracion' : `/app/oracion?estado=${tab.key}`}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                style={{
                  background: activeTab === tab.key ? '#0D3352' : 'transparent',
                  color: activeTab === tab.key ? '#F6F3EB' : 'rgba(246,243,235,0.40)',
                  border: activeTab === tab.key ? '1px solid #1A4A6E' : '1px solid transparent',
                }}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">

        {error && (
          <div className="rounded-2xl p-6 text-center" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#F87171' }}>
              {error.code === '42P01' ? 'Tabla no encontrada' : 'Error al cargar peticiones'}
            </p>
            <p className="text-[12px] mb-2" style={{ color: 'rgba(246,243,235,0.40)' }}>
              {error.code === '42P01'
                ? 'Ejecuta la migración SQL en Supabase Dashboard → SQL Editor → supabase/v2_ecosystem.sql'
                : error.message}
            </p>
            <p className="text-[11px] font-mono" style={{ color: 'rgba(246,243,235,0.50)' }}>
              código: {error.code}
            </p>
          </div>
        )}

        {!error && (!requests || requests.length === 0) && (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <Flame size={24} style={{ color: 'rgba(118,171,174,0.40)' }} />
            </div>
            <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>
              No hay peticiones aún
            </p>
            <p className="text-sm mb-8 max-w-[220px] leading-relaxed mx-auto"
              style={{ color: 'rgba(246,243,235,0.45)' }}>
              Sé el primero en compartir una petición de oración con la comunidad
            </p>
            <Link href="/app/oracion/nueva"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              <Plus size={13} /> Crear petición
            </Link>
          </div>
        )}

        {requests?.map((req: any) => {
          const sc          = STATUS_COLOR[req.status] ?? '#76ABAE'
          const isOwn       = req.user_id === user?.id
          const hasTestimony = !!req.testimony_post_id
          return (
            <Link key={req.id} href={`/app/oracion/${req.id}`}
              className="group block rounded-2xl transition"
              style={{
                background: '#0B2D47',
                border: `1px solid ${hasTestimony ? 'rgba(118,171,174,0.25)' : '#0D3352'}`,
              }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full"
                      style={{ background: `${sc}18`, color: sc, border: `1px solid ${sc}30` }}>
                      {STATUS_LABEL[req.status]}
                    </span>
                    {hasTestimony && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(118,171,174,0.12)', color: '#76ABAE' }}>
                        <Sparkles size={9} /> Testimonio
                      </span>
                    )}
                    {isOwn && !hasTestimony && (
                      <span className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: 'rgba(246,243,235,0.30)' }}>
                        Mi petición
                      </span>
                    )}
                  </div>
                  <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.25)', flexShrink: 0, marginTop: 2 }} />
                </div>
                <p className="font-black text-base leading-snug mb-2 group-hover:text-[#76ABAE] transition"
                  style={{ color: '#F6F3EB' }}>
                  {req.title}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                    {req.is_anonymous ? 'Anónimo' : ((req.profiles as any)?.full_name ?? 'Usuario')}
                  </p>
                  <span style={{ color: 'rgba(246,243,235,0.20)' }}>·</span>
                  <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                    {timeAgo(req.created_at)}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}

        {/* Enlace a salas de audio */}
        <Link href="/app/oracion/salas"
          className="flex items-center justify-between p-5 rounded-2xl transition mt-4"
          style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#0D3352' }}>
              <Mic2 size={16} style={{ color: '#76ABAE' }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#F6F3EB' }}>Salas de oración en vivo</p>
              <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                Oración grupal por voz en tiempo real
              </p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: 'rgba(246,243,235,0.30)' }} />
        </Link>
      </div>
    </div>
  )
}
