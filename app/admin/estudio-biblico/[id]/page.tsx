import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, ExternalLink, Trash2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { deleteSeries } from '@/app/actions/bible-study'
import DeleteSessionButton from '@/components/admin/DeleteSessionButton'

const STATUS_LABEL: Record<string, string> = { active: 'En curso', upcoming: 'Próximamente', archived: 'Completada' }

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: series } = await supabase
    .from('bible_study_series')
    .select('*')
    .eq('id', id)
    .single()

  if (!series) notFound()

  const { data: sessions } = await supabase
    .from('bible_study_sessions')
    .select('id, title, slug, reference, summary, order_index, is_active')
    .eq('series_id', id)
    .order('order_index')

  const color = series.cover_color || '#76ABAE'

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/estudio-biblico"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs mb-0.5" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Link href="/admin/estudio-biblico" className="hover:underline">Estudio Bíblico</Link>
              <span>/</span>
              <span className="truncate">{series.title}</span>
            </div>
            <h1 className="font-bold text-lg truncate" style={{ color: '#F6F3EB' }}>{series.title}</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href={`/educacion/estudio-biblico/${series.slug}`} target="_blank"
              className="w-9 h-9 flex items-center justify-center rounded-xl transition hover:bg-[#0D3352]"
              style={{ color: 'rgba(246,243,235,0.40)' }} title="Ver en sitio">
              <ExternalLink size={14} />
            </Link>
            <Link href={`/admin/estudio-biblico/${id}/editar`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: '#0B2D47', color: '#F6F3EB', border: '1px solid #0D3352' }}>
              <Pencil size={13} /> Editar
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">

        {/* Series info */}
        <div className="rounded-2xl p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
          <div className="flex items-start gap-4">
            <div className="w-3 h-16 rounded-full flex-shrink-0" style={{ background: color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold" style={{ color: '#F6F3EB' }}>{series.book || series.title}</p>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(118,171,174,0.15)', color: '#76ABAE' }}>
                  {STATUS_LABEL[series.status] ?? series.status}
                </span>
                {!series.is_active && (
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>
                    Oculta
                  </span>
                )}
              </div>
              {series.theme && (
                <p className="text-sm mb-2" style={{ color: 'rgba(246,243,235,0.55)' }}>{series.theme}</p>
              )}
              {series.description && (
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(246,243,235,0.40)' }}>
                  {series.description}
                </p>
              )}
              <p className="text-xs mt-2" style={{ color: 'rgba(246,243,235,0.25)' }}>
                /educacion/estudio-biblico/{series.slug}
              </p>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black uppercase tracking-[0.2em]"
              style={{ color: 'rgba(246,243,235,0.30)' }}>
              Sesiones · {sessions?.length ?? 0}
            </p>
            <Link href={`/admin/estudio-biblico/${id}/sesiones/nueva`}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
              style={{ background: '#0B2D47', color: '#76ABAE', border: '1px solid #0D3352' }}>
              <Plus size={12} /> Nueva sesión
            </Link>
          </div>

          {!sessions || sessions.length === 0 ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <p className="text-sm" style={{ color: 'rgba(246,243,235,0.35)' }}>No hay sesiones todavía.</p>
              <Link href={`/admin/estudio-biblico/${id}/sesiones/nueva`}
                className="inline-flex items-center gap-1 mt-3 text-sm font-bold"
                style={{ color: '#76ABAE' }}>
                <Plus size={13} /> Crear primera sesión
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              {sessions.map((sess: any, idx: number) => {
                return (
                  <div key={sess.id} className="flex items-center gap-4 px-5 py-4 border-b"
                    style={{ borderColor: '#0D3352' }}>
                    <span className="text-[9px] font-black tracking-widest flex-shrink-0 w-6 text-right"
                      style={{ color: 'rgba(246,243,235,0.20)' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm truncate" style={{ color: '#F6F3EB' }}>{sess.title}</p>
                        {!sess.is_active && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171' }}>
                            Oculta
                          </span>
                        )}
                      </div>
                      {sess.reference && (
                        <p className="text-xs" style={{ color: `${color}80` }}>{sess.reference}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link href={`/admin/estudio-biblico/${id}/sesiones/${sess.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition hover:bg-[#0D3352]"
                        style={{ color: 'rgba(246,243,235,0.40)' }}>
                        <Pencil size={13} />
                      </Link>
                      <DeleteSessionButton sessionId={sess.id} seriesId={id} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(248,113,113,0.20)' }}>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(248,113,113,0.50)' }}>
            Zona de peligro
          </p>
          <form action={deleteSeries.bind(null, id)}>
            <button type="submit"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.20)' }}>
              <Trash2 size={13} /> Eliminar serie y todas sus sesiones
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
