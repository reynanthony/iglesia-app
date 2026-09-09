import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, UsersRound, Megaphone, ArrowRight, Building2 } from 'lucide-react'
import { CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

export default async function MinisterioAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtener ministerios con acceso delegado
  const { data: assignments } = await supabase
    .from('ministry_assignments')
    .select('ministry_id, role, ministries(id, name, image_url)')
    .eq('user_id', user.id)
    .eq('can_admin', true)

  if (!assignments || assignments.length === 0) redirect('/app/comunidad')

  const ministries = assignments.map((a: any) => a.ministries).filter(Boolean) as {
    id: string; name: string; image_url?: string
  }[]

  // Estadísticas por ministerio
  const stats = await Promise.all(
    ministries.map(async (m) => {
      const [{ count: contentCount }, { count: groupCount }] = await Promise.all([
        supabase
          .from('ministry_content')
          .select('id', { count: 'exact', head: true })
          .eq('ministry_id', m.id),
        supabase
          .from('groups')
          .select('id', { count: 'exact', head: true })
          .eq('ministry_id', m.id),
      ])
      return { ministryId: m.id, contentCount: contentCount ?? 0, groupCount: groupCount ?? 0 }
    })
  )

  const quickLinks = [
    { href: '/admin/ministerio/contenido', icon: FileText,   label: 'Contenido',  desc: 'Artículos, videos y recursos' },
    { href: '/admin/ministerio/grupos',    icon: UsersRound, label: 'Grupos',     desc: 'Grupos de tu ministerio' },
    { href: '/admin/ministerio/anuncios',  icon: Megaphone,  label: 'Anuncios',   desc: 'Campañas y comunicados' },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Mi Ministerio</h1>
          <p className="text-xs md:text-sm mt-0.5" style={{ color: MUTED }}>
            Administra tu espacio en la app y el sitio web
          </p>
        </div>

        {/* Ministerios a cargo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ministries.map(m => {
            const s = stats.find(st => st.ministryId === m.id)
            return (
              <div key={m.id} className="rounded-2xl p-4"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ background: BORDER }}>
                    {m.image_url
                      ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                      : <Building2 size={18} style={{ color: GOLD }} />
                    }
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: INK }}>{m.name}</p>
                    <p className="text-[11px]" style={{ color: MUTED }}>Ministerio asignado</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl px-3 py-2 text-center" style={{ background: BORDER }}>
                    <p className="text-lg font-black" style={{ color: INK }}>{s?.contentCount ?? 0}</p>
                    <p className="text-[10px]" style={{ color: MUTED }}>Contenidos</p>
                  </div>
                  <div className="rounded-xl px-3 py-2 text-center" style={{ background: BORDER }}>
                    <p className="text-lg font-black" style={{ color: INK }}>{s?.groupCount ?? 0}</p>
                    <p className="text-[10px]" style={{ color: MUTED }}>Grupos</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Accesos rápidos */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest mb-3"
            style={{ color: MUTED }}>
            Gestionar
          </p>
          <div className="space-y-2">
            {quickLinks.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}
                className="flex items-center gap-4 p-4 rounded-2xl transition group"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: BORDER }}>
                  <Icon size={18} style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: INK }}>{label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>{desc}</p>
                </div>
                <ArrowRight size={16} style={{ color: MUTED }} />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
