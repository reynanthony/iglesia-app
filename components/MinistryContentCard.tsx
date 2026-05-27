'use client'

import { useState } from 'react'
import { Trash2, FileText, Video, Megaphone, Pin } from 'lucide-react'
import { deleteMinistryContent } from '@/app/actions/ministries'

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

const typeConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  articulo: { label: 'Artículo', icon: <FileText size={11} /> },
  video:    { label: 'Video',    icon: <Video size={11} /> },
  anuncio:  { label: 'Anuncio',  icon: <Megaphone size={11} /> },
}

export default function MinistryContentCard({
  item,
  ministrySlug,
  canDelete,
}: {
  item: any
  ministrySlug: string
  canDelete: boolean
}) {
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm]   = useState(false)

  const type      = typeConfig[item.type] ?? typeConfig['articulo']
  const youtubeId = item.video_url ? getYouTubeId(item.video_url) : null

  const formatDate = (date: string) => {
    const d = new Date(date)
    const M = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
    return `${d.getUTCDate()} ${M[d.getUTCMonth()]} ${d.getUTCFullYear()}`
  }

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
      return
    }
    setDeleting(true)
    await deleteMinistryContent(item.id, ministrySlug)
  }

  return (
    <article className="border border-edge hover:border-edge-2 bg-card hover:bg-muted transition group overflow-hidden rounded-xl">

      {/* YouTube embed */}
      {youtubeId && (
        <div className="relative w-full rounded-t-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={'https://www.youtube.com/embed/' + youtubeId}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Cover image */}
      {item.image_url && !youtubeId && (
        <div className="overflow-hidden rounded-t-xl">
          <img
            src={item.image_url}
            alt=""
            className="w-full object-cover h-48 group-hover:scale-105 transition duration-500"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-ink-3">
              {type.icon} {type.label}
            </span>
            {item.pinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                <Pin size={10} /> Fijado
              </span>
            )}
          </div>

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={'inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border rounded-md transition flex-shrink-0 ' + (
                confirm
                  ? 'bg-ink text-card border-ink'
                  : 'text-ink-3 border-edge hover:text-ink hover:border-edge-2'
              )}
            >
              <Trash2 size={10} />
              {confirm ? 'Confirmar' : 'Eliminar'}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="font-black text-ink text-lg leading-tight mb-3 group-hover:text-[#222222] transition tracking-tight">
          {item.title}
        </h3>

        {/* Body excerpt */}
        {item.body && (
          <p className="text-sm text-ink-2 leading-relaxed line-clamp-3 mb-4">
            {item.body}
          </p>
        )}

        {/* External video link */}
        {item.video_url && !youtubeId && (
          <a
            href={item.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#222222] hover:text-amber-700 transition mb-4"
          >
            <Video size={12} /> Ver video
          </a>
        )}

        {/* Author + date */}
        <div className="flex items-center gap-2 pt-4 border-t border-edge">
          <div className="w-6 h-6 rounded-full bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
            {item.profiles?.avatar_url ? (
              <img src={item.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-black text-ink-2">
                {item.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-ink-3 uppercase tracking-wider">
            {item.profiles?.full_name} · {formatDate(item.created_at)}
          </p>
        </div>
      </div>
    </article>
  )
}
