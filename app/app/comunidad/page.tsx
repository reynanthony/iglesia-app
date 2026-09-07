import Link from 'next/link'
import { Search, ArrowRight, Sparkles, Play, BookOpen } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/lib/supabase/cached-user'
import { createClient } from '@/lib/supabase/server'
import NotificationBell from '@/components/NotificationBell'

const TEAL  = '#76ABAE'
const GREEN = '#6FBF8B'
const AMBER = '#E3A94C'
const PURPLE = '#A99BD1'
const RING_COLORS = [TEAL, AMBER, PURPLE, GREEN]

const GRADIENT_FALLBACK = [
  'linear-gradient(150deg, #093C5D 0%, #76ABAE 100%)',
  'linear-gradient(150deg, #051828 0%, #093C5D 100%)',
  'linear-gradient(150deg, #869B7E 0%, #A8BCA2 100%)',
  'linear-gradient(150deg, #0D4A72 0%, #76ABAE 100%)',
]

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 3600)  return `Hace ${Math.max(1, Math.floor(s / 60))} min`
  if (s < 86400) return `Hace ${Math.floor(s / 3600)} h`
  return `Hace ${Math.floor(s / 86400)} d`
}

export default async function ComunidadPage() {
  const user = await getUser()
  if (!user) redirect('/login')
  const profile = await getProfile(user.id)
  const supabase = await createClient()

  const [{ data: ministries }, { data: sermons }, { data: devocionales }] = await Promise.all([
    supabase.from('ministries').select('id, name, slug, image_url').is('parent_id', null).order('name').limit(8),
    supabase.from('sermons').select('id, title, speaker, sermon_date, thumbnail_url').eq('published', true).order('sermon_date', { ascending: false }).limit(1),
    supabase.from('devocionales').select('id, title, verse_ref, created_at').eq('published', true).order('created_at', { ascending: false }).limit(1),
  ])

  const firstName = (profile?.full_name ?? 'amigo').split(' ')[0]
  const initial = (profile?.full_name?.[0] ?? 'U').toUpperCase()
  const latestSermon = sermons?.[0] ?? null
  const latestDevocional = devocionales?.[0] ?? null

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 100% 45% at 30% 0%, ${TEAL}26, transparent 60%), radial-gradient(ellipse 80% 45% at 100% 15%, rgba(255,255,255,0.06), transparent 55%)` }} />

        <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href={profile?.username ? `/app/perfil/${profile.username}` : '#'} className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
                style={{ background: '#0D3352', color: TEAL }}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  : initial}
              </div>
              <div className="min-w-0">
                <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.55)' }}>Bienvenido de vuelta</p>
                <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{firstName}</p>
              </div>
            </Link>
            <NotificationBell userId={user.id} />
          </div>

          <h1 className="font-black tracking-tighter mb-5" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', lineHeight: 1.1, color: '#F6F3EB' }}>
            Tu comunidad,<br /><span style={{ color: TEAL }}>en un solo lugar.</span>
          </h1>

          <Link
            href="/app/buscar"
            className="flex items-center gap-2.5 rounded-full px-4 py-3"
            style={{
              background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.10)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
            }}
          >
            <Search size={16} color="rgba(246,243,235,0.55)" />
            <span className="flex-1 text-sm" style={{ color: 'rgba(246,243,235,0.55)' }}>Buscar personas, grupos…</span>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(111,191,139,0.22)', color: GREEN, border: '1px solid rgba(111,191,139,0.4)' }}
            >
              <Sparkles size={10} /> Explorar
            </span>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Ministerios */}
        {ministries && ministries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-base" style={{ color: '#F6F3EB' }}>Ministerios activos</h2>
              <Link href="/ministerios" className="text-[11px] font-bold" style={{ color: TEAL }}>Ver todos</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
              {ministries.map((m, i) => {
                const ring = RING_COLORS[i % RING_COLORS.length]
                return (
                  <Link key={m.id} href={`/ministerios/${m.slug}`} className="flex-shrink-0 w-[68px] text-center">
                    <div className="relative w-[62px] h-[62px] mx-auto mb-1.5 rounded-full p-[3px]" style={{ background: ring }}>
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          backgroundImage: m.image_url ? `url(${m.image_url})` : GRADIENT_FALLBACK[i % GRADIENT_FALLBACK.length],
                          backgroundSize: 'cover', backgroundPosition: 'center',
                          border: '2px solid #061E30',
                        }}
                      />
                    </div>
                    <p className="text-[10px] font-semibold truncate" style={{ color: 'rgba(246,243,235,0.85)' }}>{m.name}</p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Para ti hoy */}
        {(latestSermon || latestDevocional) && (
          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: '#F6F3EB' }}>Para ti hoy</h2>
            <div className="space-y-2">
              {latestSermon && (
                <Link href={`/app/predicas/${latestSermon.id}`}
                  className="flex items-center gap-3 rounded-2xl p-3"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(14px) saturate(150%)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{
                      backgroundImage: latestSermon.thumbnail_url ? `url(${latestSermon.thumbnail_url})` : undefined,
                      background: latestSermon.thumbnail_url ? undefined : `${AMBER}30`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }}>
                    {!latestSermon.thumbnail_url && <Play size={16} color={AMBER} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#F6F3EB' }}>{latestSermon.title}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.55)' }}>
                      {latestSermon.speaker ?? 'Pastor Principal'} · Prédica
                    </p>
                  </div>
                  <ArrowRight size={14} color="rgba(246,243,235,0.4)" />
                </Link>
              )}
              {latestDevocional && (
                <Link href={`/biblia/devocional/${latestDevocional.id}`}
                  className="flex items-center gap-3 rounded-2xl p-3"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(14px) saturate(150%)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: `${PURPLE}30` }}>
                    <BookOpen size={16} color={PURPLE} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#F6F3EB' }}>{latestDevocional.title}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.55)' }}>
                      {latestDevocional.verse_ref ?? 'Devocional'} · {timeAgo(latestDevocional.created_at)}
                    </p>
                  </div>
                  <ArrowRight size={14} color="rgba(246,243,235,0.4)" />
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Entrar al feed de publicaciones */}
        <Link
          href="/app/comunidad/feed"
          className="flex items-center justify-between rounded-2xl px-5 py-4"
          style={{
            background: `${TEAL}18`, backdropFilter: 'blur(16px) saturate(160%)',
            border: `1px solid ${TEAL}40`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Ver publicaciones de la comunidad</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.60)' }}>Testimonios, oraciones y anuncios recientes</p>
          </div>
          <ArrowRight size={18} color={TEAL} />
        </Link>

      </div>
    </div>
  )
}
