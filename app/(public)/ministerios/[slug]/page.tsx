import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Plus } from 'lucide-react'
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
    <div className="bg-white">

      {/* HERO */}
      <section className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-14">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-10">
            <Link href="/ministerios" className="hover:text-white transition flex items-center gap-1.5">
              <ArrowLeft size={11} /> Ministerios
            </Link>
            {ministry.parent && (
              <>
                <span>/</span>
                <Link href={'/ministerios/' + ministry.parent.slug} className="hover:text-white transition">
                  {ministry.parent.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-zinc-400">{ministry.name}</span>
          </div>

          <div className="flex items-start gap-5">
            <div
              className="w-14 h-14 flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: ministry.color + '20' }}
            >
              {ministry.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 mb-2">— Ministerio</p>
              <h1 className="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-3">
                {ministry.name}
              </h1>
              {ministry.description && (
                <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">{ministry.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Accent line */}
        <div className="h-0.5 w-full" style={{ backgroundColor: ministry.color }} />
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">

        <div className="flex items-center justify-between border-b border-zinc-100 pb-5 mb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-1">— Publicaciones</p>
            <p className="text-xs text-zinc-400">
              {(content?.length ?? 0) === 0
                ? 'Sin publicaciones aún'
                : `${content?.length} publicación${(content?.length ?? 0) !== 1 ? 'es' : ''}`}
            </p>
          </div>
          {canPost && (
            <Link
              href={'/app/ministerios/' + slug + '/nuevo'}
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-[0.15em] px-5 py-3 transition"
            >
              <Plus size={13} /> Publicar
            </Link>
          )}
        </div>

        {isEmpty ? (
          <div className="py-32 text-center border border-zinc-100">
            <p className="text-5xl mb-4">{ministry.icon}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Próximamente</p>
            <p className="text-xl font-black text-zinc-900">Preparando contenido</p>
          </div>
        ) : (
          <>
            {pinnedContent.length > 0 && (
              <div className="mb-12">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-6">— Fijado</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {pinnedContent.map((item: any) => (
                    <MinistryContentCard key={item.id} item={item} ministrySlug={slug} canDelete={canPost} />
                  ))}
                </div>
              </div>
            )}
            {regularContent.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
