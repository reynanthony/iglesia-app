import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Plus, Play,
  FileText, Megaphone, Video, Pin, Users,
} from 'lucide-react'

/* ── helpers ──────────────────────────────────────────── */
function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES_LARGO[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}

/* ── sub-components ───────────────────────────────────── */
function SectionLabel({
  label, color, count,
}: { label: string; color: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-10 pb-5 border-b border-edge">
      <div className="w-2 h-6 rounded-full flex-shrink-0 bg-ink" />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-3">{label}</p>
      {count !== undefined && (
        <span className="ml-auto text-[10px] font-bold text-ink-3">{count}</span>
      )}
    </div>
  )
}

function AnnouncementCard({ item, color }: { item: any; color: string }) {
  return (
    <article
      className="bg-card rounded-xl border border-edge hover:border-edge-2 transition p-6 flex flex-col gap-4 group"
    >
      <div
        className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md self-start"
        style={{ backgroundColor: color + '18', color }}
      >
        <Megaphone size={9} /> Anuncio
        {item.pinned && <><Pin size={8} className="ml-1" /> Fijado</>}
      </div>
      <h3 className="font-black text-ink text-lg leading-tight group-hover:text-[#222222] transition">
        {item.title}
      </h3>
      {item.body && (
        <p className="text-sm text-ink-2 leading-relaxed line-clamp-4 flex-1">{item.body}</p>
      )}
      <div className="pt-3 border-t border-edge flex items-center justify-between">
        <p className="text-[11px] text-ink-3">{fmtDate(item.created_at)}</p>
        {item.profiles?.full_name && (
          <p className="text-[11px] text-ink-3">{item.profiles.full_name}</p>
        )}
      </div>
    </article>
  )
}

