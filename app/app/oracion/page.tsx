import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Flame, Mic2, ChevronRight, Sparkles, Lock, HandHeart } from 'lucide-react'
import RealtimeRefresh from '@/components/RealtimeRefresh'
import PrayerCreatedBanner from '@/components/app/PrayerCreatedBanner'
import { GoldArt } from '@/components/app/GoldArt'
import { BG, CARD, CARD_GRAD, BORDER, MUTED, GOLD, GOLD_INK, INK, CARD_SHADOW } from '@/lib/gold-theme'

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

  // Show all public prayers + user's own (including private)
  let query = supabase
    .from('prayer_requests')
    .select('id, title, is_anonymous, is_public, status, created_at, user_id, testimony_post_id, profiles!prayer_requests_user_id_fkey(full_name, username), prayer_responses(id)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (estado && estado !== 'todas') query = query.eq('status', estado)

  // If logged in, show public prayers OR own prayers
  if (user) {
    query = query.or(`is_public.eq.true,user_id.eq.${user.id}`)
  } else {
    query = query.eq('is_public', true)
  }

  const { data: requests, error } = await query
  if (error) console.error('[app/oracion] error al cargar peticiones:', error)

  const tabs = [
    { key: 'todas',       label: 'Todas' },
    { key: 'nueva',       label: 'Nuevas' },
    { key: 'seguimiento', label: 'En seguimiento' },
    { key: 'respondida',  label: 'Respondidas' },
  ]

  const activeTab = estado ?? 'todas'

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="font-app">
      <RealtimeRefresh channelName="oracion-list" watches={[{ table: 'prayer_requests' }]} />
      <Suspense fallback={null}>
        <PrayerCreatedBanner />
      </Suspense>

      {/* Header */}
      <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 80% at 50% 0%, ${GOLD}12, transparent 70%)` }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="relative w-11 h-11 mb-4">
                <GoldArt uid="oracion-header" light="#FFC773" dark="#C9631A" icon={Flame} iconSize={18} />
              </div>
              <h1 className="font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: INK }}>
                Peticiones de<br /><span style={{ color: GOLD }}>Oración.</span>
              </h1>
              <p className="text-sm mt-3 max-w-xs leading-relaxed" style={{ color: MUTED }}>
                Lleva tus cargas delante de Dios y deja que la comunidad ore contigo.
              </p>
            </div>
            <Link href="/app/oracion/nueva"
              className="flex-shrink-0 flex items-center gap-2 text-sm font-black uppercase tracking-wider px-5 py-3 rounded-xl transition"
              style={{ background: GOLD, color: GOLD_INK, boxShadow: '0 10px 22px -8px rgba(255,204,0,0.4)' }}>
              <Plus size={14} /> Nueva
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-4 px-4">
            {tabs.map(tab => (
              <Link key={tab.key}
                href={tab.key === 'todas' ? '/app/oracion' : `/app/oracion?estado=${tab.key}`}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                style={activeTab === tab.key
                  ? { background: GOLD, color: GOLD_INK }
                  : { background: CARD, color: MUTED, border: `1px solid ${BORDER}` }}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">

        {error && (
          <div className="rounded-2xl p-6 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#F87171' }}>
              No se pudieron cargar las peticiones
            </p>
            <p className="text-[12px]" style={{ color: MUTED }}>
              Intenta de nuevo en unos minutos.
            </p>
          </div>
        )}

        {!error && (!requests || requests.length === 0) && (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <Flame size={24} style={{ color: MUTED }} />
            </div>
            <p className="font-black text-lg tracking-tight mb-2" style={{ color: INK }}>
              No hay peticiones aún
            </p>
            <p className="text-sm mb-8 max-w-[220px] leading-relaxed mx-auto" style={{ color: MUTED }}>
              Sé el primero en compartir una petición de oración con la comunidad
            </p>
            <Link href="/app/oracion/nueva"
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl"
              style={{ background: GOLD, color: GOLD_INK }}>
              <Plus size={13} /> Crear petición
            </Link>
          </div>
        )}

        {requests?.map((req: any) => {
          const sc           = STATUS_COLOR[req.status] ?? GOLD
          const isOwn        = req.user_id === user?.id
          const hasTestimony = !!req.testimony_post_id
          const isPrivate    = req.is_public === false
          const responseCount = (req.prayer_responses as any[])?.length ?? 0
          return (
            <Link key={req.id} href={`/app/oracion/${req.id}`}
              className="group block rounded-2xl transition"
              style={{
                background: CARD_GRAD,
                border: `1px solid ${hasTestimony ? `${GOLD}50` : BORDER}`,
                boxShadow: CARD_SHADOW,
              }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-full"
                      style={{ background: `${sc}22`, color: sc, border: `1px solid ${sc}45` }}>
                      {STATUS_LABEL[req.status]}
                    </span>
                    {isPrivate && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: CARD, color: MUTED, border: `1px solid ${BORDER}` }}>
                        <Lock size={8} /> Privada
                      </span>
                    )}
                    {hasTestimony && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: `${GOLD}18`, color: GOLD }}>
                        <Sparkles size={9} /> Testimonio
                      </span>
                    )}
                    {isOwn && !hasTestimony && !isPrivate && (
                      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
                        Mi petición
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {responseCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ color: GOLD }}>
                        <HandHeart size={11} /> {responseCount}
                      </span>
                    )}
                    <ChevronRight size={14} style={{ color: MUTED, marginTop: 2 }} />
                  </div>
                </div>
                <p className="font-black text-base leading-snug mb-2 transition" style={{ color: INK }}>
                  {req.title}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-[11px]" style={{ color: MUTED }}>
                    {req.is_anonymous ? 'Anónimo' : ((req.profiles as any)?.full_name ?? 'Usuario')}
                  </p>
                  <span style={{ color: BORDER }}>·</span>
                  <p className="text-[11px]" style={{ color: MUTED }}>
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
          style={{ background: CARD_GRAD, border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex-shrink-0">
              <GoldArt uid="oracion-salas" light="#9FE3D1" dark="#1B6E56" icon={Mic2} iconSize={16} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: INK }}>Salas de oración en vivo</p>
              <p className="text-[11px]" style={{ color: MUTED }}>
                Oración grupal por voz en tiempo real
              </p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: MUTED }} />
        </Link>
      </div>
    </div>
  )
}
