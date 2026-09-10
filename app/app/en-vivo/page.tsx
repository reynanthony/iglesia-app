import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Radio, Play, Flame } from 'lucide-react'
import LiveVideoChat from '@/components/app/LiveVideoChat'
import { GoldArt } from '@/components/app/GoldArt'
import { BG, CARD, CARD_GRAD, BORDER, MUTED, GOLD, GOLD_INK, INK, CARD_SHADOW } from '@/lib/gold-theme'

function getYoutubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
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
  const liveYtId  = getYoutubeId(liveUrl)

  // Fetch last 4 predicas
  const { data: rawPredicas } = await supabase
    .from('sermons').select('*').eq('published', true)
    .order('sermon_date', { ascending: false }).limit(4)
  const predicas = (rawPredicas ?? []).map(p => {
    const ytId = getYoutubeId(p.video_url ?? '')
    return {
      id: p.id,
      title: p.title,
      speaker: p.speaker ?? null,
      date: p.sermon_date,
      thumbnail: p.thumbnail_url ?? (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null),
    }
  })

  const currentProfile = {
    full_name: profile?.full_name ?? 'Usuario',
    username:  profile?.username  ?? '',
    avatar_url: profile?.avatar_url ?? null,
  }

  if (isLive) {
    return (
      <div className="flex flex-col font-app" style={{ background: BG, height: '100%' }}>

        {/* Hero — franja centrada con degradado, como una portada de transmisión */}
        <div className="relative overflow-hidden flex flex-col items-center text-center px-4 py-6"
          style={{
            background: `radial-gradient(ellipse 130% 100% at 50% 0%, rgba(227,123,133,0.14), transparent 65%), linear-gradient(180deg, #1a1c22 0%, ${BG} 100%)`,
            borderBottom: `1px solid ${BORDER}`,
          }}>
          <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full mb-2.5"
            style={{ background: 'rgba(214,40,75,0.9)', color: '#fff' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            En vivo
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: MUTED }}>
            Transmitiendo desde
          </p>
          <p className="font-black text-lg truncate max-w-full" style={{ color: INK }}>{liveTitle}</p>
        </div>

        <LiveVideoChat
          liveUrl={liveUrl}
          liveTitle={liveTitle}
          currentUserId={user.id}
          currentProfile={currentProfile}
        />

        {/* Oración en vivo */}
        <div className="px-4 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <Link href="/app/oracion/nueva"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold w-full max-w-sm mx-auto"
            style={{ background: GOLD, color: GOLD_INK }}>
            <Flame size={16} /> Enviar petición de oración
          </Link>
        </div>
      </div>
    )
  }

  // Offline state
  return (
    <div className="font-app" style={{ background: BG, minHeight: '100%' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${GOLD}10, transparent 65%)` }} />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          <div className="relative w-12 h-12 mb-4">
            <GoldArt uid="envivo-header" light="#B9A6FF" dark="#4B3A8F" icon={Radio} iconSize={20} />
          </div>
          <h1 className="font-black tracking-tighter"
            style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 0.9, color: INK }}>
            En<br /><span style={{ color: GOLD }}>Vivo.</span>
          </h1>
          <p className="text-sm mt-3 leading-relaxed max-w-sm" style={{ color: MUTED }}>
            Ahora mismo no hay transmisión — y no hace falta para encontrarte con Dios. Mientras tanto, aquí tienes la Palabra y las últimas prédicas.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Horario */}
        <div className="p-5 rounded-2xl" style={{ background: CARD_GRAD, border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: GOLD }}>Próximo culto</p>
          <p className="font-black text-xl tracking-tight" style={{ color: INK }}>
            Domingo
          </p>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            10:00 AM — Culto principal · También en línea
          </p>
        </div>

        {/* Últimas predicas */}
        {predicas.length > 0 && (
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: GOLD }}>Últimas predicas</p>
            <div className="space-y-2">
              {predicas.map(p => (
                <Link key={p.id}
                  href={`/app/predicas/${p.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl group transition"
                  style={{ background: CARD_GRAD, border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
                  <div className="relative w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: CARD }}>
                    {p.thumbnail
                      ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                      : <GoldArt uid={`predica-${p.id}`} light="#FFE08A" dark="#C98A00" icon={Play} iconSize={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate transition" style={{ color: INK }}>{p.title}</p>
                    <p className="text-[11px]" style={{ color: MUTED }}>
                      {p.speaker}{p.date ? ` · ${new Date(p.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}` : ''}
                    </p>
                  </div>
                  <Play size={14} style={{ color: MUTED, flexShrink: 0 }} />
                </Link>
              ))}
            </div>
            <Link href="/predicas" className="block text-center mt-3 text-[12px] font-bold" style={{ color: MUTED }}>
              Ver todas las predicas →
            </Link>
          </section>
        )}

        {/* Oración */}
        <Link href="/app/oracion/nueva"
          className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold w-full"
          style={{ background: GOLD, color: GOLD_INK }}>
          <Flame size={16} /> Enviar petición de oración
        </Link>

      </div>
    </div>
  )
}
