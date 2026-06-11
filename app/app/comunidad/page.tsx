import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import CommunityAnnouncement from '@/components/app/CommunityAnnouncement'
import ComunidadFeedScroll from '@/components/app/ComunidadFeedScroll'

export default async function ComunidadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: posts }, bannerResult] = await Promise.all([
    supabase
      .from('posts')
      .select(`
        *,
        profiles(id, full_name, username, avatar_url),
        reactions(id, user_id, type),
        comments(
          id, content, created_at, parent_id,
          profiles(full_name, username, avatar_url),
          comment_likes(id, user_id)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('announcements')
      .select('id, title, description, cta_label, cta_destination, video_url')
      .eq('is_active', true)
      .eq('is_banner', true)
      .lte('start_date', new Date().toISOString())
      .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
      .order('priority', { ascending: false })
      .limit(1),
  ])

  const banner = bannerResult.error ? null : (bannerResult.data?.[0] ?? null)

  return (
    <div
      className="flex flex-col app-content-height"
      style={{ background: '#061E30' }}
    >
      {/* Banner de anuncio comunitario */}
      {banner && (
        <CommunityAnnouncement
          text={banner.description ? `${banner.title} — ${banner.description}` : banner.title}
          id={banner.id}
          href={banner.cta_destination || banner.video_url || null}
          ctaLabel={banner.cta_label || null}
        />
      )}

      {/* FAB nueva publicación — absolute dentro del contenedor (no fixed) */}
      <Link
        href="/app/nuevo-post"
        className="md:hidden fixed z-20 w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          left: 16,
          background: 'rgba(118,171,174,0.20)',
          border: '1px solid rgba(118,171,174,0.35)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Nueva publicación"
      >
        <Plus size={22} color="#76ABAE" strokeWidth={2} />
      </Link>

      {/* Scroll con snap vertical + infinite scroll */}
      <div
        className="shorts-scroll flex-1 overflow-y-scroll w-full relative"
        style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' as any, minHeight: 0 }}
      >
        <ComunidadFeedScroll
          initialPosts={posts ?? []}
          currentUserId={user.id}
        />
      </div>
    </div>
  )
}
