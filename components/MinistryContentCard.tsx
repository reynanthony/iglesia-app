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

  const typeConfig = {
    articulo: { label: 'Artículo', icon: <FileText size={12} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    video:    { label: 'Video',    icon: <Video size={12} />,    color: 'bg-red-50 text-red-600 border-red-100' },
    anuncio:  { label: 'Anuncio',  icon: <Megaphone size={12} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  }[item.type] ?? { label: 'Contenido', icon: <FileText size={12} />, color: 'bg-slate-100 text-slate-600 border-slate-200' }

  const youtubeId = item.video_url ? getYouTubeId(item.video_url) : null

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })

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
    <article className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition group">

      {/* YouTube embed */}
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

      {/* Cover image */}
      {item.image_url && !youtubeId && (
        <div className="overflow-hidden">
          <img
            src={item.image_url}
            alt=""
            className="w-full object-cover h-52 group-hover:scale-105 transition duration-500"
          />
        </div>
      )}

      <div className="p-5">
        {/* Top row: type badge + pin + delete */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ' + typeConfig.color}>
              {typeConfig.icon} {typeConfig.label}
            </span>
            {item.pinned && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium">
                <Pin size={11} /> Fijado
              </span>
            )}
          </div>

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={'inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition ' + (
                confirm
                  ? 'bg-red-500 text-white border-red-500'
                  : 'text-slate-400 border-slate-200 hover:text-red-500 hover:border-red-200'
              )}
            >
              <Trash2 size={11} />
              {confirm ? 'Confirmar' : 'Eliminar'}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 group-hover:text-amber-600 transition">
          {item.title}
        </h3>

        {/* Body excerpt */}
        {item.body && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-3">
            {item.body}
          </p>
        )}

        {/* External video link */}
        {item.video_url && !youtubeId && (
          <a
            href={item.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 transition mb-3"
          >
            <Video size={14} /> Ver video
          </a>
        )}

        {/* Author + date */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
            {item.profiles?.avatar_url ? (
              <img src={item.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                {item.profiles?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400">
            <span className="font-medium text-slate-600">{item.profiles?.full_name}</span>
            {' · '}
            {formatDate(item.created_at)}
          </p>
        </div>
      </div>
    </article>
  )
}
