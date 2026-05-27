import { createClient } from '@/lib/supabase/server'
import ShortsCard from '@/components/ShortsCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  return (
    /*
      Fullscreen overlay: cubre todo el viewport entre el sidebar (desktop)
      y el header/bottom-nav (mobile) que flotan encima con z-30.
      z-10 queda debajo de la UI de navegación pero encima del fondo.
    */
    <div
      className="fixed inset-0 md:left-60 z-10"
      style={{ background: '#000' }}
    >
      {/* Scroll con snap vertical */}
      <div
        className="shorts-scroll w-full h-full overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' as any }}
      >
        {!posts || posts.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-5 text-center px-8">
            {/* Ilustración SVG: cruz con luz irradiando */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <line key={i}
                  x1="40" y1="40"
                  x2={40 + 36 * Math.cos((deg * Math.PI) / 180)}
                  y2={40 + 36 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#C9A96E" strokeWidth="0.8" strokeOpacity="0.3"
                />
              ))}
              <circle cx="40" cy="40" r="28" stroke="#C9A96E" strokeWidth="0.6" strokeOpacity="0.15" fill="none" />
              <rect x="37" y="18" width="6" height="44" rx="3" fill="#C9A96E" fillOpacity="0.9" />
              <rect x="18" y="33" width="44" height="6" rx="3" fill="#C9A96E" fillOpacity="0.9" />
            </svg>
            <div>
              <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F5F5F5' }}>
                Sé el primero en publicar
              </p>
              <p className="text-sm leading-relaxed max-w-[220px] mx-auto" style={{ color: '#4D4D4D' }}>
                Comparte lo que Dios puso en tu corazón
              </p>
            </div>
            <Link
              href="/app/nuevo-post"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black"
              style={{ background: '#F5F5F5', color: '#0A0A0A' }}
            >
              <Plus size={16} /> Publicar
            </Link>
          </div>
        ) : (
          posts.map((post: any) => (
            <div
              key={post.id}
              className="w-full h-full flex-shrink-0"
              style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
            >
              <ShortsCard post={post} currentUserId={user!.id} />
            </div>
          ))
        )}
      </div>

    </div>
  )
}
