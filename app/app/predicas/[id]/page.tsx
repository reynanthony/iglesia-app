import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Calendar, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import VideoPlayer from '@/components/VideoPlayer'
import { cmsById, cmsGet, cmsImageUrl, DPredica } from '@/lib/directus'

export const revalidate = 300

function getYoutubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default async function AppPredicaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const item = await cmsById<DPredica>('predicas', id)
  if (!item) notFound()

  const related = (await cmsGet<DPredica>('predicas', { sort: '-id', limit: '5' }))
    .filter(p => p.id !== item.id)
    .slice(0, 4)

  const ytId  = getYoutubeId(item.video_url)
  const thumb = cmsImageUrl(item.thumbnail) ?? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)
  const fmtDate = item.date
    ? new Date(item.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

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
          {item.speaker && (
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
              <User size={12} />
              <span className="text-[12px] font-bold">{item.speaker}</span>
            </div>
          )}
          {fmtDate && (
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Calendar size={12} />
              <span className="text-[12px]">{fmtDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      {item.description && (
        <div className="px-4 py-5" style={{ borderBottom: '1px solid #0D3352' }}>
          {item.description.split('\n\n').map((p, i) =>
            p.trim() ? (
              <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(246,243,235,0.55)' }}>
                {p}
              </p>
            ) : null
          )}
        </div>
      )}

      {/* MORE */}
      {related.length > 0 && (
        <div className="px-4 py-5">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-3"
            style={{ color: 'rgba(118,171,174,0.60)' }}>Más prédicas</p>
          <div className="space-y-2">
            {related.map(r => {
              const rYtId = getYoutubeId(r.video_url)
              const rThumb = cmsImageUrl(r.thumbnail) ?? (rYtId ? `https://img.youtube.com/vi/${rYtId}/mqdefault.jpg` : null)
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
