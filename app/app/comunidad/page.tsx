import Link from 'next/link'
import { Search, ArrowRight, Sparkles, Play, BookOpen, Flame, Calendar } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getUser, getProfile } from '@/lib/supabase/cached-user'
import { createClient } from '@/lib/supabase/server'
import { GoldArt } from '@/components/app/GoldArt'

const BG = '#101217'
const CARD_GRAD = 'linear-gradient(165deg, #1d2029, #131520)'
const FEATURED_GRAD = 'linear-gradient(150deg, #262b38, #171922)'
const BORDER = '#292E3B'
const MUTED = '#8B92A2'
const GOLD = '#FFCC00'
const INK = '#FFFFFF'

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

  const [{ data: ministries }, { data: sermons }, { data: devocionales }, { count: prayerCount }] = await Promise.all([
    supabase.from('ministries').select('id, name, slug').is('parent_id', null).order('name').limit(10),
    supabase.from('sermons').select('id, title, speaker, sermon_date').eq('published', true).order('sermon_date', { ascending: false }).limit(1),
    supabase.from('devocionales').select('id, title, verse_ref, created_at').eq('published', true).order('created_at', { ascending: false }).limit(1),
    supabase.from('prayer_requests').select('id', { count: 'exact', head: true }).eq('is_public', true),
  ])

  const firstName = (profile?.full_name ?? 'amigo').split(' ')[0]
  const latestSermon = sermons?.[0] ?? null
  const latestDevocional = devocionales?.[0] ?? null

  const dateLabelRaw = new Date().toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })
  const dateLabel = dateLabelRaw.charAt(0).toUpperCase() + dateLabelRaw.slice(1)

  return (
    <div style={{ background: BG, minHeight: '100%' }} className="font-app">
      <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 100% 45% at 30% 0%, ${GOLD}14, transparent 60%)` }} />

        <div className="relative max-w-2xl mx-auto px-4 pt-6 pb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: MUTED }}>
            Bienvenido de vuelta, {firstName}
          </p>
          <p className="text-[11px] font-medium mb-4" style={{ color: MUTED }}>{dateLabel}</p>

          <h1 className="font-extrabold tracking-tight mb-5" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', lineHeight: 1.1, color: INK }}>
            Tu comunidad,<br /><span style={{ color: GOLD }}>en un solo lugar.</span>
          </h1>

          <Link
            href="/app/buscar"
            className="flex items-center gap-2.5 rounded-2xl px-4 py-3.5"
            style={{ background: '#161820', border: `1px solid ${BORDER}` }}
          >
            <Search size={16} color={MUTED} />
            <span className="flex-1 text-sm" style={{ color: MUTED }}>Buscar personas, grupos…</span>
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: GOLD, color: '#14140F' }}
            >
              <Sparkles size={10} /> Explorar
            </span>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-7">

        {/* Ministerios */}
        {ministries && ministries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[13.5px]" style={{ color: INK }}>Ministerios</h2>
              <Link href="/ministerios" className="text-[11px] font-bold" style={{ color: MUTED }}>Ver todos</Link>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
              <Link href="/ministerios" className="flex-shrink-0 px-4 py-2 rounded-xl text-[11px] font-bold" style={{ background: GOLD, color: '#14140F' }}>
                Todos
              </Link>
              {ministries.map(m => (
                <Link key={m.id} href={`/ministerios/${m.slug}`}
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-[11px] font-semibold"
                  style={{ background: '#181A22', color: MUTED, border: `1px solid ${BORDER}` }}>
                  {m.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prédica destacada */}
        {latestSermon && (
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-bold text-[13.5px]" style={{ color: INK }}>Prédica destacada</h2>
              <Link href="/predicas" className="text-[11px] font-bold" style={{ color: MUTED }}>Ver todas</Link>
            </div>
            <div className="relative rounded-[22px] p-4 overflow-hidden"
              style={{
                background: FEATURED_GRAD, border: `1px solid ${BORDER}`,
                boxShadow: '0 14px 28px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}>
              <div className="absolute right-[-10px] top-0 bottom-0 w-[42%]">
                <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(90deg, #171922, transparent 60%)' }} />
                <div className="absolute inset-1.5 rounded-[18px] overflow-hidden">
                  <GoldArt uid="feat-sermon" light="#FFE08A" dark="#C98A00" icon={Play} iconSize={34} />
                </div>
              </div>
              <div className="relative z-10 max-w-[62%]">
                <h3 className="text-[16.5px] font-extrabold leading-tight" style={{ color: INK }}>{latestSermon.title}</h3>
                <p className="text-[10.5px] mt-0.5" style={{ color: MUTED }}>{latestSermon.speaker ?? 'Pastor Principal'}</p>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold mt-2.5" style={{ color: MUTED }}>
                  <Calendar size={11} />
                  {new Date(latestSermon.sermon_date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
                </div>
                <Link href={`/app/predicas/${latestSermon.id}`}
                  className="inline-flex items-center gap-1.5 mt-3.5 px-4 py-2.5 rounded-xl text-[11px] font-extrabold"
                  style={{ background: GOLD, color: '#14140F' }}>
                  Ver prédica <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Muro de Oración + Devocional */}
        {((prayerCount ?? 0) > 0 || latestDevocional) && (
          <section className="grid grid-cols-2 gap-3">
            <Link href="/app/oracion" className="relative rounded-[18px] p-3.5 overflow-hidden"
              style={{
                height: 168, background: CARD_GRAD, border: `1px solid ${BORDER}`,
                boxShadow: '0 10px 22px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
              <div className="absolute" style={{ right: 4, bottom: 30, width: 78, height: 78 }}>
                <GoldArt uid="prayer-wall" light="#FF9AA8" dark="#C6304A" icon={Flame} iconSize={26} />
              </div>
              <div className="relative z-10">
                <h4 className="text-[12.5px] font-extrabold" style={{ color: INK }}>Muro de Oración</h4>
                <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>Clamor comunitario</p>
              </div>
              <div className="relative z-10 flex items-center justify-between text-[9.5px] font-bold pt-2"
                style={{ borderTop: `1px solid ${BORDER}`, color: MUTED }}>
                <span className="flex items-center gap-1" style={{ color: GOLD }}>
                  <Flame size={10} /> {prayerCount ?? 0} activas
                </span>
              </div>
            </Link>

            {latestDevocional && (
              <Link href={`/biblia/devocional/${latestDevocional.id}`} className="relative rounded-[18px] p-3.5 overflow-hidden"
                style={{
                  height: 168, background: CARD_GRAD, border: `1px solid ${BORDER}`,
                  boxShadow: '0 10px 22px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}>
                <div className="absolute" style={{ right: 4, bottom: 30, width: 78, height: 78 }}>
                  <GoldArt uid="devocional" light="#FFD98A" dark="#C98A1F" icon={BookOpen} iconSize={26} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-[12.5px] font-extrabold" style={{ color: INK }}>Devocional del día</h4>
                  <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{timeAgo(latestDevocional.created_at)}</p>
                </div>
                <div className="relative z-10 flex items-center justify-between text-[9.5px] font-bold pt-2"
                  style={{ borderTop: `1px solid ${BORDER}`, color: MUTED }}>
                  <span className="truncate" style={{ color: GOLD }}>{latestDevocional.verse_ref ?? 'Palabra de vida'}</span>
                </div>
              </Link>
            )}
          </section>
        )}

        {/* Entrar al feed de publicaciones */}
        <Link
          href="/app/comunidad/feed"
          className="flex items-center justify-between rounded-2xl px-5 py-4"
          style={{ background: '#1d2029', border: `1px solid ${BORDER}` }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: INK }}>Ver publicaciones de la comunidad</p>
            <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Testimonios, oraciones y anuncios recientes</p>
          </div>
          <ArrowRight size={18} color={GOLD} />
        </Link>

      </div>
    </div>
  )
}
