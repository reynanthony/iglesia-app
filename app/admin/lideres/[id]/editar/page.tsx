import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateLider } from '@/app/actions/lideres-admin'
import { notFound } from 'next/navigation'

export default async function EditarLiderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: l }, { data: profiles }] = await Promise.all([
    supabase
      .from('church_leaders')
      .select('id,name,title,bio,avatar_url,category,is_public,order_index,user_id')
      .eq('id', id)
      .single(),
    supabase
      .from('profiles')
      .select('id,full_name,username,role')
      .in('role', ['admin', 'pastor', 'moderador', 'lider', 'consejero'])
      .order('full_name'),
  ])
  if (!l) notFound()

  const action = updateLider.bind(null, id)
  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.68)' }

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/lideres"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.68)' }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Editar líder</h1>
            <p className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>{l.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6">
        <form action={action} encType="multipart/form-data" className="space-y-5">

          <div>
            <label className={label} style={labelStyle}>Nombre completo *</label>
            <input name="name" required defaultValue={l.name}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Cargo *</label>
            <input name="title" required defaultValue={l.title}
              className={field} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Categoría *</label>
            <select name="category" required defaultValue={l.category} className={field} style={fieldStyle}>
              <option value="pastoral">Liderazgo pastoral</option>
              <option value="ministerio">Líder de ministerio</option>
            </select>
          </div>

          <div>
            <label className={label} style={labelStyle}>Descripción / Biografía</label>
            <textarea name="bio" rows={4} defaultValue={l.bio ?? ''}
              placeholder="Breve descripción del líder, su ministerio y trayectoria..."
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Orden de aparición</label>
              <input name="order_index" type="number" min="0" defaultValue={l.order_index ?? 0}
                className={field} style={fieldStyle} />
              <p className="text-[11px] mt-1.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Número menor aparece primero
              </p>
            </div>
            <div>
              <label className={label} style={labelStyle}>Visibilidad</label>
              <select name="is_public" defaultValue={l.is_public ? 'true' : 'false'} className={field} style={fieldStyle}>
                <option value="true">Público</option>
                <option value="false">Oculto</option>
              </select>
            </div>
          </div>

          {/* Vincular perfil de app */}
          <div>
            <label className={label} style={labelStyle}>Vincular usuario de la app</label>
            <select name="user_id" defaultValue={l.user_id ?? ''} className={field} style={fieldStyle}>
              <option value="">— Sin vincular —</option>
              {(profiles ?? []).map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.full_name ?? p.username ?? p.id} ({p.role})
                </option>
              ))}
            </select>
            <p className="text-[11px] mt-1.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
              Al vincular, la foto y nombre del perfil de la app se sincronizan automáticamente en esta página.
            </p>
          </div>

          {/* Foto actual */}
          {l.avatar_url && (
            <div>
              <p className={label} style={labelStyle}>Foto actual</p>
              <div className="w-24 h-24 rounded-2xl overflow-hidden" style={{ border: '1px solid #0D3352' }}>
                <img src={l.avatar_url} alt={l.name} className="w-full h-full object-cover object-top" />
              </div>
            </div>
          )}

          <div>
            <label className={label} style={labelStyle}>
              {l.avatar_url ? 'Reemplazar foto' : 'Foto'}
            </label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: '#0D3352' }}>
              <input type="file" name="avatar" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: 'rgba(246,243,235,0.68)' }} />
              <p className="text-[11px] mt-2" style={{ color: 'rgba(246,243,235,0.55)' }}>
                JPG, PNG o WebP · Recomendado 600×600px o retrato
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Guardar cambios
            </button>
            <Link href="/admin/lideres"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.68)' }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
