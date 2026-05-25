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
  const isEmpty = pinnedContent.length === 0 && regularContent.length === 0

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition">Inicio</Link>
            <span>/</span>
            <Link href="/ministerios" className="hover:text-white transition">Ministerios</Link>
            {ministry.parent && (
              <>
                <span>/</span>
                <Link href={'/ministerios/' + ministry.parent.slug} className="hover:text-white transition">
                  {ministry.parent.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-white">{ministry.name}</span>
          </div>

          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ backgroundColor: ministry.color + '25' }}
            >
              {ministry.icon}
            </div>
            <div>
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-1">Ministerio</p>
              <h1 className="text-4xl md:text-5xl font-bold">{ministry.name}</h1>
              {ministry.description && (
                <p className="text-slate-400 mt-2 text-lg max-w-xl">{ministry.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Divider with accent */}
      <div className="h-1 w-full" style={{ backgroundColor: ministry.color }} />

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 py-14">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Publicaciones</h2>
            <p className="text-slate-500 text-sm mt-1">
              {(content?.length ?? 0) === 0
                ? 'Sin publicaciones aún'
                : `${content?.length} publicación${(content?.length ?? 0) !== 1 ? 'es' : ''}`}
            </p>
          </div>
          {canPost && (
            <Link
              href={'/app/ministerios/' + slug + '/nuevo'}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
            >
              <Plus size={16} /> Publicar
            </Link>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-32 text-slate-400">
            <p className="text-6xl mb-5">{ministry.icon}</p>
            <p className="text-xl font-semibold text-slate-600">Próximamente</p>
            <p className="text-sm mt-2">Estamos preparando contenido para este ministerio.</p>
          </div>
        ) : (
          <>
            {/* Pinned */}
            {pinnedContent.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-5">
                  <Pin size={15} className="text-amber-500" />
                  <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">Fijado</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pinnedContent.map((item: any) => (
                    <MinistryContentCard key={item.id} item={item} ministrySlug={slug} canDelete={canPost} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular */}
            {regularContent.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularContent.map((item: any) => (
                  <MinistryContentCard key={item.id} item={item} ministrySlug={slug} canDelete={canPost} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

    </div>
  )
}
