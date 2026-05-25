'use client'

import { useState } from 'react'
import { Trash2, FileText, Video, Megaphone, Pin } from 'lucide-react'
import { deleteMinistryContent } from '@/app/actions/ministries'

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
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
  const [confirm, setConfirm] = useState(false)

  const typeIcon = {
    articulo: <FileText size={14} className="text-blue-400" />,
    video: <Video size={14} className="text-red-400" />,
    anuncio: <Megaphone size={14} className="text-amber-400" />,
  }[item.type] ?? <FileText size={14} />

  const typeLabel = {
    articulo: 'Articulo',
    video: 'Video',
    anuncio: 'Anuncio',
  }[item.type] ?? 'Contenido'

  const typeColor = {
    articulo: 'bg-blue-400/10 text-blue-400',
    video: 'bg-red-400/10 text-red-400',
    anuncio: 'bg-amber-400/10 text-amber-400',
  }[item.type] ?? 'bg-slate-800 text-slate-400'

  const youtubeId = item.video_url ? getYouTubeId(item.video_url) : null

  const timeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (diff < 60) return 'ahora'
    if (diff < 3600) return Math.floor(diff / 60) + 'm'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h'
    return new Date(date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

      {/* Video embed */}
      {youtubeId && (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={'https://www.youtube.com/embed/' + youtubeId}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Imagen */}
      {item.image_url && !youtubeId && (
        <img src={item.image_url} alt="" className="w-full object-cover max-h-64" />
      )}

      {/* Contenido */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={'flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ' + typeColor}>
              {typeIcon} {typeLabel}
            </span>
            {item.pinned && (
              <span className="flex items-center gap-1 text-xs text-amber-500">
                <Pin size={11} /> Anclado
              </span>
            )}
          </div>

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={'flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition flex-shrink-0 ' + (
                confirm
                  ? 'bg-red-500 text-white'
                  : 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'
              )}
            >
              <Trash2 size={12} />
              {confirm ? 'Confirmar' : ''}
            </button>
          )}
        </div>

        <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>

        {item.body && (
          <p className="text-slate-400 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
            {item.body}
          </p>
        )}

        {item.video_url && !youtubeId && (
          <a
            href={item.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 text-sm underline"
          >
            Ver video
          </a>
        )}

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700 flex-shrink-0">
            {item.profiles?.avatar_url ? (
              <img src={item.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                {item.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {item.profiles?.full_name} · {timeAgo(item.created_at)}
          </p>
        </div>
      </div>
    </div>
  )
}