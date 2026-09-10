import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Heart, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/service'
import { getSiteSettings } from '@/lib/site-settings'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export const revalidate = 0

async function getOrigin() {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'https'
  return `${proto}://${h.get('host')}`
}

async function getPost(id: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('posts')
    .select('id, content, image_url, category, created_at, profiles(full_name, username, avatar_url), reactions(id), comments(id)')
    .eq('id', id)
    .single()
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return {}

  const [{ siteName }, origin] = await Promise.all([getSiteSettings(), getOrigin()])
  const author = (post.profiles as unknown as { full_name?: string } | null)?.full_name ?? 'Comunidad'
  const description = post.content?.trim()
    ? post.content.trim().slice(0, 150)
    : `Una publicación de la comunidad de ${siteName}.`
  const title = `${author} · ${siteName}`
  const image = post.image_url ?? `${origin}/api/og/post?id=${id}`

  return {
    title,
    description,
    openGraph: { title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function ComunidadPostPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()

  const profile = post.profiles as unknown as { full_name?: string; username?: string; avatar_url?: string } | null
  const authorName = profile?.full_name ?? 'Miembro de la comunidad'
  const date = new Date(post.created_at).toLocaleDateString('es-DO', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const reactionCount = Array.isArray(post.reactions) ? post.reactions.length : 0
  const commentCount = Array.isArray(post.comments) ? post.comments.length : 0

  return (
    <div style={{ background: BG, color: INK, minHeight: '100vh' }} className="flex flex-col">
      <div className="max-w-xl w-full mx-auto px-6 py-12 md:py-20 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: MUTED }}>
          Publicación compartida
        </p>

        <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {/* Autor */}
          <div className="flex items-center gap-3 px-5 pt-5">
            <div
              className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold"
              style={{ background: BORDER, color: GOLD }}
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                : authorName[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="font-bold text-sm leading-tight" style={{ color: INK }}>{authorName}</p>
              <p className="text-xs" style={{ color: MUTED }}>{date}</p>
            </div>
          </div>

          {/* Contenido */}
          {post.content && (
            <p className="px-5 pt-4 text-[15px] leading-relaxed" style={{ color: INK }}>
              {post.content}
            </p>
          )}

          {/* Imagen */}
          {post.image_url && (
            <img src={post.image_url} alt="" className="w-full object-cover mt-4" />
          )}

          {/* Categoría + métricas */}
          <div className="flex items-center gap-4 px-5 py-4 mt-1">
            {post.category && (
              <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg"
                style={{ background: `${GOLD}1F`, color: `${GOLD}B2` }}>
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: MUTED }}>
              <Heart size={14} strokeWidth={1.8} /> {reactionCount}
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
              <MessageCircle size={14} strokeWidth={1.8} /> {commentCount}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/app/comunidad"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black transition hover:opacity-90"
            style={{ background: GOLD, color: GOLD_INK }}
          >
            Abrir en la app <ArrowRight size={16} />
          </Link>
          <p className="text-center text-xs" style={{ color: MUTED }}>
            Inicia sesión para reaccionar, comentar y ver todo el feed.
          </p>
        </div>
      </div>
    </div>
  )
}
