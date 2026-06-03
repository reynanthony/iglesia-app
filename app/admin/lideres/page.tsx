import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import ToggleLiderButton from '@/components/admin/ToggleLiderButton'
import DeleteLiderButton from '@/components/admin/DeleteLiderButton'

export default async function AdminLideresPage() {
  const supabase = await createClient()
  const { data: lideres } = await supabase
    .from('church_leaders')
    .select('id,name,title,bio,avatar_url,category,is_public,order_index')
    .order('category')
    .order('order_index')

  const pastoral   = lideres?.filter(l => l.category === 'pastoral')   ?? []
  const ministerio = lideres?.filter(l => l.category === 'ministerio') ?? []
  const grupos = [
    { label: 'Liderazgo pastoral',    items: pastoral },
    { label: 'Líderes de ministerios', items: ministerio },
  ]

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="font-bold text-lg text-white">Líderes</h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
              Pastores y líderes visibles en la página Nosotros
            </p>
          </div>
          <Link href="/admin/lideres/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
            style={{ background: '#F6F3EB' }}>
            <Plus size={14} /> Nuevo líder
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-10">
        {(lideres ?? []).length === 0 && (
          <div className="rounded-xl border p-8 text-center" style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
            <p className="font-bold text-white mb-1">Sin líderes registrados</p>
            <p className="text-sm mb-4" style={{ color: 'rgba(246,243,235,0.40)' }}>
              Agrega pastores y líderes para mostrarlos en la sección Nosotros.
            </p>
            <Link href="/admin/lideres/nuevo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black"
              style={{ background: '#F6F3EB' }}>
              <Plus size={14} /> Agregar primer líder
            </Link>
          </div>
        )}

        {grupos.map(({ label, items }) => items.length > 0 && (
          <div key={label}>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4"
              style={{ color: 'rgba(246,243,235,0.35)' }}>
              {label}
            </p>
            <div className="space-y-2">
              {items.map(l => (
                <div key={l.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border"
                  style={{ borderColor: '#0D3352', background: '#0B2D47' }}>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ background: '#093C5D', border: '1px solid #0D3352' }}>
                    {l.avatar_url
                      ? <img src={l.avatar_url} alt={l.name} className="w-full h-full object-cover object-top" />
                      : <span className="font-black text-base" style={{ color: '#76ABAE' }}>
                          {l.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                        </span>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-white text-sm">{l.name}</p>
                      {!l.is_public && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: '#0D3352', color: 'rgba(246,243,235,0.40)' }}>
                          Oculto
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] mt-0.5" style={{ color: '#76ABAE' }}>{l.title}</p>
                    {l.bio && (
                      <p className="text-[11px] mt-1 line-clamp-1" style={{ color: 'rgba(246,243,235,0.35)' }}>
                        {l.bio}
                      </p>
                    )}
                  </div>

                  {/* Orden */}
                  <span className="text-[11px] font-black tabular-nums hidden sm:block"
                    style={{ color: 'rgba(246,243,235,0.25)' }}>
                    #{l.order_index}
                  </span>

                  {/* Acciones */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <ToggleLiderButton id={l.id} isPublic={l.is_public} />

                    <Link href={`/admin/lideres/${l.id}/editar`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: '#061E30' }}>
                      <Pencil size={13} style={{ color: 'rgba(246,243,235,0.40)' }} />
                    </Link>

                    <DeleteLiderButton id={l.id} name={l.name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
