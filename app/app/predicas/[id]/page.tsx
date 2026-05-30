import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Calendar, User, Mic } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cmsById, cmsGet, cmsImageUrl, type DPredica } from '@/lib/directus'
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

  const [predica, related] = await Promise.all([
    cmsById<DPredica>('predicas', id),
    cmsGet<DPredica>('predicas', {
      'filter[id][_neq]': id,
      'sort': '-date',
      'limit': '4',
    }),
  ])

  if (!predica) notFound()

  const ytId    = getYoutubeId(predica.video_url)
  const thumb   = cmsImageUrl(predica.thumbnail) ?? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)
  const fmtDate = predica.date
    ? new Date(predica.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div style={{ background: '#061E30', minHeight: '100%' }}>

      {/* NAV */}
      <div className="flex items-center gap-3 px-4 py-4"
        style={{ borderBottom: '1px solid #0D3352', position: 'sticky', top: 0, background: '#061E30', zIndex: 10 }}>
        <Link href="/app/en-vivo"
          className="flex items-center justify-center w-8 h-8 rounded-lg transition"
          style={{ background: '#0B2D47', border: '1px solid #0D3352', color: '#76ABAE' }}>
          <ArrowLeft size={15} />
        </Link>
        <p className="font-bold text-sm truncate flex-1" style={{ color: '#F6F3EB' }}>
          {predica.title}
        </p>
      </div>

      {/* VIDEO PLAYER */}
      {ytId ? (
        <VideoPlayer ytId={ytId} thumbnail={thumb} title={predica.title} />
      ) : thumb ? (
        <div className="w-full bg-black" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
          <img src={thumb} alt={predica.title} className="w-full h-full object-cover opacity-60" />
        </div>
      ) : (
        <div className="w-full flex items-center justify-center" style={{ aspectRatio: '16/9', background: '#0B2D47' }}>
          <Play size={40} style={{ color: '#76ABAE', opacity: 0.4 }} />
        </div>
      )}

      {/* META */}
      <div className="px-4 py-5" style={{ borderBottom: '1px solid #0D3352' }}>
        {predica.series && (
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg mb-3"
            style={{ background: 'rgba(118,171,174,0.12)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.20)' }}>
            <Mic size={9} /> {predica.series}
          </div>
        )}
        <h1 className="font-black tracking-tight leading-tight mb-3"
          style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: '#F6F3EB' }}>
          {predica.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          {predica.speaker && (
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
              <User size={12} />
              <span className="text-[12px] font-bold">{predica.speaker}</span>
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
      {predica.description && (
        <div className="px-4 py-5" style={{ borderBottom: '1px solid #0D3352' }}>
          {predica.description.split('\n\n').map((p, i) =>
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
                    {r.speaker && (
                      <p className="text-[11px] truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>{r.speaker}</p>
                    )}
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
