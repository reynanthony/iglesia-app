import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Flame, CheckCircle, Clock, Users, Sparkles, MessageSquareHeart, ChevronRight, HandHeart, Lock } from 'lucide-react'
import { togglePrayerParticipation, markPrayerAnswered, markPrayerFollowUp } from '@/app/actions/prayer'
import RealtimeRefresh from '@/components/RealtimeRefresh'
import PrayerResponseForm from '@/components/app/PrayerResponseForm'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

const STATUS_LABEL: Record<string, string> = {
  nueva: 'Nueva', seguimiento: 'En seguimiento', respondida: 'Respondida',
}
const STATUS_COLOR: Record<string, string> = {
  nueva: GOLD, seguimiento: '#F59E0B', respondida: '#4ADE80',
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

  const [{ data: req }, { data: participants }, { data: responses }] = await Promise.all([
    supabase
      .from('prayer_requests')
      .select('*, profiles!prayer_requests_user_id_fkey(full_name, username), posts!prayer_requests_testimony_post_id_fkey(id, content, created_at)')
      .eq('id', id)
      .single(),
    supabase
      .from('prayer_participants')
      .select('user_id')
      .eq('request_id', id),
    supabase
      .from('prayer_responses')
      .select('id, body, is_anonymous, created_at, profiles!prayer_responses_user_id_fkey(full_name, username)')
      .eq('request_id', id)
      .order('created_at', { ascending: true }),
  ])

  if (!req) notFound()

  const isOwner      = req.user_id === user?.id
  const isPraying    = participants?.some(p => p.user_id === user?.id) ?? false
  const prayerCount  = participants?.length ?? 0
  const sc           = STATUS_COLOR[req.status] ?? GOLD
  const authorName   = req.is_anonymous
    ? 'Anónimo'
    : ((req.profiles as any)?.full_name ?? 'Usuario')
  const testimony    = (req.posts as any) ?? null
  const isPrivate    = req.is_public === false

  // Already responded?
  const alreadyResponded = responses?.some((r: any) => {
    const profile = r.profiles as any
    return !r.is_anonymous && profile?.username && user?.id
  })

  return (
    <div style={{ background: BG, minHeight: '100%' }}>
      <RealtimeRefresh
        channelName={`oracion-detail-${id}`}
        watches={[
          { table: 'prayer_participants',  filter: `request_id=eq.${id}` },
          { table: 'prayer_requests',      filter: `id=eq.${id}` },
          { table: 'prayer_responses',     filter: `request_id=eq.${id}` },
        ]}
      />

      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-4"
        style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/app/oracion"
          className="p-2.5 hover:bg-[#292E3B] rounded-xl transition"
          style={{ color: GOLD }}>
          <ArrowLeft size={18} />
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: MUTED }}>
          Petición de oración
        </span>
        {isPrivate && (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ml-auto"
            style={{ background: 'rgba(255,255,255,0.06)', color: MUTED, border: '1px solid rgba(246,243,235,0.10)' }}>
            <Lock size={9} /> Privada
          </span>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Card principal */}
        <div className="rounded-2xl p-6 space-y-5"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full"
              style={{ background: `${sc}18`, color: sc, border: `1px solid ${sc}30` }}>
              {STATUS_LABEL[req.status]}
            </span>
            <span className="text-[11px]" style={{ color: MUTED }}>
              {authorName} · {timeAgo(req.created_at)}
            </span>
          </div>

          <h1 className="font-black text-xl leading-snug tracking-tight"
            style={{ color: INK }}>
            {req.title}
          </h1>

          {req.body && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: MUTED }}>
              {req.body}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1"
            style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
            <Users size={14} style={{ color: `${GOLD}99` }} />
            <span className="text-[12px] font-bold" style={{ color: MUTED }}>
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
                ? { background: `${GOLD}26`, color: GOLD, border: `1px solid ${GOLD}4D` }
                : { background: GOLD, color: GOLD_INK }}>
              <Flame size={16} style={{ color: isPraying ? GOLD : GOLD_INK }} />
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
          <div className="space-y-3">
            <div className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.20)' }}>
              <CheckCircle size={22} style={{ color: '#4ADE80', flexShrink: 0 }} />
              <div>
                <p className="font-black text-sm" style={{ color: '#4ADE80' }}>¡Oración respondida!</p>
                <p className="text-[12px]" style={{ color: MUTED }}>
                  Dios oyó el clamor de su pueblo. Gloria a Dios.
                </p>
              </div>
            </div>

            {testimony && (
              <div className="rounded-2xl p-5 space-y-3"
                style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}33` }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: GOLD }} />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: `${GOLD}99` }}>
                    Testimonio compartido
                  </p>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: MUTED }}>
                  {testimony.content}
                </p>
                <p className="text-[10px]" style={{ color: MUTED }}>
                  {new Date(testimony.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            )}

            {isOwner && !testimony && (
              <Link href={`/app/oracion/${id}/testimonio`}
                className="flex items-center gap-3 p-5 rounded-2xl transition hover:brightness-110"
                style={{ background: CARD, border: `1px solid ${GOLD}33` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${GOLD}1F` }}>
                  <MessageSquareHeart size={16} style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: INK }}>Compartir testimonio</p>
                  <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>
                    Cuéntale a la comunidad cómo Dios respondió
                  </p>
                </div>
                <ChevronRight size={14} style={{ color: MUTED }} />
              </Link>
            )}
          </div>
        )}

        {/* ── Oraciones de la comunidad ── */}
        {(responses && responses.length > 0) && (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] px-1"
              style={{ color: `${GOLD}99` }}>
              Oraciones de la comunidad ({responses.length})
            </p>
            {responses.map((r: any) => {
              const profile = r.profiles as any
              const name = r.is_anonymous ? 'Anónimo' : (profile?.full_name ?? 'Usuario')
              return (
                <div key={r.id} className="rounded-2xl p-5 space-y-2"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${GOLD}26` }}>
                      <HandHeart size={12} style={{ color: GOLD }} />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: MUTED }}>
                      {name}
                    </span>
                    <span className="text-[10px]" style={{ color: MUTED }}>
                      · {timeAgo(r.created_at)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap pl-8"
                    style={{ color: MUTED }}>
                    {r.body}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Formulario de respuesta */}
        {user && (
          <PrayerResponseForm requestId={id} />
        )}

        {!user && (
          <Link href={`/login?next=/app/oracion/${id}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition"
            style={{ background: CARD, border: `1px solid ${GOLD}40`, color: GOLD }}>
            <MessageSquareHeart size={16} /> Inicia sesión para responder
          </Link>
        )}

      </div>
    </div>
  )
}
