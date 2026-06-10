import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Newspaper, Plus, Pencil, Eye } from 'lucide-react'
import TogglePublicacionButton from '@/components/admin/TogglePublicacionButton'
import DeletePublicacionButton from '@/components/admin/DeletePublicacionButton'

const CAT_LABEL: Record<string, string> = {
  campana:          'Campaña',
  serie:            'Serie',
  'evento-especial': 'Evento Especial',
  ministerio:       'Ministerio',
  anuncio:          'Anuncio',
  general:          'General',
}
const CAT_COLOR: Record<string, string> = {
  campana:          '#C9A227',
  serie:            '#A855F7',
  'evento-especial': '#76ABAE',
  ministerio:       '#4ADE80',
  anuncio:          '#F87171',
  general:          'rgba(246,243,235,0.50)',
}

export default async function PublicacionesAdminPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('publicaciones')
    .select('*')
    .order('created_at', { ascending: false })

  const activas = (items ?? []).filter(i => i.is_active).length

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Publicaciones</h1>
            <p className="text-xs md:text-sm mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              {activas} activa{activas !== 1 ? 's' : ''} · {(items ?? []).length} total
            </p>
          </div>
          <Link href="/admin/publicaciones/nueva"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold flex-shrink-0"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={13} /><span className="hidden sm:inline">Nueva publicación</span><span className="sm:hidden">Nueva</span>
          </Link>
        </div>

        {/* Info */}
        <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(118,171,174,0.06)', border: '1px solid rgba(118,171,174,0.15)' }}>
          <Newspaper size={14} style={{ color: '#76ABAE', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(246,243,235,0.72)' }}>
            Las publicaciones son landing pages editoriales para campañas, series y eventos especiales.
            Enlázalas desde el destino CTA de una campaña usando <code className="text-[10px] px-1 rounded" style={{ background: '#0D3352' }}>/publicaciones/slug</code>.
          </p>
        </div>

        {/* List */}
        {(!items || items.length === 0) ? (
          <div className="rounded-xl p-12 text-center" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <Newspaper size={28} style={{ color: 'rgba(246,243,235,0.15)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>No hay publicaciones todavía.</p>
            <Link href="/admin/publicaciones/nueva"
              className="inline-flex items-center gap-1 mt-3 text-sm font-bold"
              style={{ color: '#76ABAE' }}>
              <Plus size={13} /> Crear primera publicación
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(item => {
              const cc = CAT_COLOR[item.category] ?? '#76ABAE'
              return (
                <div key={item.id} className="rounded-xl overflow-hidden"
                  style={{
                    background: '#0B2D47',
                    border: `1px solid ${item.is_active ? 'rgba(118,171,174,0.20)' : '#0D3352'}`,
                    opacity: item.is_active ? 1 : 0.6,
                  }}>
                  <div className="flex items-stretch">
                    {/* Cover thumbnail */}
                    {item.cover_image ? (
                      <div className="w-16 md:w-24 flex-shrink-0 relative overflow-hidden">
                        <img src={item.cover_image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'rgba(5,24,40,0.35)' }} />
                      </div>
                    ) : (
                      <div className="w-16 md:w-24 flex-shrink-0 flex items-center justify-center"
                        style={{ background: item.cover_color ?? '#093C5D' }}>
                        <Newspaper size={18} style={{ color: 'rgba(246,243,235,0.25)' }} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 flex items-center gap-3 p-3.5 min-w-0">
                      <TogglePublicacionButton id={item.id} isActive={item.is_active} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="font-bold text-sm truncate" style={{ color: '#F6F3EB' }}>{item.title}</p>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: `${cc}20`, color: cc, border: `1px solid ${cc}30` }}>
                            {CAT_LABEL[item.category] ?? item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono" style={{ color: 'rgba(246,243,235,0.55)' }}>
                            /publicaciones/{item.slug}
                          </span>
                          <span style={{ color: 'rgba(246,243,235,0.15)' }}>·</span>
                          <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
                            {new Date(item.published_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Link href={`/publicaciones/${item.slug}`} target="_blank"
                          className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                          style={{ background: '#0D3352', color: 'rgba(246,243,235,0.55)' }}
                          title="Ver publicación">
                          <Eye size={12} />
                        </Link>
                        <Link href={`/admin/publicaciones/${item.id}/editar`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                          style={{ background: '#0D3352', color: 'rgba(246,243,235,0.55)' }}>
                          <Pencil size={12} />
                        </Link>
                        <DeletePublicacionButton id={item.id} title={item.title} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
