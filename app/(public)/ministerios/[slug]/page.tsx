import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pin, Plus } from 'lucide-react'
import MinistryContentCard from '@/components/MinistryContentCard'

export default async function PublicMinistryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: ministry } = await supabase
    .from('ministries')
    .select('*, parent:parent_id(name, slug)')
    .eq('slug', slug)
    .single()

  if (!ministry) notFound()

  const { data: content } = await supabase
    .from('ministry_content')
    .select('*, profiles(full_name, username, avatar_url)')
    .eq('ministry_id', ministry.id)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  let canPost = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    canPost = ['admin', 'pastor', 'moderador', 'lider'].includes(profile?.role ?? '')
  }

  const pinnedContent = content?.filter(c => c.pinned) ?? []
  const regularContent = content?.filter(c => !c.pinned) ?? []

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/ministerios"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-6"
          >
            <ArrowLeft size={16} /> Todos los ministerios
          </Link>

          {ministry.parent && (
            <Link
              href={'/ministerios/' + ministry.parent.slug}
              className="text-xs text-slate-500 hover:text-amber-400 transition mb-2 block"
            >
              {ministry.parent.name} /
            </Link>
          )}

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ backgroundColor: ministry.color + '20' }}
            >
              {ministry.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{ministry.name}</h1>
              <p className="text-slate-400 mt-1">{ministry.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-slate-950 py-10 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">

          {canPost && (
            <div className="flex justify-end mb-6">
              <Link
                href={'/app/ministerios/' + slug + '/nuevo'}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition"
              >
                <Plus size={16} /> Publicar
              </Link>
            </div>
          )}

          {pinnedContent.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Pin size={14} className="text-amber-500" />
                <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide">Anclado</p>
              </div>
              <div className="space-y-3">
                {pinnedContent.map((item: any) => (
                  <MinistryContentCard key={item.id} item={item} ministrySlug={slug} canDelete={canPost} />
                ))}
              </div>
            </div>
          )}

          {regularContent.length === 0 && pinnedContent.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-4xl mb-4">{ministry.icon}</p>
              <p className="font-medium text-white">Sin contenido aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {regularContent.map((item: any) => (
                <MinistryContentCard key={item.id} item={item} ministrySlug={slug} canDelete={canPost} />
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
