import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Users } from 'lucide-react'
import ToggleLiderButton from '@/components/admin/ToggleLiderButton'
import DeleteLiderButton from '@/components/admin/DeleteLiderButton'

export default async function AdminLideresPage() {
  const supabase = await createClient()

  const [{ data: pastoral }, { data: allAssignments }] = await Promise.all([
    supabase
      .from('church_leaders')
      .select('id,name,title,bio,avatar_url,category,is_public,order_index')
      .eq('category', 'pastoral')
      .order('order_index'),
    supabase
      .from('ministry_assignments')
      // profiles!user_id evita ambigüedad con assigned_by (dos FK a profiles)
      .select('user_id,ministry_id,role,ministries(id,name),profiles!user_id(id,full_name,avatar_url,role)'),
  ])

  // Mostrar cualquier asignación donde ministry_assignments.role='lider'
  // O donde profiles.role='lider'/'pastor' (el admin solo asignó el rol general, no el de ministerio)
  // Solo profiles.role determina si es líder — ministry_assignments.role puede estar desactualizado
  const ministerioLideres = (allAssignments ?? []).filter((a: any) =>
    a.profiles?.role === 'lider' || a.profiles?.role === 'pastor'
  )

  const cardStyle = { borderColor: '#0D3352', background: '#0B2D47' }

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <h1 className="font-bold text-lg text-white">Líderes</h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Pastores y líderes de ministerio
            </p>
          </div>
          <Link href="/admin/lideres/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
            style={{ background: '#F6F3EB' }}>
            <Plus size={14} /> Nuevo líder pastoral
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-10">

        {/* ── Liderazgo pastoral ── */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4"
            style={{ color: 'rgba(246,243,235,0.62)' }}>
            Liderazgo pastoral
          </p>
          {(pastoral ?? []).length === 0 ? (
            <div className="rounded-xl border p-6 text-center" style={cardStyle}>
              <p className="text-sm mb-3" style={{ color: 'rgba(246,243,235,0.68)' }}>
                Sin pastores registrados
              </p>
              <Link href="/admin/lideres/nuevo"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-black"
                style={{ background: '#F6F3EB' }}>
                <Plus size={13} /> Agregar pastor
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {(pastoral ?? []).map(l => (
                <div key={l.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border"
                  style={cardStyle}>
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ background: '#093C5D', border: '1px solid #0D3352' }}>
                    {l.avatar_url
                      ? <img src={l.avatar_url} alt={l.name} className="w-full h-full object-cover object-top" />
                      : <span className="font-black text-base" style={{ color: '#76ABAE' }}>
                          {l.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                        </span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-white text-sm">{l.name}</p>
                      {!l.is_public && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: '#0D3352', color: 'rgba(246,243,235,0.68)' }}>
                          Oculto
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] mt-0.5" style={{ color: '#76ABAE' }}>{l.title}</p>
                    {l.bio && (
                      <p className="text-[11px] mt-1 line-clamp-1" style={{ color: 'rgba(246,243,235,0.62)' }}>
                        {l.bio}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] font-black tabular-nums hidden sm:block"
                    style={{ color: 'rgba(246,243,235,0.25)' }}>
                    #{l.order_index}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <ToggleLiderButton id={l.id} isPublic={l.is_public} />
                    <Link href={`/admin/lideres/${l.id}/editar`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: '#061E30' }}>
                      <Pencil size={13} style={{ color: 'rgba(246,243,235,0.68)' }} />
                    </Link>
                    <DeleteLiderButton id={l.id} name={l.name} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Líderes de ministerio ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-black uppercase tracking-[0.3em]"
              style={{ color: 'rgba(246,243,235,0.62)' }}>
              Líderes de ministerio
            </p>
            <Link href="/admin/usuarios"
              className="text-[11px] font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ color: '#76ABAE', background: 'rgba(118,171,174,0.10)' }}>
              <Users size={12} /> Administrar desde Usuarios
            </Link>
          </div>

          {ministerioLideres.length === 0 ? (
            <div className="rounded-xl border p-6 text-center" style={cardStyle}>
              <p className="text-sm mb-1" style={{ color: 'rgba(246,243,235,0.68)' }}>
                Sin líderes de ministerio designados
              </p>
              <p className="text-[12px] mb-3" style={{ color: 'rgba(246,243,235,0.45)' }}>
                Ve a Usuarios, asigna un ministerio y cambia el rol del perfil a "Líder"
              </p>
              <Link href="/admin/usuarios"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold"
                style={{ background: 'rgba(118,171,174,0.15)', color: '#76ABAE' }}>
                Ir a Usuarios
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {ministerioLideres.map((a: any) => {
                const profile = a.profiles
                const ministry = a.ministries
                const initials = (profile?.full_name ?? '?')
                  .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <div key={`${a.user_id}-${a.ministry_id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border"
                    style={cardStyle}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: '#093C5D', border: '1px solid #0D3352' }}>
                      {profile?.avatar_url
                        ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover object-top" />
                        : <span className="font-black text-base" style={{ color: '#76ABAE' }}>{initials}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{profile?.full_name ?? 'Sin nombre'}</p>
                      <p className="text-[12px] mt-0.5" style={{ color: '#76ABAE' }}>
                        {ministry?.name ?? 'Ministerio sin nombre'}
                      </p>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(118,171,174,0.12)', color: 'rgba(118,171,174,0.80)' }}>
                      Líder
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
