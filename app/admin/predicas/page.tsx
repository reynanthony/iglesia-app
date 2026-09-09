import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Play } from 'lucide-react'
import DeletePredicaButton from '@/components/admin/DeletePredicaButton'
import { BG, CARD, BORDER, MUTED, INK } from '@/lib/gold-theme'

export default async function AdminPredicasPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('sermons').select('*').order('sermon_date', { ascending: false })
  const predicas = data ?? []

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="font-bold text-lg text-white">Prédicas</h1>
            <p className="text-[13px] mt-0.5" style={{ color: MUTED }}>
              {predicas.length} mensajes publicados
            </p>
          </div>
          <Link href="/admin/predicas/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
            style={{ background: INK }}>
            <Plus size={14} /> Nueva prédica
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {predicas.length === 0 && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: BORDER }}>
            <p className="text-sm mb-2" style={{ color: MUTED }}>No hay prédicas publicadas.</p>
            <Link href="/admin/predicas/nuevo" className="text-sm font-bold text-white">
              Publicar la primera →
            </Link>
          </div>
        )}

        {predicas.map(predica => {
          const thumbUrl = predica.thumbnail_url
          return (
            <div key={predica.id} className="rounded-2xl border overflow-hidden"
              style={{ borderColor: BORDER, background: CARD }}>
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: BG }}>
                  {thumbUrl
                    ? <img src={thumbUrl} alt={predica.title} className="w-full h-full object-cover" />
                    : <Play size={16} style={{ color: '#333333' }} />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{predica.title}</p>
                  <p className="text-[12px] truncate" style={{ color: MUTED }}>
                    {predica.speaker ?? '—'} · {predica.series ?? '—'} ·{' '}
                    {predica.sermon_date
                      ? new Date(predica.sermon_date).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/predicas/${predica.id}/editar`}
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <Pencil size={13} style={{ color: MUTED }} />
                  </Link>
                  <DeletePredicaButton predicaId={String(predica.id)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
