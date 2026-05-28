import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Play, Pin } from 'lucide-react'
import PinContentButton from '@/components/admin/PinContentButton'
import DeletePredicaButton from '@/components/admin/DeletePredicaButton'


export default async function AdminPredicasPage() {
  const supabase = await createClient()
  const { data: predicas } = await supabase
    .from('ministry_content')
    .select('id, title, body, video_url, image_url, pinned, created_at, profiles(full_name), ministries(name)')
    .eq('type', 'video')
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* Header */}
      <div className="border-b px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
        style={{ borderColor: '#0D3352' }}>
        <div>
          <h1 className="font-bold text-lg text-white">Prédicas</h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
            {predicas?.length ?? 0} mensajes publicados
          </p>
        </div>
        <Link href="/admin/predicas/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
          style={{ background: '#F6F3EB' }}>
          <Plus size={14} /> Nueva prédica
        </Link>
      </div>

      {/* List */}
      <div className="px-4 md:px-8 py-6 space-y-3">
        {(!predicas || predicas.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <p className="text-sm mb-2" style={{ color: 'rgba(246,243,235,0.40)' }}>No hay prédicas publicadas.</p>
            <Link href="/admin/predicas/nuevo" className="text-sm font-bold text-white">
              Publicar la primera →
            </Link>
          </div>
        )}

        {predicas?.map(predica => (
          <div key={predica.id} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
            <div className="flex items-center gap-4 p-4">
              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ background: '#0B2D47' }}>
                {predica.image_url
                  ? <img src={predica.image_url} alt={predica.title} className="w-full h-full object-cover" />
                  : <Play size={16} style={{ color: '#333333' }} />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {predica.pinned && <Pin size={11} style={{ color: '#F6F3EB' }} />}
                  <p className="font-bold text-white text-sm truncate">{predica.title}</p>
                </div>
                <p className="text-[12px] truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>
                  {(predica.profiles as any)?.full_name ?? 'Pastor'} ·{' '}
                  {(predica.ministries as any)?.name ?? '—'} ·{' '}
                  {new Date(predica.created_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/predicas/${predica.id}/editar`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
                  <Pencil size={13} style={{ color: 'rgba(246,243,235,0.40)' }} />
                </Link>
                <PinContentButton contentId={predica.id} pinned={predica.pinned ?? false} />
                <DeletePredicaButton predicaId={predica.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
