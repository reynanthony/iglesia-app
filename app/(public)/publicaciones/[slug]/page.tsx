import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import type { Metadata } from 'next'
import PublicacionBlockRenderer from '@/components/PublicacionBlockRenderer'

export const revalidate = 60

const CAT_LABEL: Record<string, string> = {
  campana:          'Campaña',
  serie:            'Serie',
  'evento-especial': 'Evento Especial',
  ministerio:       'Ministerio',
  anuncio:          'Anuncio',
  general:          'General',
}
const CAT_COLOR: Record<string, string> = {
  campana:          '#C9A227',
  serie:            '#A855F7',
  'evento-especial': '#76ABAE',
  ministerio:       '#4ADE80',
  anuncio:          '#F87171',
  general:          'rgba(246,243,235,0.50)',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('publicaciones').select('title, subtitle, excerpt, cover_image').eq('slug', slug).single()
  if (!data) return {}
  return {
    title: data.title,
    description: data.excerpt ?? data.subtitle ?? undefined,
    openGraph: data.cover_image ? { images: [data.cover_image] } : undefined,
  }
}

export default async function PublicacionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: item } = await supabase
    .from('publicaciones')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!item) notFound()

  const cc = CAT_COLOR[item.category] ?? '#76ABAE'
  const htmlBody = item.body ? DOMPurify.sanitize(await marked.parse(item.body)) : null
  const blocks: any[] = Array.isArray(item.blocks) ? item.blocks : []
  const hasBlocks = blocks.length > 0

  // Other publications for footer nav
  const { data: others } = await supabase
    .from('publicaciones')
    .select('id, slug, title, category, cover_image, cover_color')
    .eq('is_active', true)
    .neq('id', item.id)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <div style={{ background: '#051828', color: '#F6F3EB', minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden"
        style={{ minHeight: '70vh', background: item.cover_color ?? '#093C5D' }}>
        {item.cover_image && (
          <>
            <img src={item.cover_image} alt={item.title}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(5,24,40,0.30) 0%, rgba(5,24,40,0.65) 60%, rgba(5,24,40,0.96) 100%)' }} />
          </>
        )}
        {!item.cover_image && (
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(118,171,174,0.08) 0%, transparent 60%)' }} />
        )}

        {/* Back link */}
        <div className="relative max-w-4xl mx-auto px-6 pt-8">
          <Link href="/publicaciones"
            className="inline-flex items-center gap-2 text-[12px] font-bold transition hover:opacity-70"
            style={{ color: 'rgba(246,243,235,0.55)' }}>
            <ArrowLeft size={13} /> Publicaciones
          </Link>
        </div>

        {/* Hero content */}
        <div className="relative max-w-4xl mx-auto px-6 flex flex-col justify-end pb-12 md:pb-16"
          style={{ minHeight: 'calc(70vh - 56px)' }}>

          {/* Category + date row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full"
              style={{ background: `${cc}20`, color: cc, border: `1px solid ${cc}40` }}>
              {CAT_LABEL[item.category] ?? item.category}
            </span>
            <span className="text-[12px]" style={{ color: 'rgba(246,243,235,0.50)' }}>
              {new Date(item.published_at).toLocaleDateString('es-DO', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black leading-[0.92] mb-4"
            style={{ fontSize: 'clamp(32px, 6vw, 72px)', color: '#F6F3EB', maxWidth: 800 }}>
            {item.title}
          </h1>

          {/* Subtitle */}
          {item.subtitle && (
            <p className="text-base md:text-xl italic leading-relaxed"
              style={{ color: 'rgba(246,243,235,0.75)', maxWidth: 620 }}>
              {item.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── BODY / BLOCKS ────────────────────────────────────────── */}

      {/* Excerpt (always shown) */}
      {item.excerpt && (
        <div className="max-w-4xl mx-auto px-6 pt-10">
          <p className="text-lg md:text-xl leading-relaxed font-medium pb-8"
            style={{ color: 'rgba(246,243,235,0.75)', borderBottom: '1px solid rgba(246,243,235,0.08)' }}>
            {item.excerpt}
          </p>
        </div>
      )}

      {/* Block content (if blocks exist) */}
      {hasBlocks && (
        <PublicacionBlockRenderer blocks={blocks} />
      )}

      {/* Markdown fallback (if no blocks) */}
      {!hasBlocks && htmlBody && (
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-16">
            <div>
              <div
                className="publicacion-body"
                dangerouslySetInnerHTML={{ __html: htmlBody }}
                style={{ color: 'rgba(246,243,235,0.80)', fontSize: 16, lineHeight: 1.8 }}
              />
            </div>
            <aside className="space-y-6">
              <div className="rounded-xl p-5" style={{ background: '#0B2D47', border: '1px solid rgba(246,243,235,0.07)' }}>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: 'rgba(246,243,235,0.30)' }}>Información</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(246,243,235,0.35)' }}>Categoría</p>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${cc}20`, color: cc }}>
                      {CAT_LABEL[item.category] ?? item.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(246,243,235,0.35)' }}>Publicado</p>
                    <p className="text-sm" style={{ color: '#F6F3EB' }}>
                      {new Date(item.published_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
              {others && others.length > 0 && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(246,243,235,0.30)' }}>
                    Otras publicaciones
                  </p>
                  <div className="space-y-2">
                    {others.map(o => (
                      <Link key={o.id} href={`/publicaciones/${o.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl transition hover:opacity-80"
                        style={{ background: '#0B2D47', border: '1px solid rgba(246,243,235,0.07)' }}>
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: o.cover_color ?? '#093C5D' }}>
                          {o.cover_image && <img src={o.cover_image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <p className="text-[12px] font-medium leading-tight line-clamp-2" style={{ color: 'rgba(246,243,235,0.75)' }}>
                          {o.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}

      {/* CTA button (shown when blocks exist, or when no blocks and no body) */}
      {item.cta_url && (hasBlocks || !htmlBody) && (
        <div className="max-w-4xl mx-auto px-6 pb-10 pt-4">
          <Link href={item.cta_url}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-bold transition hover:opacity-90"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            {item.cta_label ?? 'Más información'} <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Related publicaciones (shown after blocks) */}
      {hasBlocks && others && others.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 py-10" style={{ borderTop: '1px solid rgba(246,243,235,0.06)' }}>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: 'rgba(246,243,235,0.30)' }}>
            Otras publicaciones
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {others.map(o => (
              <Link key={o.id} href={`/publicaciones/${o.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl transition hover:opacity-80"
                style={{ background: '#0B2D47', border: '1px solid rgba(246,243,235,0.07)' }}>
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: o.cover_color ?? '#093C5D' }}>
                  {o.cover_image && <img src={o.cover_image} alt="" className="w-full h-full object-cover" />}
                </div>
                <p className="text-[12px] font-medium leading-tight line-clamp-2" style={{ color: 'rgba(246,243,235,0.75)' }}>
                  {o.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER RULE ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex items-center gap-4 pt-8" style={{ borderTop: '1px solid rgba(246,243,235,0.08)' }}>
          <Link href="/publicaciones"
            className="inline-flex items-center gap-2 text-[12px] font-bold transition hover:opacity-70"
            style={{ color: '#76ABAE' }}>
            <ArrowLeft size={13} /> Ver todas las publicaciones
          </Link>
        </div>
      </div>

      {/* Markdown body styles */}
      <style>{`
        .publicacion-body h1, .publicacion-body h2, .publicacion-body h3 {
          font-family: var(--font-playfair, serif);
          font-weight: 900;
          color: #F6F3EB;
          margin-top: 2em;
          margin-bottom: 0.5em;
          line-height: 1.15;
        }
        .publicacion-body h1 { font-size: clamp(22px, 3vw, 36px); }
        .publicacion-body h2 { font-size: clamp(18px, 2.5vw, 28px); }
        .publicacion-body h3 { font-size: clamp(16px, 2vw, 22px); }
        .publicacion-body p  { margin-bottom: 1.4em; }
        .publicacion-body strong { color: #F6F3EB; font-weight: 700; }
        .publicacion-body em { color: rgba(246,243,235,0.70); font-style: italic; }
        .publicacion-body a { color: #76ABAE; text-decoration: underline; text-underline-offset: 3px; }
        .publicacion-body blockquote {
          border-left: 3px solid #76ABAE;
          padding: 0.75em 1.25em;
          margin: 1.5em 0;
          background: rgba(118,171,174,0.06);
          border-radius: 0 8px 8px 0;
          color: rgba(246,243,235,0.70);
          font-style: italic;
        }
        .publicacion-body ul, .publicacion-body ol {
          padding-left: 1.5em;
          margin-bottom: 1.4em;
        }
        .publicacion-body li { margin-bottom: 0.4em; }
        .publicacion-body hr {
          border: none;
          border-top: 1px solid rgba(246,243,235,0.10);
          margin: 2em 0;
        }
        .publicacion-body img {
          width: 100%;
          border-radius: 12px;
          margin: 1.5em 0;
        }
      `}</style>
    </div>
  )
}
