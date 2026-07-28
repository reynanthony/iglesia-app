import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Quote } from 'lucide-react'
import DeleteDevocionalButton from '@/components/admin/DeleteDevocionalButton'

export default async function AdminDevocionalesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('devocionales').select('*').order('created_at', { ascending: false })
  const devocionales = data ?? []

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="font-bold text-lg text-white">Devocionales</h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              {devocionales.length} reflexiones publicadas
            </p>
          </div>
          <Link href="/admin/devocionales/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
            style={{ background: '#F6F3EB' }}>
            <Plus size={14} /> Nuevo devocional
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {devocionales.length === 0 && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <p className="text-sm mb-2" style={{ color: 'rgba(246,243,235,0.68)' }}>No hay devocionales publicados.</p>
            <Link href="/admin/devocionales/nuevo" className="text-sm font-bold text-white">
              Publicar el primero →
            </Link>
          </div>
        )}

        {devocionales.map(devo => (
          <div key={devo.id} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
            <div className="flex items-center gap-4 p-4">
              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ background: '#061E30' }}>
                {devo.image_url
                  ? <img src={devo.image_url} alt={devo.title} className="w-full h-full object-cover" />
                  : <Quote size={16} style={{ color: '#333333' }} />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-white text-sm truncate">{devo.title}</p>
                  {!devo.published && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: '#0D3352', color: 'rgba(246,243,235,0.68)' }}>Oculto</span>
                  )}
                </div>
                <p className="text-[12px] truncate" style={{ color: 'rgba(246,243,235,0.68)' }}>
                  {devo.author ?? '—'} · {new Date(devo.created_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/devocionales/${devo.id}/editar`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                  <Pencil size={13} style={{ color: 'rgba(246,243,235,0.68)' }} />
                </Link>
                <DeleteDevocionalButton devocionalId={devo.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
