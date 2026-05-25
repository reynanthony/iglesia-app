import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Pin } from 'lucide-react'
import MinistryContentCard from '@/components/MinistryContentCard'

export default async function MinistryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const canPost = ['admin', 'pastor', 'moderador', 'lider'].includes(profile?.role ?? '')

  const pinnedContent = content?.filter(c => c.pinned) ?? []
  const regularContent = content?.filter(c => !c.pinned) ?? []

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-3">
          <Link href="/app/ministerios" className="p-2 hover:bg-slate-800 rounded-xl transition mt-1">
            <ArrowLeft size={18} />
          </Link>
          <div>
            {ministry.parent && (
              <Link href={'/app/ministerios/' + ministry.parent.slug} className="text-xs text-slate-500 hover:text-amber-400 transition mb-1 block">
                {ministry.parent.name} /
              </Link>
            )}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: ministry.color + '20' }}
              >
                {ministry.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold">{ministry.name}</h1>
                <p className="text-slate-500 text-sm">{ministry.description}</p>
              </div>
            </div>
          </div>
        </div>

        {canPost && (
          <Link
            href={'/app/ministerios/' + slug + '/nuevo'}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition flex-shrink-0"
          >
            <Plus size={16} /> Publicar
          </Link>
        )}
      </div>

      {/* Contenido anclado */}
      {pinnedContent.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Pin size={14} className="text-amber-500" />
            <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide">Anclado</p>
          </div>
          <div className="space-y-3">
            {pinnedContent.map((item: any) => (
              <MinistryContentCard
                key={item.id}
                item={item}
                ministrySlug={slug}
                canDelete={canPost}
              />
            ))}
          </div>
        </div>
      )}

      {/* Contenido regular */}
      {regularContent.length === 0 && pinnedContent.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-4">{ministry.icon}</p>
          <p className="font-medium text-white">Sin contenido aun</p>
          {canPost && (
            <p className="text-sm mt-1">Sé el primero en publicar algo</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {regularContent.map((item: any) => (
            <MinistryContentCard
              key={item.id}
              item={item}
              ministrySlug={slug}
              canDelete={canPost}
            />
          ))}
        </div>
      )}
    </div>
  )
}