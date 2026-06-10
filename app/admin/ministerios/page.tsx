import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react'
import { deleteMinistry } from '@/app/actions/ministerios-admin'

export default async function AdminMinisteriosPage() {
  const supabase = await createClient()
  const { data: ministries } = await supabase
    .from('ministries')
    .select('*')
    .order('created_at', { ascending: true })

  const parents = ministries?.filter(m => !m.parent_id) ?? []
  const children = ministries?.filter(m => m.parent_id) ?? []

  const withSubs = parents.map(p => ({
    ...p,
    sub: children.filter(c => c.parent_id === p.id),
  }))

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="font-bold text-lg text-white">Ministerios</h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
            {ministries?.length ?? 0} ministerios · gestiona el contenido del sitio web
          </p>
        </div>
        <Link href="/admin/ministerios/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black transition self-start"
          style={{ background: '#F6F3EB' }}>
          <Plus size={14} /> Nuevo ministerio
        </Link>
      </div>

      {/* List */}
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-3">
        {withSubs.length === 0 && (
          <div className="py-20 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>No hay ministerios aún.</p>
            <Link href="/admin/ministerios/nuevo" className="text-sm font-bold text-white mt-2 inline-block">
              Crear el primero →
            </Link>
          </div>
        )}

        {withSubs.map(ministry => (
          <div key={ministry.id}>
            {/* Parent row */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: '#0B2D47' }}>
                  {ministry.image_url
                    ? <img src={ministry.image_url} alt={ministry.name} className="w-full h-full object-cover" />
                    : <ImageOff size={18} style={{ color: '#333333' }} />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{ministry.name}</p>
                  <p className="text-[12px] truncate mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
                    /{ministry.slug} · {ministry.sub.length} sub-ministerio{ministry.sub.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/ministerios/${ministry.id}/editar`}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition"
                    style={{ background: '#0B2D47' }}>
                    <Pencil size={13} style={{ color: 'rgba(246,243,235,0.68)' }} />
                  </Link>
                  <form action={async () => {
                    'use server'
                    await deleteMinistry(ministry.id)
                  }}>
                    <button type="submit"
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition"
                      style={{ background: '#0B2D47' }}>
                      <Trash2 size={13} style={{ color: '#6B3333' }} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Sub-ministries */}
              {ministry.sub.length > 0 && (
                <div className="border-t px-4 py-3 flex flex-wrap gap-2" style={{ borderColor: '#0D3352' }}>
                  {ministry.sub.map((sub: any) => (
                    <div key={sub.id} className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: '#0B2D47' }}>
                      <span className="text-[12px] font-medium" style={{ color: 'rgba(246,243,235,0.68)' }}>{sub.name}</span>
                      <Link href={`/admin/ministerios/${sub.id}/editar`}>
                        <Pencil size={10} style={{ color: 'rgba(246,243,235,0.68)' }} />
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteMinistry(sub.id)
                      }}>
                        <button type="submit">
                          <Trash2 size={10} style={{ color: '#6B3333' }} />
                        </button>
                      </form>
                    </div>
                  ))}
                  <Link href={`/admin/ministerios/nuevo?parent=${ministry.id}`}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px]"
                    style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.68)' }}>
                    <Plus size={10} /> Sub-ministerio
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
