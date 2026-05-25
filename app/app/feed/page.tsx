import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { PenLine, Flame } from 'lucide-react'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, username')
    .eq('id', user!.id)
    .single()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(id, full_name, username, avatar_url),
      likes(id, user_id),
      comments(
        id, content, created_at, parent_id,
        profiles(full_name, username, avatar_url),
        comment_likes(id, user_id)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(30)

  const initial = profile?.full_name?.[0]?.toUpperCase() ?? 'U'

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── AMBIENT HEADER ── */}
      <div className="relative overflow-hidden" style={{ borderBottom: '1px solid #181818' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,0,0,0.06), transparent 70%)' }} />
        <div className="max-w-xl mx-auto px-4 pt-8 pb-6 relative">
          <div className="flex items-center gap-3 mb-6">
            <Flame size={14} className="text-[#000000]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: '#4D4D4D' }}>
              Comunidad · Feed
            </p>
          </div>

          {/* Quick post */}
          <Link href="/app/nuevo-post">
            <div
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition group"
              style={{ background: '#161614', border: '1px solid #1A1A1A' }}
            >
              <div
                className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
                style={{ background: 'rgba(0,0,0,0.15)', color: '#000000' }}
              >
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  : initial}
              </div>
              <p className="flex-1 text-sm" style={{ color: '#4D4D4D' }}>¿Qué quieres compartir hoy?</p>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition text-[11px] font-black uppercase tracking-wider"
                style={{ background: '#000000', color: '#0A0A0A' }}
              >
                <PenLine size={12} /> Publicar
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── POSTS ── */}
      <div className="max-w-xl mx-auto">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.12)' }}>
              <span className="text-2xl">🙏</span>
            </div>
            <p className="font-black text-lg tracking-tight" style={{ color: '#F5F5F5' }}>Sé el primero en publicar</p>
            <p className="text-sm mt-2" style={{ color: '#4D4D4D' }}>Comparte lo que Dios ha puesto en tu corazón</p>
            <Link
              href="/app/nuevo-post"
              className="inline-flex items-center gap-2 mt-6 text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl transition"
              style={{ background: '#000000', color: '#0A0A0A' }}
            >
              <PenLine size={12} /> Primera publicación
            </Link>
          </div>
        ) : (
          <div>
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} currentUserId={user!.id} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
