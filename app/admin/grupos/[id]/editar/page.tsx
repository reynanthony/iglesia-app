import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { updateGroup } from '@/app/actions/groups'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const TYPES = [
  { value: 'jovenes',     label: 'Jóvenes' },
  { value: 'caballeros',  label: 'Caballeros' },
  { value: 'damas',       label: 'Damas' },
  { value: 'matrimonios', label: 'Matrimonios' },
  { value: 'evangelismo', label: 'Evangelismo' },
  { value: 'intercesion', label: 'Intercesión' },
  { value: 'alabanza',    label: 'Alabanza' },
  { value: 'general',     label: 'General' },
]

const FIELD_STYLE = { background: '#0B2D47', border: '1px solid #0D3352', borderRadius: 12, color: '#F6F3EB' }
const LABEL_CLS   = 'block text-xs font-bold uppercase tracking-wider mb-2'
const LABEL_STYLE = { color: 'rgba(246,243,235,0.50)' }

export default async function EditarGrupoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: group } = await supabase.from('groups').select('*').eq('id', id).single()
  if (!group) notFound()

  const action = updateGroup.bind(null, id)

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/grupos" className="p-2 rounded-xl" style={{ background: '#0D3352', color: '#76ABAE' }}>
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-xl font-bold">Editar grupo</h1>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label className={LABEL_CLS} style={LABEL_STYLE}>Nombre *</label>
            <input name="name" required defaultValue={group.name}
              className="w-full px-4 py-3 text-sm bg-transparent focus:outline-none"
              style={FIELD_STYLE} />
          </div>

          <div>
            <label className={LABEL_CLS} style={LABEL_STYLE}>Descripción</label>
            <textarea name="description" rows={3} defaultValue={group.description ?? ''}
              className="w-full px-4 py-3 text-sm bg-transparent focus:outline-none resize-none"
              style={FIELD_STYLE} />
          </div>

          <div>
            <label className={LABEL_CLS} style={LABEL_STYLE}>Tipo</label>
            <select name="type" defaultValue={group.type}
              className="w-full px-4 py-3 text-sm focus:outline-none"
              style={FIELD_STYLE}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_private" defaultChecked={group.is_private} className="w-4 h-4 rounded" />
            <span className="text-sm" style={{ color: 'rgba(246,243,235,0.70)' }}>
              Grupo privado
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <Link href="/admin/grupos"
              className="flex-1 py-3 rounded-xl text-sm font-bold text-center"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.50)', border: '1px solid #0D3352' }}>
              Cancelar
            </Link>
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
