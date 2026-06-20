import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Megaphone, ArrowLeft, Plus, Pencil } from 'lucide-react'

const PRIORITY_LABEL: Record<string, string> = { critical: 'Urgente', high: 'Importante', normal: 'Normal' }
const PRIORITY_COLOR: Record<string, string>  = { critical: '#F87171', high: '#F59E0B', normal: '#76ABAE' }

export default async function LiderAnunciosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: assignments } = await supabase
    .from('ministry_assignments')
    .select('ministry_id')
    .eq('user_id', user.id)
    .eq('can_admin', true)

  if (!assignments || assignments.length === 0) redirect('/app/comunidad')

  // Anuncios creados por este lider
  const { data: items } = await supabase
    .from('announcements')
    .select('*')
    .eq('created_by', user.id)
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
            <h1 className="text-xl font-bold">Anuncios</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
              {items?.length ?? 0} anuncios creados por ti
            </p>
          </div>
          <Link href="/admin/campanas/nueva"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold flex-shrink-0"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            <Plus size={13} /><span className="hidden sm:inline">Nuevo anuncio</span>
          </Link>
        </div>

        {/* Nota informativa */}
        <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
          style={{ background: 'rgba(118,171,174,0.06)', border: '1px solid rgba(118,171,174,0.15)' }}>
          <Megaphone size={14} style={{ color: '#76ABAE', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(246,243,235,0.65)' }}>
            Los anuncios que creas aquí aparecen en la app de todos los miembros.
            Úsalos para comunicar eventos, recordatorios o información de tu ministerio.
          </p>
        </div>

        <div className="space-y-2">
          {items?.map((item: any) => (
            <div key={item.id}
              className="flex items-center gap-3 p-3.5 rounded-xl"
              style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#0D3352' }}>
                <Megaphone size={15} style={{ color: PRIORITY_COLOR[item.priority] ?? '#76ABAE' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#F6F3EB' }}>{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{ color: PRIORITY_COLOR[item.priority] ?? '#76ABAE', background: 'rgba(0,0,0,0.2)' }}>
                    {PRIORITY_LABEL[item.priority] ?? item.priority}
                  </span>
                  <span className="text-[10px]" style={{ color: item.is_active ? '#76ABAE' : 'rgba(248,113,113,0.8)' }}>
                    {item.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="text-[10px]" style={{ color: 'rgba(246,243,235,0.35)' }}>
                    {new Date(item.created_at).toLocaleDateString('es-DO')}
                  </span>
                </div>
              </div>
              <Link href={`/admin/campanas/${item.id}/editar`}
                className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: '#0D3352', color: 'rgba(246,243,235,0.55)' }}>
                <Pencil size={13} />
              </Link>
            </div>
          ))}

          {(!items || items.length === 0) && (
            <div className="text-center py-16 space-y-3" style={{ color: 'rgba(246,243,235,0.55)' }}>
              <Megaphone size={32} className="mx-auto opacity-30" />
              <p className="text-sm">No has creado anuncios aún</p>
              <Link href="/admin/campanas/nueva"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: '#76ABAE', color: '#061E30' }}>
                <Plus size={14} /> Crear anuncio
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
