'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import ShortsCard from '@/components/ShortsCard'
import Link from 'next/link'
import { Plus, Loader2 } from 'lucide-react'
import { fetchMorePosts } from '@/app/actions/posts'
import { createClient } from '@/lib/supabase/client'

const PAGE_SIZE = 20

const POST_SELECT = `
  *,
  profiles(id, full_name, username, avatar_url),
  reactions(id, user_id, type),
  comments(
    id, content, created_at, parent_id,
    profiles(full_name, username, avatar_url),
    comment_likes(id, user_id)
  )
`

interface Props {
  initialPosts: any[]
  currentUserId: string
  category?: string
}

export default function ComunidadFeedScroll({ initialPosts, currentUserId, category }: Props) {
  const [posts, setPosts]       = useState(initialPosts)
  const [loading, setLoading]   = useState(false)
  const [hasMore, setHasMore]   = useState(initialPosts.length === PAGE_SIZE)
  const sentinelRef             = useRef<HTMLDivElement>(null)
  const observerRef             = useRef<IntersectionObserver | null>(null)
  const supabase                = useRef(createClient()).current

  useEffect(() => {
    const channel = supabase
      .channel('posts-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        if (category && payload.new.category !== category) return
        const { data } = await supabase.from('posts').select(POST_SELECT).eq('id', payload.new.id).single()
        if (data) setPosts(prev => [data, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [category])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || posts.length === 0) return
    setLoading(true)
    const cursor = posts[posts.length - 1].created_at
    const more = await fetchMorePosts(cursor, category)
    if (more.length < PAGE_SIZE) setHasMore(false)
    if (more.length > 0) setPosts(prev => [...prev, ...more])
    setLoading(false)
  }, [loading, hasMore, posts, category])

  // Attach IntersectionObserver to the sentinel (last card)
  const sentinelCallbackRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect()
    if (!node) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { threshold: 0.5 }
    )
    observerRef.current.observe(node)
  }, [loadMore])

  if (posts.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-5 text-center px-8">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
            <line key={i} x1="40" y1="40"
              x2={40 + 36 * Math.cos((deg * Math.PI) / 180)}
              y2={40 + 36 * Math.sin((deg * Math.PI) / 180)}
              stroke="rgba(118,171,174,0.55)" strokeWidth="0.8" strokeOpacity="0.3"
            />
          ))}
          <circle cx="40" cy="40" r="28" stroke="rgba(118,171,174,0.55)" strokeWidth="0.6" strokeOpacity="0.15" fill="none" />
          <rect x="37" y="18" width="6" height="44" rx="3" fill="rgba(118,171,174,0.55)" fillOpacity="0.9" />
          <rect x="18" y="33" width="44" height="6" rx="3" fill="rgba(118,171,174,0.55)" fillOpacity="0.9" />
        </svg>
        <div>
          <p className="font-black text-lg tracking-tight mb-2" style={{ color: '#F6F3EB' }}>
            Sé el primero en publicar
          </p>
          <p className="text-sm leading-relaxed max-w-[220px] mx-auto" style={{ color: 'rgba(246,243,235,0.40)' }}>
            Comparte lo que Dios puso en tu corazón
          </p>
        </div>
        <Link
          href="/app/nuevo-post"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black"
          style={{ background: '#F6F3EB', color: '#061E30' }}
        >
          <Plus size={16} /> Publicar
        </Link>
      </div>
    )
  }

  return (
    <>
      {posts.map((post, i) => {
        const isLast = i === posts.length - 1
        return (
          <div
            key={post.id}
            ref={isLast ? sentinelCallbackRef : undefined}
            className="w-full flex-shrink-0"
            style={{ height: 'calc(100% - 1px)', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          >
            <ShortsCard post={post} currentUserId={currentUserId} />
          </div>
        )
      })}

      {/* Sentinel / loading indicator */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="w-full flex-shrink-0 flex items-center justify-center"
          style={{ height: 80, scrollSnapAlign: 'start' }}
        >
          {loading && <Loader2 size={20} className="animate-spin" style={{ color: 'rgba(118,171,174,0.50)' }} />}
        </div>
      )}
    </>
  )
}
