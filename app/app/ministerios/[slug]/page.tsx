import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Pin, Users, Music, Heart, Star, BookOpen, Mic, Baby, Flame, Home, Globe, Zap, Sparkles, type LucideIcon } from 'lucide-react'
import MinistryContentCard from '@/components/MinistryContentCard'
import { GOLD, INK } from '@/lib/gold-theme'

/* ── icon mapping (shared logic with public page) ─────── */
const EMOJI_ICON: Record<string, LucideIcon> = {
  '🙏': Sparkles, '✨': Sparkles, '⛪': Home,
  '🎵': Music, '🎶': Music, '🎸': Music,
  '👥': Users, '👫': Users, '🤝': Users,
  '🔥': Flame,
  '📖': BookOpen, '📚': BookOpen,
  '⭐': Star, '🌟': Star,
  '🎤': Mic,
  '👶': Baby, '🧒': Baby,
  '❤️': Heart, '💕': Heart,
  '🏠': Home, '🏡': Home,
  '🌍': Globe, '🌎': Globe,
  '⚡': Zap,
}

const SLUG_ICON: Record<string, LucideIcon> = {
  joven: Flame,    matrimoni: Heart,
  adoraci: Music,  alabanza: Music,  musica: Music,
  oraci: Sparkles, intercesi: Sparkles,
  nino: Baby,      infanti: Baby,
  famili: Home,    hogar: Home,
  mujer: Star,     damas: Star,
  hombre: Zap,     varon: Zap,
  mision: Globe,   evangelism: Globe,
  pastor: BookOpen, estudio: BookOpen, biblia: BookOpen,
}

function getMinistryIcon(icon: string | null, slug: string): LucideIcon {
  if (icon && EMOJI_ICON[icon]) return EMOJI_ICON[icon]
  const s = slug.toLowerCase()
  for (const [k, C] of Object.entries(SLUG_ICON)) {
    if (s.includes(k)) return C
  }
  return Users
}

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

  const pinnedContent  = content?.filter(c => c.pinned) ?? []
  const regularContent = content?.filter(c => !c.pinned) ?? []

  const IconComponent = getMinistryIcon(ministry.icon, slug)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-3">
          <Link
            href="/app/ministerios"
            className="p-2 rounded-xl transition mt-1 hover:bg-[#292E3B]"
            style={{ color: GOLD }}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            {ministry.parent && (
              <Link
                href={'/app/ministerios/' + ministry.parent.slug}
                className="text-xs transition mb-1 block"
                style={{ color: `${GOLD}8C` }}
              >
                {ministry.parent.name} /
              </Link>
            )}
            <div className="flex items-center gap-3">
              {/* Lucide icon instead of emoji */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${GOLD}26`, border: `1px solid ${GOLD}40` }}
              >
                <IconComponent size={22} color={GOLD} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: INK }}>{ministry.name}</h1>
                <p className="text-sm" style={{ color: `${GOLD}99` }}>{ministry.description}</p>
              </div>
            </div>
          </div>
        </div>

        {canPost && (
          <Link
            href={'/app/ministerios/' + slug + '/nuevo'}
            className="font-semibold px-4 py-2 rounded-xl text-sm transition flex-shrink-0 hover:opacity-90 flex items-center gap-2"
            style={{ background: GOLD, color: '#14140F' }}
          >
            <Plus size={16} /> Publicar
          </Link>
        )}
      </div>

      {/* Contenido anclado */}
      {pinnedContent.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Pin size={14} style={{ color: GOLD }} />
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GOLD }}>Anclado</p>
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

      {/* Contenido regular / empty state */}
      {regularContent.length === 0 && pinnedContent.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: `${GOLD}1A`, border: `1px solid ${GOLD}33` }}
          >
            <IconComponent size={32} color={GOLD} strokeWidth={1.5} />
          </div>
          <p className="font-medium mb-1" style={{ color: INK }}>Sin contenido aún</p>
          {canPost && (
            <p className="text-sm" style={{ color: `${GOLD}8C` }}>Sé el primero en publicar algo</p>
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
