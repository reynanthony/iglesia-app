import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Radio, MessageSquare, BookOpen, Video,
  Plus, Trash2, Play, Pause, Clock,
} from 'lucide-react'
import { toggleLive, setLiveUrl } from '@/app/actions/liveconfig'
import {
  canalPostFromApp, canalDeleteFromApp,
  reflexionCreateFromApp, reflexionDeleteFromApp,
  encuentroCreateFromApp, encuentroStatusFromApp, encuentroDeleteFromApp,
} from '@/app/actions/pastoral-gestionar'

const P = {
  bg: '#060E07', surface: '#0D1A0E', surface2: '#111F12',
  sage: '#869B7E', teal: '#76ABAE', gold: '#C9A227', red: '#F87171',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.72)', border: 'rgba(134,155,126,0.15)',
  blue: '#0B2D47', blueBorder: '#0D3352',
}

const ENCOUNTER_TYPES = ['clase', 'mentoria', 'conversatorio', 'preguntas']
const TYPE_LABELS: Record<string, string> = {
  clase: 'Clase', mentoria: 'Mentoría', conversatorio: 'Conversatorio', preguntas: 'Q&A',
}

function SectionHeader({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color }}>
        {label}
      </p>
    </div>
  )
}

export default async function PastoralGestionarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, is_consejo_pastoral').eq('id', user.id).single()
  if (!profile || (!['admin', 'pastor'].includes(profile.role) && !profile.is_consejo_pastoral)) redirect('/app/pastoral')

  const [
    { data: configs },
    { data: canalMsgs },
    { data: reflexiones },
    { data: encuentros },
  ] = await Promise.all([
    supabase.from('site_config').select('key, value'),
    supabase.from('pastoral_messages')
      .select('id, body, media_type, pinned, created_at')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false }).limit(8),
    supabase.from('pastoral_reflections')
      .select('id, title, media_type, week_featured, published, created_at')
      .order('created_at', { ascending: false }).limit(8),
    supabase.from('pastoral_encounters')
      .select('id, title, type, status, scheduled_at, live_url')
      .order('scheduled_at', { ascending: false }).limit(8),
  ])

  const cfg          = Object.fromEntries((configs ?? []).map((c: any) => [c.key, c.value]))
  const isLive       = cfg['is_live'] === 'true'
  const liveUrl      = cfg['live_url'] ?? ''
  const liveTitle    = cfg['live_title'] ?? 'Culto en vivo'
  const liveVisibleWeb = cfg['live_visible_web'] === 'true'

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(6,14,7,0.97)', borderBottom: `1px solid ${P.border}`, backdropFilter: 'blur(12px)' }}>
        <Link href="/app/pastoral"
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: P.surface }}>
          <ArrowLeft size={15} style={{ color: P.muted }} />
        </Link>
        <div>
          <p className="font-black text-sm" style={{ color: P.cream }}>Panel del Pastor</p>
          <p className="text-[11px]" style={{ color: P.muted }}>Gestiona tu espacio pastoral</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-8">

        {/* ── EN VIVO ─────────────────────────────────────────── */}
        <section>
          <SectionHeader icon={Radio} label="Transmisión en vivo" color={P.red} />

          {/* Status card */}
          <div className="p-4 rounded-2xl mb-3"
            style={{
              background: P.blue,
              border: `1px solid ${isLive ? 'rgba(248,113,113,0.35)' : P.blueBorder}`,
            }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isLive && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
                <p className="font-bold text-sm"
                  style={{ color: isLive ? P.red : 'rgba(246,243,235,0.68)' }}>
                  {isLive ? 'Transmisión activa' : 'Sin transmisión'}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: isLive ? 'rgba(248,113,113,0.15)' : P.surface,
                  color:      isLive ? P.red : 'rgba(246,243,235,0.55)',
                }}>
                {isLive ? 'EN VIVO' : 'OFFLINE'}
              </span>
            </div>
            {liveUrl && (
              <p className="text-[11px] mt-2 truncate" style={{ color: 'rgba(246,243,235,0.62)' }}>
                {liveUrl}
              </p>
            )}
          </div>

          {/* Toggle button */}
          <form action={toggleLive} className="mb-3">
            <input type="hidden" name="is_live" value={isLive ? '' : 'on'} />
            <button type="submit"
              className="w-full py-3 rounded-xl text-sm font-black transition"
              style={{
                background: isLive ? 'rgba(248,113,113,0.12)' : 'rgba(134,155,126,0.12)',
                color:      isLive ? P.red : P.sage,
                border:     `1px solid ${isLive ? 'rgba(248,113,113,0.25)' : 'rgba(134,155,126,0.20)'}`,
              }}>
              {isLive ? 'Detener transmisión' : 'Iniciar transmisión'}
            </button>
          </form>

          {/* URL + title form */}
          <form action={setLiveUrl} className="space-y-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(246,243,235,0.68)' }}>
                URL del stream (YouTube)
              </label>
              <input name="live_url" type="url" defaultValue={liveUrl}
                placeholder="https://www.youtube.com/watch?v=…"
                className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
                style={{ background: P.blue, border: `1px solid ${P.blueBorder}`, borderRadius: 10, color: P.cream }} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(246,243,235,0.68)' }}>
                Título de la transmisión
              </label>
              <input name="live_title" type="text" defaultValue={liveTitle}
                placeholder="Culto en vivo"
                className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
                style={{ background: P.blue, border: `1px solid ${P.blueBorder}`, borderRadius: 10, color: P.cream }} />
            </div>

            {/* Visibilidad web */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer"
              style={{
                background: liveVisibleWeb ? 'rgba(118,171,174,0.08)' : P.surface,
                border: `1px solid ${liveVisibleWeb ? 'rgba(118,171,174,0.25)' : P.border}`,
              }}>
              <input type="checkbox" name="live_visible_web"
                defaultChecked={liveVisibleWeb} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[12px] font-bold" style={{ color: P.cream }}>
                  Publicar en el sitio web
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: P.muted }}>
                  Si está marcado, el live también aparece en elmanantial.com para visitantes públicos.
                </p>
              </div>
            </label>

            <button type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-bold"
              style={{ background: P.cream, color: '#060E07' }}>
              Guardar configuración
            </button>
          </form>
        </section>

        {/* ── CANAL DEL PASTOR ─────────────────────────────────── */}
        <section>
          <SectionHeader icon={MessageSquare} label="Canal del pastor" color={P.sage} />

          {/* Quick compose */}
          <form action={canalPostFromApp} className="space-y-2.5 mb-4">
            <textarea name="body" rows={3} required
              placeholder="Escribe un mensaje para tu comunidad…"
              className="w-full px-3.5 py-3 text-sm resize-none focus:outline-none"
              style={{ background: P.surface, border: `1px solid ${P.border}`, borderRadius: 10, color: P.cream }} />
            <input type="hidden" name="media_type" value="text" />
            <div className="flex items-center gap-2.5">
              <label className="flex items-center gap-2 text-[12px] cursor-pointer"
                style={{ color: P.muted }}>
                <input type="checkbox" name="pinned" className="rounded" />
                Fijar mensaje
              </label>
              <button type="submit"
                className="ml-auto px-5 py-2 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(134,155,126,0.15)', color: P.sage, border: `1px solid rgba(134,155,126,0.25)` }}>
                Publicar
              </button>
            </div>
          </form>

          {/* Recent messages */}
          {canalMsgs && canalMsgs.length > 0 && (
            <div className="space-y-2">
              {canalMsgs.map(msg => (
                <div key={msg.id} className="flex items-start gap-3 p-3.5 rounded-xl"
                  style={{ background: P.surface, border: `1px solid ${msg.pinned ? 'rgba(201,162,39,0.22)' : P.border}` }}>
                  <p className="text-[12px] leading-relaxed flex-1 line-clamp-2" style={{ color: P.muted }}>
                    {msg.pinned && <span className="font-black mr-1.5" style={{ color: P.gold }}>📌</span>}
                    {msg.body ?? `(${msg.media_type})`}
                  </p>
                  <form action={canalDeleteFromApp.bind(null, msg.id)} className="flex-shrink-0">
                    <button type="submit" className="p-1.5 rounded-lg"
                      style={{ color: 'rgba(248,113,113,0.50)' }}>
                      <Trash2 size={13} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── REFLEXIONES ──────────────────────────────────────── */}
        <section>
          <SectionHeader icon={BookOpen} label="Reflexiones pastorales" color={P.sage} />

          {/* Create form */}
          <details className="mb-4 group">
            <summary className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-sm font-bold select-none"
              style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.sage }}>
              <Plus size={14} /> Nueva reflexión
            </summary>
            <form action={reflexionCreateFromApp} className="mt-2 p-4 rounded-xl space-y-3"
              style={{ background: P.surface, border: `1px solid ${P.border}` }}>
              <input name="title" type="text" required placeholder="Título"
                className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
                style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }} />
              <textarea name="body" rows={4} placeholder="Contenido de la reflexión…"
                className="w-full px-3.5 py-2.5 text-sm resize-none focus:outline-none"
                style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }} />
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'rgba(246,243,235,0.62)' }}>Tipo</label>
                  <select name="media_type"
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                    style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }}>
                    <option value="text">Texto</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'rgba(246,243,235,0.62)' }}>Duración (seg)</label>
                  <input name="duration_seconds" type="number" placeholder="300"
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                    style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }} />
                </div>
              </div>
              <input name="media_url_external" type="url" placeholder="URL de audio/video (opcional)"
                className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
                style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }} />
              <label className="flex items-center gap-2 text-[12px] cursor-pointer" style={{ color: P.muted }}>
                <input type="checkbox" name="week_featured" />
                Mensaje de esta semana
              </label>
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold"
                style={{ background: P.cream, color: '#060E07' }}>
                Publicar reflexión
              </button>
            </form>
          </details>

          {/* List */}
          {reflexiones && reflexiones.length > 0 ? (
            <div className="space-y-2">
              {reflexiones.map(r => (
                <div key={r.id} className="flex items-center gap-3 p-3.5 rounded-xl"
                  style={{ background: P.surface, border: `1px solid ${r.week_featured ? 'rgba(201,162,39,0.22)' : P.border}` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate" style={{ color: P.cream }}>
                      {r.week_featured && <span className="text-[10px] font-black mr-1.5" style={{ color: P.gold }}>★</span>}
                      {r.title ?? 'Sin título'}
                    </p>
                    <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.55)' }}>
                      {r.media_type} · {new Date(r.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <form action={reflexionDeleteFromApp.bind(null, r.id)} className="flex-shrink-0">
                    <button type="submit" className="p-1.5 rounded-lg"
                      style={{ color: 'rgba(248,113,113,0.50)' }}>
                      <Trash2 size={13} />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-center py-4" style={{ color: 'rgba(246,243,235,0.25)' }}>
              No hay reflexiones publicadas aún
            </p>
          )}
        </section>

        {/* ── ENCUENTROS EN VIVO ───────────────────────────────── */}
        <section>
          <SectionHeader icon={Video} label="Encuentros en vivo" color={P.teal} />

          {/* Create */}
          <details className="mb-4 group">
            <summary className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer text-sm font-bold select-none"
              style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.teal }}>
              <Plus size={14} /> Nuevo encuentro
            </summary>
            <form action={encuentroCreateFromApp} className="mt-2 p-4 rounded-xl space-y-3"
              style={{ background: P.surface, border: `1px solid ${P.border}` }}>
              <input name="title" type="text" required placeholder="Título del encuentro"
                className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
                style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }} />
              <textarea name="description" rows={2} placeholder="Descripción (opcional)"
                className="w-full px-3.5 py-2.5 text-sm resize-none focus:outline-none"
                style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }} />
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'rgba(246,243,235,0.62)' }}>Tipo</label>
                  <select name="type" required
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                    style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }}>
                    {ENCOUNTER_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: 'rgba(246,243,235,0.62)' }}>Fecha y hora</label>
                  <input name="scheduled_at" type="datetime-local"
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                    style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }} />
                </div>
              </div>
              <input name="live_url" type="url" placeholder="URL del live (YouTube, Zoom…)"
                className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
                style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 8, color: P.cream }} />
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold"
                style={{ background: P.cream, color: '#060E07' }}>
                Crear encuentro
              </button>
            </form>
          </details>

          {/* List */}
          {encuentros && encuentros.length > 0 ? (
            <div className="space-y-2">
              {encuentros.map(e => {
                const isOngoing = e.status === 'live'
                const isDone    = e.status === 'finished'
                return (
                  <div key={e.id} className="flex items-center gap-3 p-3.5 rounded-xl"
                    style={{
                      background: isOngoing ? 'rgba(248,113,113,0.06)' : P.surface,
                      border: `1px solid ${isOngoing ? 'rgba(248,113,113,0.25)' : P.border}`,
                    }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color: P.cream }}>
                        {e.title}
                      </p>
                      <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
                        {TYPE_LABELS[e.type] ?? e.type}
                        {e.scheduled_at
                          ? ` · ${new Date(e.scheduled_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!isDone && (
                        <form action={encuentroStatusFromApp.bind(null, e.id, isOngoing ? 'finished' : 'live')}>
                          <button type="submit"
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold"
                            style={{
                              background: isOngoing ? 'rgba(248,113,113,0.15)' : 'rgba(118,171,174,0.12)',
                              color:      isOngoing ? P.red : P.teal,
                            }}>
                            {isOngoing ? <Pause size={12} /> : <Play size={12} />}
                          </button>
                        </form>
                      )}
                      {isDone && (
                        <span className="text-[10px] px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(118,171,174,0.08)', color: 'rgba(118,171,174,0.40)' }}>
                          <Clock size={10} className="inline mr-1" />
                          Finalizado
                        </span>
                      )}
                      <form action={encuentroDeleteFromApp.bind(null, e.id)}>
                        <button type="submit" className="p-1.5 rounded-lg"
                          style={{ color: 'rgba(248,113,113,0.50)' }}>
                          <Trash2 size={13} />
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-[12px] text-center py-4" style={{ color: 'rgba(246,243,235,0.25)' }}>
              No hay encuentros programados
            </p>
          )}
        </section>

      </div>
    </div>
  )
}
