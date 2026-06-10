import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, BookOpen, Star, Pencil } from 'lucide-react'
import DeletePastoralItemButton from '@/components/admin/DeletePastoralItemButton'
import ToggleWeekFeaturedButton from '@/components/admin/ToggleWeekFeaturedButton'

export default async function AdminPastoralReflexionesPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('pastoral_reflections')
    .select('id, title, body, media_type, duration_seconds, week_featured, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link href="/admin/pastoral" className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
                Pastoral
              </Link>
              <span style={{ color: 'rgba(246,243,235,0.20)' }}>/</span>
              <span className="text-[13px] text-white">Reflexiones</span>
            </div>
            <p className="text-[12px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
              {items?.length ?? 0} reflexiones · solo una puede ser «de la semana»
            </p>
          </div>
          <Link href="/admin/pastoral/reflexiones/nueva"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={14} /> Nueva reflexión
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {(!items || items.length === 0) && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <BookOpen size={28} style={{ color: 'rgba(118,171,174,0.30)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>No hay reflexiones publicadas.</p>
          </div>
        )}

        {items?.map(item => (
          <div key={item.id} className="rounded-2xl border p-4 flex items-start gap-4"
            style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.week_featured && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(201,162,39,0.15)', color: '#C9A227' }}>
                    <Star size={8} fill="#C9A227" /> De la semana
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: '#061E30', color: 'rgba(118,171,174,0.60)' }}>
                  {item.media_type}
                </span>
              </div>
              <p className="font-bold text-sm text-white">{item.title || '(sin título)'}</p>
              {item.body && (
                <p className="text-[12px] mt-0.5 line-clamp-2" style={{ color: 'rgba(246,243,235,0.68)' }}>
                  {item.body}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
                  {new Date(item.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
                </span>
                {item.duration_seconds && (
                  <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
                    {Math.round(item.duration_seconds / 60)} min
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ToggleWeekFeaturedButton id={item.id} current={!!item.week_featured} />
              <Link href={`/admin/pastoral/reflexiones/${item.id}/editar`}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: '#061E30' }}>
                <Pencil size={13} style={{ color: 'rgba(246,243,235,0.68)' }} />
              </Link>
              <DeletePastoralItemButton id={item.id} table="pastoral_reflections" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
