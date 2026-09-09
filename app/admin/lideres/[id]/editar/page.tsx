import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateLider } from '@/app/actions/lideres-admin'
import { notFound } from 'next/navigation'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

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
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/lideres"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: CARD }}>
            <ArrowLeft size={14} style={{ color: MUTED }} />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-white">Editar líder</h1>
            <p className="text-[13px]" style={{ color: MUTED }}>{l.name}</p>
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
              <p className="text-[11px] mt-1.5" style={{ color: MUTED }}>
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
            <p className="text-[11px] mt-1.5" style={{ color: MUTED }}>
              Al vincular, la foto y nombre del perfil de la app se sincronizan automáticamente en esta página.
            </p>
          </div>

          {/* Foto actual */}
          {l.avatar_url && (
            <div>
              <p className={label} style={labelStyle}>Foto actual</p>
              <div className="w-24 h-24 rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <img src={l.avatar_url} alt={l.name} className="w-full h-full object-cover object-top" />
              </div>
            </div>
          )}

          <div>
            <label className={label} style={labelStyle}>
              {l.avatar_url ? 'Reemplazar foto' : 'Foto'}
            </label>
            <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: BORDER }}>
              <input type="file" name="avatar" accept="image/*"
                className="w-full text-sm cursor-pointer" style={{ color: MUTED }} />
              <p className="text-[11px] mt-2" style={{ color: MUTED }}>
                JPG, PNG o WebP · Recomendado 600×600px o retrato
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: GOLD, color: GOLD_INK }}>
              Guardar cambios
            </button>
            <Link href="/admin/lideres"
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: CARD, color: MUTED }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
