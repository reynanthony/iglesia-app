import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Flame, CheckCircle, Clock, Users } from 'lucide-react'
import { togglePrayerParticipation, markPrayerAnswered, markPrayerFollowUp } from '@/app/actions/prayer'

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
  return new Date(date).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function PeticionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: req }, { data: participants }] = await Promise.all([
    supabase
      .from('prayer_requests')
      .select('*, profiles(full_name, username)')
      .eq('id', id)
      .single(),
    supabase
      .from('prayer_participants')
      .select('user_id')
      .eq('request_id', id),
  ])

  if (!req) notFound()

  const isOwner      = req.user_id === user?.id
  const isPraying    = participants?.some(p => p.user_id === user?.id) ?? false
  const prayerCount  = participants?.length ?? 0
  const sc           = STATUS_COLOR[req.status] ?? '#76ABAE'
  const authorName   = req.is_anonymous
    ? 'Anónimo'
    : ((req.profiles as any)?.full_name ?? 'Usuario')

  return (
    <div style={{ background: '#061E30', minHeight: '100vh' }}>

      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-4"
        style={{ background: '#061E30', borderBottom: '1px solid #0D3352' }}>
        <Link href="/app/oracion"
          className="p-2.5 hover:bg-[#0D3352] rounded-xl transition"
          style={{ color: '#76ABAE' }}>
          <ArrowLeft size={18} />
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: 'rgba(246,243,235,0.40)' }}>
          Petición de oración
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Card principal */}
        <div className="rounded-2xl p-6 space-y-5"
          style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>

          {/* Status + meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full"
              style={{ background: `${sc}18`, color: sc, border: `1px solid ${sc}30` }}>
              {STATUS_LABEL[req.status]}
            </span>
            <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.35)' }}>
              {authorName} · {timeAgo(req.created_at)}
            </span>
          </div>

          {/* Título */}
          <h1 className="font-black text-xl leading-snug tracking-tight"
            style={{ color: '#F6F3EB' }}>
            {req.title}
          </h1>

          {/* Cuerpo */}
          {req.body && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: 'rgba(246,243,235,0.65)' }}>
              {req.body}
            </p>
          )}

          {/* Contador de personas orando */}
          <div className="flex items-center gap-2 pt-1"
            style={{ borderTop: '1px solid #0D3352', paddingTop: 16 }}>
            <Users size={14} style={{ color: 'rgba(118,171,174,0.60)' }} />
            <span className="text-[12px] font-bold" style={{ color: 'rgba(246,243,235,0.50)' }}>
              {prayerCount === 0
                ? 'Nadie está orando aún — sé el primero'
                : `${prayerCount} persona${prayerCount !== 1 ? 's' : ''} orando`}
            </span>
          </div>
        </div>

        {/* Botón "Estoy orando" */}
        {user && req.status !== 'respondida' && (
          <form action={togglePrayerParticipation.bind(null, id)}>
            <button type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition"
              style={isPraying
                ? { background: 'rgba(118,171,174,0.15)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.30)' }
                : { background: '#F6F3EB', color: '#061E30' }}>
              <Flame size={16} style={{ color: isPraying ? '#76ABAE' : '#061E30' }} />
              {isPraying ? 'Orando — toca para dejar de orar' : 'Estoy orando por esto'}
            </button>
          </form>
        )}

        {/* Acciones del propietario */}
        {isOwner && req.status !== 'respondida' && (
          <div className="space-y-2">
            {req.status === 'nueva' && (
              <form action={markPrayerFollowUp.bind(null, id)}>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                  style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <Clock size={13} /> Marcar en seguimiento
                </button>
              </form>
            )}
            <form action={markPrayerAnswered.bind(null, id)}>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                style={{ background: 'rgba(74,222,128,0.12)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.25)' }}>
                <CheckCircle size={13} /> Marcar como respondida
              </button>
            </form>
          </div>
        )}

        {/* Estado respondida */}
        {req.status === 'respondida' && (
          <div className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.20)' }}>
            <CheckCircle size={22} style={{ color: '#4ADE80', flexShrink: 0 }} />
            <div>
              <p className="font-black text-sm" style={{ color: '#4ADE80' }}>¡Oración respondida!</p>
              <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.50)' }}>
                Dios oyó el clamor de su pueblo. Gloria a Dios.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
