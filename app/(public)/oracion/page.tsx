import Link from 'next/link'
import { Flame, Plus, ArrowRight, CheckCircle, Sparkles, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PublicPrayerButton } from '@/components/public/PublicPrayerButton'

export const dynamic = 'force-dynamic'

const TEAL  = '#76ABAE'
const NAVY  = '#093C5D'
const CREAM = '#F6F3EB'

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 3600)  return `Hace ${Math.max(1, Math.floor(s / 60))} min`
  if (s < 86400) return `Hace ${Math.floor(s / 3600)} h`
  const d = Math.floor(s / 86400)
  return d === 1 ? 'Ayer' : `Hace ${d} días`
}

export default async function OracionPublicaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: requests, error }, { data: allParticipants }] = await Promise.all([
    supabase
      .from('prayer_requests')
      .select('id, title, is_anonymous, status, created_at, profiles!prayer_requests_user_id_fkey(full_name)')
      .order('created_at', { ascending: false })
      .limit(40),
    supabase
      .from('prayer_participants')
      .select('request_id, user_id'),
  ])

  const countMap: Record<string, number> = {}
  const userPrayed = new Set<string>()
  for (const p of allParticipants ?? []) {
    countMap[p.request_id] = (countMap[p.request_id] ?? 0) + 1
    if (p.user_id === user?.id) userPrayed.add(p.request_id)
  }

  const active   = (requests ?? []).filter(r => r.status !== 'respondida')
  const answered = (requests ?? []).filter(r => r.status === 'respondida')
  const totalPrayers = Object.values(countMap).reduce((a, b) => a + b, 0)

  return (
    <div>

      {/* ── Hero oscuro ─────────────────────────────────── */}
      <section className="relative overflow-hidden flex flex-col justify-center"
        style={{ background: '#051828', minHeight: '70svh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 15% 60%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(14rem, 32vw, 30rem)', opacity: 0.05, color: TEAL, lineHeight: 1, paddingRight: '1rem' }}>
            FE
          </span>
        </div>
        <div className="relative max-w-6xl mx-auto w-full px-6 py-16 sm:py-20 md:py-32">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-12 h-px" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
              Comunidad · Intercesión
            </p>
          </div>
          <h1 className="font-display font-black tracking-tighter text-white mb-6 leading-[0.88]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}>
            Muro de<br /><span style={{ color: TEAL }}>Oración.</span>
          </h1>
          <p className="text-base leading-relaxed max-w-md mb-10" style={{ color: `${CREAM}60` }}>
            Comparte tu petición y deja que la comunidad ore contigo. Cada oración cuenta.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href={user ? '/oracion/nueva' : '/login?next=/oracion/nueva'}
              className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition"
              style={{ background: CREAM, color: NAVY }}>
              <Plus size={13} /> {user ? 'Nueva petición' : 'Compartir petición'}
            </Link>
            <Link href="/app/oracion"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition"
              style={{ border: `1px solid ${TEAL}40`, color: `${CREAM}70` }}>
              App completa <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        {(active.length > 0 || totalPrayers > 0) && (
          <div className="relative" style={{ borderTop: `1px solid rgba(118,171,174,0.12)` }}>
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'rgba(118,171,174,0.10)' }}>
                {[
                  { value: active.length,   label: 'Peticiones activas' },
                  { value: answered.length,  label: 'Respondidas' },
                  { value: totalPrayers,     label: 'Oraciones ofrecidas' },
                ].map(({ value, label }) => (
                  <div key={label} className="px-6 py-5 md:px-8 md:py-6">
                    <p className="font-black tracking-tighter leading-none mb-1"
                      style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: TEAL }}>{value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: 'rgba(246,243,235,0.30)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Peticiones activas ──────────────────────────── */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16 md:py-24">

          {error && (
            <div className="rounded-2xl p-8 text-center border border-edge">
              <p className="font-bold text-sm text-ink mb-1">
                {error.code === '42P01'
                  ? 'Ejecuta la migración v22 en Supabase SQL Editor.'
                  : 'No se pudieron cargar las peticiones.'}
              </p>
              <p className="text-[12px] text-ink-3">{error.message}</p>
            </div>
          )}

          {!error && active.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl border border-edge flex items-center justify-center mx-auto mb-5">
                <Flame size={26} style={{ color: `${TEAL}60` }} />
              </div>
              <p className="font-black text-xl text-ink mb-2">Aún no hay peticiones</p>
              <p className="text-sm text-ink-3 mb-6">Sé el primero en compartir una petición con la comunidad</p>
              <Link href={user ? '/oracion/nueva' : '/login?next=/oracion/nueva'}
                className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl transition"
                style={{ background: NAVY, color: CREAM }}>
                <Plus size={13} /> {user ? 'Crear petición' : 'Iniciar sesión'}
              </Link>
            </div>
          )}

          {active.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-8 pb-5 border-b border-edge">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">— Peticiones activas</p>
                <p className="text-[11px] font-bold text-ink-3">{active.length}</p>
              </div>

              <div className="space-y-3">
                {active.map(req => {
                  const count  = countMap[req.id] ?? 0
                  const prayed = userPrayed.has(req.id)
                  const name   = req.is_anonymous ? 'Anónimo' : ((req.profiles as any)?.full_name ?? 'Miembro')
                  return (
                    <div key={req.id}
                      className="flex items-start gap-4 rounded-2xl border border-edge hover:border-edge-2 bg-card p-5 transition">
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-base text-ink leading-snug mb-2">{req.title}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-ink-3">{name}</span>
                          <span className="text-ink-3 opacity-40">·</span>
                          <span className="text-[11px] text-ink-3">{timeAgo(req.created_at)}</span>
                          {count > 0 && (
                            <>
                              <span className="text-ink-3 opacity-40">·</span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold"
                                style={{ color: TEAL }}>
                                <Flame size={10} /> {count} orando
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <PublicPrayerButton
                        requestId={req.id}
                        initialCount={count}
                        initialPrayed={prayed}
                        isAuthenticated={!!user}
                      />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Respondidas ─────────────────────────────────── */}
      {answered.length > 0 && (
        <section className="bg-muted border-b border-edge">
          <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16 md:py-20">
            <div className="flex items-center gap-2 mb-8 pb-5 border-b border-edge">
              <CheckCircle size={13} style={{ color: '#4ADE80' }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]"
                style={{ color: '#4ADE80' }}>Respondidas por Dios</p>
              <span className="ml-auto text-[11px] font-bold text-ink-3">{answered.length}</span>
            </div>
            <div className="space-y-3">
              {answered.slice(0, 10).map(req => {
                const name = req.is_anonymous ? 'Anónimo' : ((req.profiles as any)?.full_name ?? 'Miembro')
                return (
                  <div key={req.id}
                    className="flex items-start gap-4 rounded-2xl p-5 border"
                    style={{ background: 'rgba(74,222,128,0.04)', borderColor: 'rgba(74,222,128,0.15)' }}>
                    <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#4ADE80' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-ink leading-snug mb-1">{req.title}</p>
                      <p className="text-[11px] text-ink-3">{name} · {timeAgo(req.created_at)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, #0D4A72 100%)` }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 20% 50%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20 md:py-28 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-10"
              style={{ color: 'rgba(118,171,174,0.45)' }}>— Únete a la comunidad</p>
            <h2 className="font-display font-black tracking-tighter leading-[0.88] text-white"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              Más que<br /><span style={{ color: TEAL }}>oraciones.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
            <Link href="/login"
              className="flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition group"
              style={{ background: CREAM, color: NAVY }}>
              Crear cuenta gratis <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/app/oracion"
              className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition group"
              style={{ border: `1px solid ${TEAL}35`, color: `${CREAM}60` }}>
              Salas de oración en vivo <ArrowRight size={13} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
