import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const P = {
  bg: '#060E07', surface: '#0D1A0E',
  sage: '#869B7E', teal: '#76ABAE', gold: '#C9A227',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.45)', border: 'rgba(134,155,126,0.15)',
}

export default async function LiderPerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: leader } = await supabase
    .from('church_leaders')
    .select('id, name, title, bio, avatar_url, category, order_index')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (!leader) notFound()

  const accentColor = leader.category === 'pastoral' ? P.sage : P.teal

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4"
        style={{ borderBottom: `1px solid ${P.border}` }}>
        <Link href="/app/pastoral/perfil"
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: P.surface }}>
          <ArrowLeft size={15} style={{ color: P.muted }} />
        </Link>
        <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: accentColor }}>
          El Equipo
        </p>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
        {leader.avatar_url && (
          <div className="absolute inset-0 md:hidden">
            <img src={leader.avatar_url} alt={leader.name}
              className="w-full h-full object-cover object-top"
              style={{ opacity: 0.55 }} />
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${P.bg} 10%, rgba(6,14,7,0.30) 50%, transparent 100%)` }} />
          </div>
        )}

        <div className="relative px-5 pt-8 pb-8 max-w-2xl mx-auto md:flex md:items-center md:gap-8 md:py-12">
          <div className="flex-1">
            {leader.avatar_url && (
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 mb-4 md:hidden"
                style={{ borderColor: P.border }}>
                <img src={leader.avatar_url} alt={leader.name} className="w-full h-full object-cover" />
              </div>
            )}
            {!leader.avatar_url && (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl mb-4 md:hidden"
                style={{ background: `rgba(134,155,126,0.12)`, color: accentColor }}>
                {leader.name[0]}
              </div>
            )}

            <h1 className="font-black text-[28px] tracking-tight leading-tight">{leader.name}</h1>
            {leader.title && (
              <p className="text-[12px] font-bold uppercase tracking-[0.25em] mt-1.5"
                style={{ color: accentColor }}>
                {leader.title}
              </p>
            )}
          </div>

          {/* Desktop photo */}
          <div className="hidden md:flex w-44 h-52 rounded-2xl overflow-hidden flex-shrink-0 items-center justify-center font-black text-5xl"
            style={{ border: `1px solid ${P.border}`, background: `rgba(134,155,126,0.08)`, color: accentColor }}>
            {leader.avatar_url
              ? <img src={leader.avatar_url} alt={leader.name} className="w-full h-full object-cover object-top" />
              : leader.name[0]}
          </div>
        </div>
      </div>

      {/* Bio */}
      {leader.bio && (
        <div className="max-w-2xl mx-auto px-5 pb-10">
          <div className="p-5 rounded-2xl" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: accentColor }}>
              Acerca de
            </p>
            <p className="text-[14px] leading-relaxed" style={{ color: P.muted }}>
              {leader.bio}
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
