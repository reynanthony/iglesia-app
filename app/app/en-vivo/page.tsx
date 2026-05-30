import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Radio, Play, Flame } from 'lucide-react'
import LiveChatBox from '@/components/app/LiveChatBox'

function youtubeEmbedUrl(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    let id: string | null = null
    if (u.hostname.includes('youtu.be')) {
      id = u.pathname.slice(1)
    } else if (u.hostname.includes('youtube.com')) {
      id = u.searchParams.get('v') ?? u.pathname.replace('/embed/', '')
    }
    if (!id) return null
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
  } catch {
    return null
  }
}

export default async function EnVivoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', user.id)
    .single()

  // Fetch live config
  const { data: configs } = await supabase.from('site_config').select('key, value')
  const cfg = Object.fromEntries((configs ?? []).map((c: any) => [c.key, c.value]))
  const isLive   = cfg['is_live'] === 'true'
  const liveUrl  = cfg['live_url'] ?? ''
  const liveTitle = cfg['live_title'] ?? 'Culto en vivo'
  const embedUrl = youtubeEmbedUrl(liveUrl)

  // Fetch last 4 predicas for offline state (from Supabase, same source as admin)
  const { data: rawPredicas } = await supabase
    .from('ministry_content')
    .select('id, title, video_url, thumbnail:image_url, speaker:profiles(full_name), date:created_at')
    .eq('type', 'video')
    .order('created_at', { ascending: false })
    .limit(4)
  const predicas = (rawPredicas ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    speaker: p.speaker?.full_name ?? null,
    date: p.date,
    thumbnail: p.thumbnail,
    video_url: p.video_url,
  }))

  const currentProfile = {
    full_name: profile?.full_name ?? 'Usuario',
    username:  profile?.username  ?? '',
    avatar_url: profile?.avatar_url ?? null,
  }

  if (isLive && embedUrl) {
    return (
      <div style={{ background: '#061E30', minHeight: '100%' }}>

        {/* Live badge header */}
        <div className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid #0D3352' }}>
          <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171', border: '1px solid rgba(248,113,113,0.30)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            En vivo
          </span>
          <p className="font-bold text-sm truncate" style={{ color: '#F6F3EB' }}>{liveTitle}</p>
        </div>

        {/* Responsive split: video top, chat bottom on mobile; side by side on desktop */}
        <div className="flex flex-col md:flex-row" style={{ height: 'calc(100% - 57px)' }}>

          {/* Video */}
          <div className="md:flex-1 bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={embedUrl}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 'none' }}
            />
          </div>

          {/* Live chat */}
          <div className="flex flex-col md:w-80 md:border-l" style={{ borderColor: '#0D3352', minHeight: 320 }}>
            <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #0D3352' }}>
              <p className="text-[11px] font-black uppercase tracking-wider"
                style={{ color: 'rgba(118,171,174,0.60)' }}>Chat del culto</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <LiveChatBox currentUserId={user.id} currentProfile={currentProfile} />
            </div>
          </div>
        </div>

        {/* Oración en vivo */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid #0D3352' }}>
          <Link href="/app/oracion/nueva"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold w-full max-w-sm mx-auto"
            style={{ background: '#0B2D47', border: '1px solid #0D3352', color: '#76ABAE' }}>
            <Flame size={16} /> Enviar petición de oración
          </Link>
        </div>
      </div>
    )
  }

  // Offline state
  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #0D3352' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(118,171,174,0.07), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: '#0D3352' }}>
            <Radio size={18} style={{ color: '#76ABAE' }} />
          </div>
          <h1 className="font-black tracking-tighter"
            style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: '#F6F3EB' }}>
            Iglesia<br /><span style={{ color: '#76ABAE' }}>en Vivo.</span>
          </h1>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'rgba(246,243,235,0.45)' }}>
            No hay transmisión activa en este momento. Te avisamos cada domingo.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Horario */}
        <div className="p-5 rounded-2xl" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
            style={{ color: 'rgba(118,171,174,0.60)' }}>Próximo culto</p>
          <p className="font-black text-xl tracking-tight" style={{ color: '#F6F3EB' }}>
            Domingo
          </p>
          <p className="text-sm mt-1" style={{ color: 'rgba(246,243,235,0.50)' }}>
            10:00 AM — Culto principal · También en línea
          </p>
        </div>

        {/* Últimas predicas */}
        {predicas.length > 0 && (
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
              style={{ color: 'rgba(118,171,174,0.60)' }}>Últimas predicas</p>
            <div className="space-y-2">
              {predicas.map(p => (
                <Link key={p.id}
                  href={`/app/predicas/${p.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl group transition"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ background: '#0D3352' }}>
                    {p.thumbnail
                      ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                      : <Play size={18} style={{ color: '#76ABAE' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-[#76ABAE] transition"
                      style={{ color: '#F6F3EB' }}>{p.title}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                      {p.speaker}{p.date ? ` · ${new Date(p.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}` : ''}
                    </p>
                  </div>
                  <Play size={14} style={{ color: 'rgba(246,243,235,0.30)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
            <Link href="/predicas"
              className="block text-center mt-3 text-[12px] font-bold"
              style={{ color: 'rgba(118,171,174,0.60)' }}>
              Ver todas las predicas →
            </Link>
          </section>
        )}

        {/* Oración */}
        <Link href="/app/oracion/nueva"
          className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold w-full"
          style={{ background: '#0B2D47', border: '1px solid #0D3352', color: '#76ABAE' }}>
          <Flame size={16} /> Enviar petición de oración
        </Link>

      </div>
    </div>
  )
}
