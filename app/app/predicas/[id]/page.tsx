import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Calendar, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import VideoPlayer from '@/components/VideoPlayer'

export const revalidate = 300

function getYoutubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default async function AppPredicaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: item } = await supabase
    .from('ministry_content')
    .select('id, title, body, video_url, image_url, created_at, profiles(full_name, avatar_url), ministries(name, slug)')
    .eq('id', id)
    .eq('type', 'video')
    .single()

  if (!item) notFound()

  const { data: related } = await supabase
    .from('ministry_content')
    .select('id, title, video_url, image_url, created_at')
    .eq('type', 'video')
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(4)

  const profile  = item.profiles as any
  const ytId     = getYoutubeId(item.video_url)
  const thumb    = item.image_url ?? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)
  const fmtDate  = new Date(item.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* NAV */}
      <div className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10"
        style={{ borderBottom: '1px solid #0D3352', background: '#061E30' }}>
        <Link href="/app/en-vivo"
          className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
          style={{ background: '#0B2D47', border: '1px solid #0D3352', color: '#76ABAE' }}>
          <ArrowLeft size={16} />
        </Link>
        <p className="font-bold text-sm truncate flex-1" style={{ color: '#F6F3EB' }}>
          {item.title}
        </p>
      </div>

      {/* VIDEO PLAYER */}
      {ytId ? (
        <VideoPlayer ytId={ytId} thumbnail={thumb} title={item.title} />
      ) : thumb ? (
        <div className="w-full bg-black" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
          <img src={thumb} alt={item.title} className="w-full h-full object-cover opacity-60" />
        </div>
      ) : (
        <div className="w-full flex items-center justify-center" style={{ aspectRatio: '16/9', background: '#0B2D47' }}>
          <Play size={40} style={{ color: '#76ABAE', opacity: 0.4 }} />
        </div>
      )}

      {/* META */}
      <div className="px-4 py-5" style={{ borderBottom: '1px solid #0D3352' }}>
        <h1 className="font-black tracking-tight leading-tight mb-3"
          style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', color: '#F6F3EB' }}>
          {item.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          {profile?.full_name && (
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
              <User size={12} />
              <span className="text-[12px] font-bold">{profile.full_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5" style={{ color: 'rgba(246,243,235,0.35)' }}>
            <Calendar size={12} />
            <span className="text-[12px]">{fmtDate}</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      {item.body && (
        <div className="px-4 py-5" style={{ borderBottom: '1px solid #0D3352' }}>
          {item.body.split('\n\n').map((p: string, i: number) =>
            p.trim() ? (
              <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(246,243,235,0.55)' }}>
                {p}
              </p>
            ) : null
          )}
        </div>
      )}

      {/* MORE */}
      {(related ?? []).length > 0 && (
        <div className="px-4 py-5">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
            style={{ color: 'rgba(118,171,174,0.60)' }}>Más prédicas</p>
          <div className="space-y-2">
            {(related ?? []).map((r: any) => {
              const rYtId = getYoutubeId(r.video_url)
              const rThumb = r.image_url ?? (rYtId ? `https://img.youtube.com/vi/${rYtId}/mqdefault.jpg` : null)
              return (
                <Link key={r.id} href={`/app/predicas/${r.id}`}
                  className="flex items-center gap-3 p-3 rounded-2xl group transition"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                  <div className="w-16 h-10 rounded-lg flex-shrink-0 overflow-hidden relative"
                    style={{ background: '#0D3352' }}>
                    {rThumb
                      ? <img src={rThumb} alt="" className="w-full h-full object-cover" />
                      : <Play size={14} style={{ color: '#76ABAE', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate group-hover:text-[#76ABAE] transition"
                      style={{ color: '#F6F3EB' }}>{r.title}</p>
                  </div>
                  <Play size={13} style={{ color: 'rgba(246,243,235,0.25)', flexShrink: 0 }} />
                </Link>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
