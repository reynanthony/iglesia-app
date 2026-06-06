import { createClient } from '@/lib/supabase/server'
import ShortsCard from '@/components/ShortsCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import CommunityAnnouncement from '@/components/app/CommunityAnnouncement'

const CATEGORIES = [
  { key: '', label: 'Todos' },
  { key: 'testimonio', label: 'Testimonios' },
  { key: 'reflexion', label: 'Reflexiones' },
  { key: 'peticion', label: 'Peticiones' },
  { key: 'devocional', label: 'Devocionales' },
  { key: 'servicio', label: 'Servicio' },
]

export default async function ComunidadPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let query = supabase
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
    .limit(30)

  if (cat) query = query.eq('category', cat)

  const [{ data: posts }, bannerResult] = await Promise.all([
    query,
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

      {/* Filtros por categoría */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar"
        style={{ borderBottom: '1px solid rgba(13,51,82,0.6)' }}
      >
        {CATEGORIES.map(c => (
          <Link
            key={c.key}
            href={c.key ? `/app/comunidad?cat=${c.key}` : '/app/comunidad'}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold tracking-wide transition"
            style={{
              background: (cat ?? '') === c.key ? '#76ABAE' : '#0B2D47',
              color: (cat ?? '') === c.key ? '#061E30' : 'rgba(246,243,235,0.50)',
              border: '1px solid',
              borderColor: (cat ?? '') === c.key ? '#76ABAE' : '#0D3352',
            }}
          >
            {c.label}
          </Link>
        ))}
      </div>

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

      {/* Scroll con snap vertical */}
      <div
        className="shorts-scroll flex-1 overflow-y-scroll w-full relative"
        style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' as any, minHeight: 0 }}
      >
        {!posts || posts.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-5 text-center px-8">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <line key={i}
                  x1="40" y1="40"
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
        ) : (
          posts.map((post: any) => (
            <div
              key={post.id}
              className="w-full flex-shrink-0"
              style={{
                height: 'calc(100% - 1px)',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
            >
              <ShortsCard post={post} currentUserId={user.id} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
