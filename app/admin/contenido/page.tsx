import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Pin, Trash2, Play, FileText, Megaphone, ImageOff, Plus, Pencil } from 'lucide-react'
import { pinContent, deleteContent } from '@/app/actions/admin'

const typeLabels: Record<string, { label: string; Icon: any; color: string }> = {
  articulo:  { label: 'Artículo',  Icon: FileText,   color: 'text-blue-400 bg-blue-400/10' },
  video:     { label: 'Video',     Icon: Play,        color: 'text-purple-400 bg-purple-400/10' },
  anuncio:   { label: 'Anuncio',   Icon: Megaphone,   color: 'text-yellow-400 bg-yellow-400/10' },
}

export default async function AdminContenidoPage({
  searchParams,
}: {
  searchParams: Promise<{ ministry?: string; type?: string }>
}) {
  const { ministry: ministryFilter, type: typeFilter } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('ministry_content')
    .select('*, ministries(id, name, slug), profiles(full_name, username)')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (ministryFilter) query = query.eq('ministry_id', ministryFilter)
  if (typeFilter) query = query.eq('type', typeFilter)

  const { data: content } = await query
  const { data: ministries } = await supabase
    .from('ministries')
    .select('id, name')
    .order('name')

  return (
    <div>
      {/* Header */}
      <div className="border-b px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
        style={{ borderColor: '#1F1F1F' }}>
        <div>
          <h1 className="font-bold text-lg text-white">Contenido de ministerios</h1>
          <p className="text-[13px] mt-0.5" style={{ color: '#5A5A5A' }}>
            {content?.length ?? 0} publicaciones · artículos, videos, anuncios
          </p>
        </div>
        <Link href="/admin/contenido/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
          style={{ background: '#F5F5F5' }}>
          <Plus size={14} /> Nuevo contenido
        </Link>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-8 pt-5 flex flex-wrap gap-2">
        {/* Ministry filter */}
        <div className="flex flex-wrap gap-2">
          {[{ id: '', name: 'Todos' }, ...(ministries ?? [])].map(m => {
            const isActive = ministryFilter === m.id || (!ministryFilter && m.id === '')
            const params = new URLSearchParams()
            if (m.id) params.set('ministry', m.id)
            if (typeFilter) params.set('type', typeFilter)
            const href = '/admin/contenido' + (params.toString() ? '?' + params.toString() : '')
            return (
              <a key={m.id} href={href}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'text-black font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{ background: isActive ? '#F5F5F5' : '#1A1A1A', border: '1px solid #2A2A2A' }}>
                {m.name}
              </a>
            )
          })}
        </div>

        <div className="w-px h-6 self-center" style={{ background: '#2A2A2A' }} />

        {/* Type filter */}
        {[{ id: '', label: 'Tipo: todos' }, { id: 'articulo', label: 'Artículos' }, { id: 'video', label: 'Videos' }, { id: 'anuncio', label: 'Anuncios' }].map(t => {
          const isActive = typeFilter === t.id || (!typeFilter && t.id === '')
          const params = new URLSearchParams()
          if (ministryFilter) params.set('ministry', ministryFilter)
          if (t.id) params.set('type', t.id)
          const href = '/admin/contenido' + (params.toString() ? '?' + params.toString() : '')
          return (
            <a key={t.id} href={href}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                isActive ? 'text-black' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{ background: isActive ? '#F5F5F5' : '#1A1A1A', border: '1px solid #2A2A2A' }}>
              {t.label}
            </a>
          )
        })}
      </div>

      {/* List */}
      <div className="px-4 md:px-8 py-5 space-y-3">
        {(!content || content.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#1F1F1F' }}>
            <p className="text-sm" style={{ color: '#4D4D4D' }}>Sin contenido publicado aún.</p>
          </div>
        )}

        {content?.map((item: any) => {
          const meta = typeLabels[item.type] ?? typeLabels.articulo
          const Icon = meta.Icon
          return (
            <div key={item.id} className="rounded-2xl border overflow-hidden flex items-center gap-4 p-4"
              style={{ borderColor: item.pinned ? '#2A3A2A' : '#1F1F1F', background: item.pinned ? '#0D1A0D' : '#111111' }}>

              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ background: '#1A1A1A' }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  : item.type === 'video'
                    ? <Play size={18} style={{ color: '#333333' }} />
                    : <ImageOff size={18} style={{ color: '#333333' }} />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  {item.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: '#1A2A1A', color: '#6BCB6B' }}>
                      <Pin size={9} /> Fijado
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="text-[11px]" style={{ color: '#4D4D4D' }}>
                    {(item.ministries as any)?.name ?? '—'}
                  </span>
                </div>
                <p className="font-bold text-white text-sm truncate">{item.title}</p>
                <p className="text-[12px] truncate" style={{ color: '#5A5A5A' }}>
                  {(item.profiles as any)?.full_name ?? 'Desconocido'} ·{' '}
                  {new Date(item.created_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/contenido/${item.id}/editar`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                  <Pencil size={13} style={{ color: '#8A8A8A' }} />
                </Link>
                <form action={async () => {
                  'use server'
                  await pinContent(item.id, !item.pinned)
                }}>
                  <button type="submit"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition"
                    style={{ background: item.pinned ? '#1A2A1A' : '#1A1A1A', border: '1px solid #2A2A2A' }}
                    title={item.pinned ? 'Desfijar' : 'Fijar'}>
                    <Pin size={13} style={{ color: item.pinned ? '#6BCB6B' : '#4D4D4D' }} />
                  </button>
                </form>
                <form action={async () => {
                  'use server'
                  await deleteContent(item.id)
                }}>
                  <button type="submit"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition"
                    style={{ background: '#1A1A1A' }}>
                    <Trash2 size={13} style={{ color: '#6B3333' }} />
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
