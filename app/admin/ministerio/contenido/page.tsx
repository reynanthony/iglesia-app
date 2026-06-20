import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, Video, ArrowLeft, Pencil } from 'lucide-react'
import { deleteContent } from '@/app/actions/admin'
import DeleteContentButton from '@/components/admin/DeleteContentButton'

const TYPE_LABELS: Record<string, string> = {
  articulo: 'Artículo', video: 'Video', recurso: 'Recurso', anuncio: 'Anuncio',
}

export default async function LiderContenidoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verificar ministerios con acceso delegado
  const { data: assignments } = await supabase
    .from('ministry_assignments')
    .select('ministry_id, ministries(id, name)')
    .eq('user_id', user.id)
    .eq('can_admin', true)

  if (!assignments || assignments.length === 0) redirect('/app/comunidad')

  const ministryIds = assignments.map((a: any) => a.ministry_id)
  const ministryMap: Record<string, string> = {}
  assignments.forEach((a: any) => {
    if (a.ministries) ministryMap[a.ministry_id] = a.ministries.name
  })

  const { data: items } = await supabase
    .from('ministry_content')
    .select('*')
    .in('ministry_id', ministryIds)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/ministerio"
            className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: '#0D3352', color: '#76ABAE' }}>
            <ArrowLeft size={15} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Contenido</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
              {items?.length ?? 0} publicaciones en tu ministerio
            </p>
          </div>
          <Link href="/admin/contenido/nuevo"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold flex-shrink-0"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={13} /><span className="hidden sm:inline">Nuevo</span>
          </Link>
        </div>

        <div className="space-y-2">
          {items?.map((item: any) => (
            <div key={item.id}
              className="flex items-center gap-3 p-3.5 rounded-xl"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#0D3352' }}>
                {item.type === 'video'
                  ? <Video size={15} style={{ color: '#76ABAE' }} />
                  : <FileText size={15} style={{ color: '#76ABAE' }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#F6F3EB' }}>{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(118,171,174,0.12)', color: '#76ABAE' }}>
                    {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                  <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.45)' }}>
                    {ministryMap[item.ministry_id] ?? ''}
                  </span>
                  <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.35)' }}>
                    {new Date(item.created_at).toLocaleDateString('es-DO')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link href={`/admin/contenido/${item.id}/editar`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ background: '#0D3352', color: 'rgba(246,243,235,0.55)' }}>
                  <Pencil size={13} />
                </Link>
                <DeleteContentButton contentId={item.id} />
              </div>
            </div>
          ))}

          {(!items || items.length === 0) && (
            <div className="text-center py-16 space-y-3" style={{ color: 'rgba(246,243,235,0.55)' }}>
              <FileText size={32} className="mx-auto opacity-30" />
              <p className="text-sm">No hay contenido publicado aún</p>
              <Link href="/admin/contenido/nuevo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: '#76ABAE', color: '#061E30' }}>
                <Plus size={14} /> Crear contenido
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