function VideoCard({ item, color }: { item: any; color: string }) {
  const ytId = item.video_url ? getYouTubeId(item.video_url) : null
  return (
    <article className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden mb-4 bg-[#EBEBEB]" style={{ aspectRatio: '16/10' }}>
        {ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {item.image_url && (
              <img src={item.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:border-white/80 transition"
                style={{ backgroundColor: color + '30' }}
              >
                <Play size={18} className="text-white ml-1" />
              </div>
            </div>
            {item.video_url && (
              <a
                href={item.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label="Ver video"
              />
            )}
          </>
        )}
        {item.pinned && (
          <div
            className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md"
            style={{ backgroundColor: color, color: '#fff' }}
          >
            Fijado
          </div>
        )}
      </div>
      <h3 className="font-black text-ink group-hover:text-[#222222] transition leading-tight mb-1">
        {item.title}
      </h3>
      <p className="text-[11px] text-ink-3 uppercase tracking-wider">
        {item.profiles?.full_name ?? 'Ministerio'} · {fmtDate(item.created_at)}
      </p>
    </article>
  )
}

function ArticleCard({ item, color }: { item: any; color: string }) {
  return (
    <article className="bg-card rounded-xl border border-edge hover:border-edge-2 transition group overflow-hidden">
      {item.image_url && (
        <div className="overflow-hidden h-44 rounded-t-xl">
          <img
            src={item.image_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div
          className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md mb-4"
          style={{ backgroundColor: color + '18', color }}
        >
          <FileText size={9} /> Artículo
          {item.pinned && <><Pin size={8} className="ml-1" /> Fijado</>}
        </div>
        <h3 className="font-black text-ink text-lg leading-tight mb-3 group-hover:text-[#222222] transition">
          {item.title}
        </h3>
        {item.body && (
          <p className="text-sm text-ink-2 leading-relaxed line-clamp-3 mb-4">{item.body}</p>
        )}
        <div className="flex items-center gap-2 pt-4 border-t border-edge">
          <div className="w-6 h-6 rounded-full bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
            {item.profiles?.avatar_url ? (
              <img src={item.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-black text-ink-2">
                {item.profiles?.full_name?.[0]?.toUpperCase() ?? 'A'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-ink-3">{item.profiles?.full_name} · {fmtDate(item.created_at)}</p>
        </div>
      </div>
    </article>
  )
}

/* ── page ─────────────────────────────────────────────── */
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
      .from('profiles').select('role').eq('id', user.id).single()
    canPost = ['admin', 'pastor', 'moderador', 'lider'].includes(profile?.role ?? '')
  }

  const items      = content ?? []
  const anuncios   = items.filter(i => i.type === 'anuncio')
  const videos     = items.filter(i => i.type === 'video')
  const articulos  = items.filter(i => i.type === 'articulo')
  const pinned     = items.filter(i => i.pinned)
  const latestAnuncio = anuncios[0] ?? null
  const color = '#000000'

  return (
    <div>

      {/* ══ HERO ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EBEBEB 0%, #F4F4F4 50%, #FFFFFF 100%)' }}>

        {/* Radial glow from ministry color */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 80% 50%, ${color}18, transparent 70%)`,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-0">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]/40 mb-14">
            <Link href="/ministerios" className="hover:text-[#111111] transition flex items-center gap-1.5">
              <ArrowLeft size={11} /> Ministerios
            </Link>
            {ministry.parent && (
              <>
                <span>/</span>
                <Link href={`/ministerios/${ministry.parent.slug}`} className="hover:text-[#111111] transition">
                  {ministry.parent.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#111111]/65">{ministry.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-16">

            {/* Left: identity */}
            <div className="lg:col-span-7">
              {/* Icon */}
              <div
                className="w-20 h-20 flex items-center justify-center text-4xl rounded-2xl mb-8 border border-edge"
                style={{ backgroundColor: '#11111108', filter: 'grayscale(1)' }}
              >
                {ministry.icon}
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink-3 mb-4">
                — Ministerio
              </p>

              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.88] tracking-tighter text-[#111111] mb-6">
                {ministry.name}
              </h1>

              {ministry.description && (
                <p className="text-sm text-[#111111]/60 leading-relaxed max-w-lg">
                  {ministry.description}
                </p>
              )}
            </div>

            {/* Right: stats + actions */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-8">

              {/* Stats */}
              <div className="flex gap-6">
                {[
                  { n: articulos.length, label: 'Artículos' },
                  { n: videos.length,    label: 'Videos' },
                  { n: anuncios.length,  label: 'Anuncios' },
                ].map(({ n, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-3xl font-black text-[#111111] leading-none">{n}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/40 mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {canPost && (
                  <Link
                    href={`/app/ministerios/${slug}/nuevo`}
                    className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] px-5 py-3 rounded-lg transition text-[#111111] border border-[#111111]/15 hover:bg-[#111111]/8"
                  >
                    <Plus size={13} /> Publicar
                  </Link>
                )}
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] px-5 py-3 rounded-lg transition"
                  style={{ backgroundColor: color, color: '#fff' }}
                >
                  <Users size={13} /> Participar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Color accent line */}
        <div className="h-1 w-full" style={{ backgroundColor: color }} />
      </section>

      {/* ══ LATEST ANNOUNCEMENT BANNER ═════════════════════ */}
      {latestAnuncio && (
        <div
          className="border-b border-edge"
          style={{ backgroundColor: color + '0f' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <div
              className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md flex-shrink-0"
              style={{ backgroundColor: color + '20', color }}
            >
              <Megaphone size={9} /> Último anuncio
            </div>
            <p className="text-sm font-bold text-ink flex-1 line-clamp-1">{latestAnuncio.title}</p>
            <p className="text-[11px] text-ink-3 flex-shrink-0">{fmtDate(latestAnuncio.created_at)}</p>
          </div>
        </div>
      )}

      {/* ══ EMPTY STATE ════════════════════════════════════ */}
      {items.length === 0 && (
        <section className="max-w-6xl mx-auto px-6 py-40 text-center">
          <div
            className="w-24 h-24 flex items-center justify-center text-5xl rounded-3xl mx-auto mb-8 border border-edge"
            style={{ backgroundColor: '#11111108', filter: 'grayscale(1)' }}
          >
            {ministry.icon}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-3 mb-3">
            Próximamente
          </p>
          <p className="text-2xl font-black text-ink mb-3">
            Estamos preparando el contenido
          </p>
          <p className="text-sm text-ink-2 max-w-sm mx-auto">
            El equipo de {ministry.name} está trabajando para traerte recursos pronto.
          </p>
        </section>
      )}

      {/* ══ ANUNCIOS ═══════════════════════════════════════ */}
      {anuncios.length > 0 && (
        <section className="bg-surface border-b border-edge">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <SectionLabel
              label="Actividades y anuncios"
              color={color}
              count={anuncios.length}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {anuncios.map(item => (
                <AnnouncementCard key={item.id} item={item} color={color} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ VIDEOS ═════════════════════════════════════════ */}
      {videos.length > 0 && (
        <section className="bg-muted border-b border-edge">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <SectionLabel
              label="Videos y mensajes"
              color={color}
              count={videos.length}
            />

            {/* Featured video (first, if pinned) */}
            {videos[0].pinned && (
              <div className="mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-edge">
                  <div className="relative bg-[#EBEBEB] min-h-[280px]">
                    {(() => {
                      const ytId = videos[0].video_url ? getYouTubeId(videos[0].video_url) : null
                      return ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/30"
                            style={{ backgroundColor: color + '30' }}
                          >
                            <Play size={22} className="text-white ml-1" />
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                  <div className="bg-card p-8 lg:p-10 flex flex-col justify-center">
                    <div
                      className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md self-start mb-4"
                      style={{ backgroundColor: color + '18', color }}
                    >
                      <Pin size={9} /> Destacado
                    </div>
                    <h2 className="text-2xl font-black text-ink leading-tight tracking-tight mb-3">
                      {videos[0].title}
                    </h2>
                    {videos[0].body && (
                      <p className="text-sm text-ink-2 leading-relaxed line-clamp-3 mb-4">
                        {videos[0].body}
                      </p>
                    )}
                    <p className="text-[11px] text-ink-3 uppercase tracking-wider">
                      {videos[0].profiles?.full_name} · {fmtDate(videos[0].created_at)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(videos[0].pinned ? videos.slice(1) : videos).map(item => (
                <VideoCard key={item.id} item={item} color={color} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ ARTÍCULOS ══════════════════════════════════════ */}
      {articulos.length > 0 && (
        <section className="bg-surface border-b border-edge">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <SectionLabel
              label="Artículos y recursos"
              color={color}
              count={articulos.length}
            />

            {/* Featured article (pinned) */}
            {articulos[0].pinned && (
              <div className="mb-10 bg-card rounded-xl border border-edge hover:border-edge-2 transition group overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {articulos[0].image_url && (
                    <div className="lg:col-span-5 overflow-hidden h-64 lg:h-auto rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none">
                      <img
                        src={articulos[0].image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  )}
                  <div className={`p-8 lg:p-12 flex flex-col justify-center ${articulos[0].image_url ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                    <div
                      className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md self-start mb-5"
                      style={{ backgroundColor: color + '18', color }}
                    >
                      <Pin size={9} /> Artículo destacado
                    </div>
                    <h2 className="text-3xl font-black text-ink leading-tight tracking-tight mb-4 group-hover:text-[#222222] transition">
                      {articulos[0].title}
                    </h2>
                    {articulos[0].body && (
                      <p className="text-sm text-ink-2 leading-relaxed line-clamp-4 mb-6">
                        {articulos[0].body}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {articulos[0].profiles?.avatar_url ? (
                          <img src={articulos[0].profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-black text-ink-2">
                            {articulos[0].profiles?.full_name?.[0]?.toUpperCase() ?? 'A'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-3">
                        {articulos[0].profiles?.full_name} · {fmtDate(articulos[0].created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(articulos[0].pinned ? articulos.slice(1) : articulos).map(item => (
                <ArticleCard key={item.id} item={item} color={color} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #222222 100%)' }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 20% 50%, rgba(255,255,255,0.04), transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8">
              — {ministry.name}
            </p>
            <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tighter text-white">
              Sé parte<br />de este<br />ministerio.
            </h2>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 text-[#000000] text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition bg-white hover:bg-[#F4F4F4]"
            >
              Unirse a la comunidad <ArrowRight size={13} />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
