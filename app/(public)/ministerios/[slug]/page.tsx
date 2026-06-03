import { notFound } from 'next/navigation'
import Link from 'next/link'
import { detectSocialEmbed } from '@/lib/social-embed'
import { cmsGet, cmsImageUrl, type DMinisterio, type DMinisterioContenido } from '@/lib/directus'
import { HeroVideo } from '@/components/public/HeroVideo'
import {
  ArrowLeft, ArrowRight, Play, FileText, Megaphone, Video, Pin,
  Users, Music, Heart, Star, BookOpen, Mic, Baby, Flame, Home, Globe,
  Zap, Sparkles, type LucideIcon,
} from 'lucide-react'
import { VideoPlayButton } from '@/components/public/VideoModal'

export const revalidate = 60

const DARK  = '#051828'
const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'

const SLUG_ICON: Record<string, LucideIcon> = {
  joven: Flame,    matrimoni: Heart,
  adoraci: Music,  alabanza: Music,
  oraci: Sparkles, intercesi: Sparkles,
  nino: Baby,      infanti: Baby,
  famili: Home,    hogar: Home,
  mujer: Star,     damas: Star,
  hombre: Zap,     varon: Zap,
  mision: Globe,   evangelism: Globe,
  pastor: BookOpen, estudio: BookOpen,
}

function getIcon(slug: string): LucideIcon {
  const s = slug.toLowerCase()
  for (const [k, C] of Object.entries(SLUG_ICON)) if (s.includes(k)) return C
  return Users
}

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}
function itemDate(item: DMinisterioContenido) {
  return fmtDate(item.date_published ?? item.date_created)
}

function SectionLabel({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-10 pb-5 border-b border-edge">
      <div className="w-2 h-6 rounded-full flex-shrink-0" style={{ background: TEAL }} />
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-3">{label}</p>
      {count !== undefined && <span className="ml-auto text-[10px] font-bold text-ink-3">{count}</span>}
    </div>
  )
}

function AnnouncementCard({ item, href }: { item: DMinisterioContenido; href: string }) {
  return (
    <Link href={href}>
      <article className="bg-card rounded-xl border border-edge hover:border-edge-2 transition p-6 flex flex-col gap-4 group cursor-pointer">
        <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md self-start"
          style={{ backgroundColor: TEAL + '18', color: TEAL }}>
          <Megaphone size={9} /> Anuncio
          {item.pinned && <><Pin size={8} className="ml-1" /> Fijado</>}
        </div>
        <h3 className="font-black text-ink text-lg leading-tight group-hover:text-ink-2 transition">{item.title}</h3>
        {item.body && <p className="text-sm text-ink-2 leading-relaxed line-clamp-4 flex-1">{item.body}</p>}
        <div className="pt-3 border-t border-edge flex items-center justify-between">
          <p className="text-[11px] text-ink-3">{itemDate(item)}</p>
          {item.author && <p className="text-[11px] text-ink-3">{item.author}</p>}
        </div>
      </article>
    </Link>
  )
}

function VideoCard({ item, href }: { item: DMinisterioContenido; href: string }) {
  const embed  = item.video_url ? detectSocialEmbed(item.video_url) : null
  const imgUrl = cmsImageUrl(item.image)
  return (
    <Link href={href}>
      <article className="group cursor-pointer">
        {embed ? (
          <div className="relative rounded-xl overflow-hidden mb-4"
            style={{ paddingBottom: embed.aspectPadding, height: 0, background: `linear-gradient(135deg, ${NAVY}, #0D4A72)` }}>
            <iframe src={embed.embedUrl} className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen loading="lazy" style={{ border: 'none' }} />
            {item.pinned && (
              <div className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md"
                style={{ backgroundColor: TEAL, color: NAVY }}>Fijado</div>
            )}
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden mb-4"
            style={{ aspectRatio: '16/10', background: `linear-gradient(135deg, ${NAVY}, #0D4A72)` }}>
            {imgUrl && <img src={imgUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:border-white/80 transition"
                style={{ backgroundColor: TEAL + '30' }}>
                <Play size={18} className="text-white ml-1" />
              </div>
            </div>
            {item.pinned && (
              <div className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md"
                style={{ backgroundColor: TEAL, color: NAVY }}>Fijado</div>
            )}
          </div>
        )}
        <h3 className="font-black text-ink group-hover:text-ink-2 transition leading-tight mb-1">{item.title}</h3>
        <p className="text-[11px] text-ink-3 uppercase tracking-wider">{item.author ?? 'Ministerio'} · {itemDate(item)}</p>
      </article>
    </Link>
  )
}

function ArticleCard({ item, href }: { item: DMinisterioContenido; href: string }) {
  const imgUrl = cmsImageUrl(item.image)
  return (
    <Link href={href}>
      <article className="bg-card rounded-xl border border-edge hover:border-edge-2 transition group overflow-hidden cursor-pointer">
        {imgUrl && (
          <div className="overflow-hidden h-44 rounded-t-xl">
            <img src={imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          </div>
        )}
        <div className="p-6">
          <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md mb-4"
            style={{ backgroundColor: TEAL + '18', color: TEAL }}>
            <FileText size={9} /> Artículo
            {item.pinned && <><Pin size={8} className="ml-1" /> Fijado</>}
          </div>
          <h3 className="font-black text-ink text-lg leading-tight mb-3 group-hover:text-ink-2 transition">{item.title}</h3>
          {item.body && <p className="text-sm text-ink-2 leading-relaxed line-clamp-3 mb-4">{item.body}</p>}
          <div className="flex items-center gap-2 pt-4 border-t border-edge">
            <p className="text-[11px] text-ink-3">{item.author} · {itemDate(item)}</p>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function PublicMinistryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [ministries, allContent] = await Promise.all([
    cmsGet<DMinisterio>('ministerios', {
      'filter[slug][_eq]': slug,
      'filter[status][_eq]': 'published',
      'limit': '1',
    }),
    cmsGet<DMinisterioContenido>('ministerio_contenido', {
      'filter[status][_eq]': 'published',
      'sort': '-pinned,-date_published,-date_created',
    }),
  ])

  const ministry = ministries[0]
  if (!ministry) notFound()

  const items     = allContent.filter(i => i.ministerio === ministry.id)
  const anuncios  = items.filter(i => i.type === 'anuncio')
  const videos    = items.filter(i => i.type === 'video')
  const articulos = items.filter(i => i.type === 'articulo')
  const latestAnuncio = anuncios[0] ?? null
  const IconComponent = getIcon(slug)
  const imgUrl    = cmsImageUrl(ministry.imagen)
  const leaderImg = cmsImageUrl(ministry.leader_photo)

  return (
    <div>

      {/* ══ HERO ═══════════════════════════════════════════ */}
      {(() => {
        const overlayOpacity = ministry.hero_overlay_opacity ?? 0.80
        const showGrid       = ministry.hero_show_grid !== false
        const gridOpacity    = 0.04
        return (
      <section className="relative overflow-hidden" style={{ background: DARK, minHeight: '60vh' }}>

        {/* Fondo: video tiene prioridad sobre foto */}
        {ministry.video_url ? (
          <HeroVideo url={ministry.video_url} opacity={0.45} />
        ) : imgUrl ? (
          <img src={imgUrl} alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.40 }} />
        ) : null}

        {/* Overlay degradado */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(160deg, rgba(5,24,40,${overlayOpacity}) 0%, rgba(9,60,93,${Math.max(0, overlayOpacity - 0.20)}) 60%, rgba(118,171,174,0.10) 100%)` }} />

        {/* Grilla sutil */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ opacity: gridOpacity, backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 80px)` }} />
        )}

        {/* Watermark decorativo */}
        {ministry.hero_watermark && (
          <div className="pointer-events-none absolute select-none right-0 bottom-0 overflow-hidden"
            aria-hidden>
            <span className="font-black text-white leading-none tracking-tighter block"
              style={{ fontSize: 'clamp(10rem, 30vw, 28rem)', opacity: 0.05, lineHeight: 1 }}>
              {ministry.hero_watermark}
            </span>
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-0">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-14 text-white/40">
            <Link href="/ministerios" className="hover:text-white/80 transition flex items-center gap-1.5">
              <ArrowLeft size={11} /> Ministerios
            </Link>
            <span>/</span>
            <span className="text-white/65">{ministry.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-16">

            {/* Left: identity */}
            <div className="lg:col-span-7">
              <div className="w-20 h-20 flex items-center justify-center rounded-2xl mb-8"
                style={{ background: 'rgba(118,171,174,0.15)', border: '1px solid rgba(118,171,174,0.30)' }}>
                <IconComponent size={34} color={TEAL} strokeWidth={1.5} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: TEAL }}>— Ministerio</p>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.88] tracking-tighter mb-6" style={{ color: CREAM }}>
                {ministry.name}
              </h1>
              {ministry.description && (
                <p className="text-sm leading-relaxed max-w-lg mb-6" style={{ color: 'rgba(246,243,235,0.60)' }}>
                  {ministry.description}
                </p>
              )}
              {ministry.video_url && (
                <VideoPlayButton url={ministry.video_url} label="Ver video del ministerio" />
              )}
            </div>

            {/* Right: stats */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-8">
              <div className="flex gap-6">
                {[
                  { n: articulos.length, label: 'Artículos' },
                  { n: videos.length,    label: 'Videos' },
                  { n: anuncios.length,  label: 'Anuncios' },
                ].map(({ n, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-3xl font-black leading-none" style={{ color: CREAM }}>{n}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: 'rgba(246,243,235,0.40)' }}>{label}</p>
                  </div>
                ))}
              </div>
              <Link href="/login"
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] px-5 py-3 rounded-lg transition hover:opacity-90"
                style={{ backgroundColor: TEAL, color: NAVY }}>
                <Users size={13} /> Participar
              </Link>
            </div>
          </div>
        </div>
        <div className="h-1 w-full" style={{ backgroundColor: TEAL }} />
      </section>
        )
      })()}

      {/* ══ LATEST ANNOUNCEMENT BANNER ══════════════════════ */}
      {latestAnuncio && (
        <div className="border-b border-edge" style={{ backgroundColor: TEAL + '0f' }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md flex-shrink-0"
              style={{ backgroundColor: TEAL + '20', color: TEAL }}>
              <Megaphone size={9} /> Último anuncio
            </div>
            <p className="text-sm font-bold text-ink flex-1 line-clamp-1">{latestAnuncio.title}</p>
            <p className="text-[11px] text-ink-3 flex-shrink-0">{itemDate(latestAnuncio)}</p>
          </div>
        </div>
      )}

      {/* ══ EMPTY STATE ════════════════════════════════════ */}
      {items.length === 0 && (
        <section className="max-w-6xl mx-auto px-6 py-40 text-center">
          <div className="w-24 h-24 flex items-center justify-center rounded-3xl mx-auto mb-8"
            style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.20)' }}>
            <IconComponent size={40} color={TEAL} strokeWidth={1.5} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-3 mb-3">Próximamente</p>
          <p className="text-2xl font-black text-ink mb-3">Estamos preparando el contenido</p>
          <p className="text-sm text-ink-2 max-w-sm mx-auto">
            El equipo de {ministry.name} está trabajando para traerte recursos pronto.
          </p>
        </section>
      )}

      {/* ══ ANUNCIOS ════════════════════════════════════════ */}
      {anuncios.length > 0 && (
        <section className="bg-surface border-b border-edge">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <SectionLabel label="Actividades y anuncios" count={anuncios.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {anuncios.map(item => (
                <AnnouncementCard key={item.id} item={item} href={`/ministerios/${slug}/contenido/${item.id}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ VIDEOS ══════════════════════════════════════════ */}
      {videos.length > 0 && (
        <section className="bg-muted border-b border-edge">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <SectionLabel label="Videos y mensajes" count={videos.length} />

            {videos[0].pinned && (
              <div className="mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-edge">
                  <div className="relative min-h-[280px]" style={{ background: `linear-gradient(135deg, ${NAVY}, #0D4A72)` }}>
                    {(() => {
                      const embed = videos[0].video_url ? detectSocialEmbed(videos[0].video_url) : null
                      return embed ? (
                        <iframe src={embed.embedUrl} className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen loading="lazy" style={{ border: 'none' }} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/30"
                            style={{ backgroundColor: TEAL + '30' }}>
                            <Play size={22} className="text-white ml-1" />
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                  <div className="bg-card p-8 lg:p-10 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md self-start mb-4"
                      style={{ backgroundColor: TEAL + '18', color: TEAL }}>
                      <Pin size={9} /> Destacado
                    </div>
                    <h2 className="text-2xl font-black text-ink leading-tight tracking-tight mb-3">{videos[0].title}</h2>
                    {videos[0].body && <p className="text-sm text-ink-2 leading-relaxed line-clamp-3 mb-4">{videos[0].body}</p>}
                    <p className="text-[11px] text-ink-3 uppercase tracking-wider">{videos[0].author} · {itemDate(videos[0])}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(videos[0].pinned ? videos.slice(1) : videos).map(item => (
                <VideoCard key={item.id} item={item} href={`/ministerios/${slug}/contenido/${item.id}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ ARTÍCULOS ═══════════════════════════════════════ */}
      {articulos.length > 0 && (
        <section className="bg-surface border-b border-edge">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <SectionLabel label="Artículos y recursos" count={articulos.length} />

            {articulos[0].pinned && (
              <Link href={`/ministerios/${slug}/contenido/${articulos[0].id}`}>
                <div className="mb-10 bg-card rounded-xl border border-edge hover:border-edge-2 transition group overflow-hidden cursor-pointer">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {cmsImageUrl(articulos[0].image) && (
                      <div className="lg:col-span-5 overflow-hidden h-64 lg:h-auto rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none">
                        <img src={cmsImageUrl(articulos[0].image)!} alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                    )}
                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${cmsImageUrl(articulos[0].image) ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                      <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-md self-start mb-5"
                        style={{ backgroundColor: TEAL + '18', color: TEAL }}>
                        <Pin size={9} /> Artículo destacado
                      </div>
                      <h2 className="text-3xl font-black text-ink leading-tight tracking-tight mb-4 group-hover:text-ink-2 transition">
                        {articulos[0].title}
                      </h2>
                      {articulos[0].body && <p className="text-sm text-ink-2 leading-relaxed line-clamp-4 mb-6">{articulos[0].body}</p>}
                      <p className="text-[11px] text-ink-3">{articulos[0].author} · {itemDate(articulos[0])}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(articulos[0].pinned ? articulos.slice(1) : articulos).map(item => (
                <ArticleCard key={item.id} item={item} href={`/ministerios/${slug}/contenido/${item.id}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ LÍDER DEL MINISTERIO ════════════════════════════ */}
      {ministry.leader_name && (
        <section className="bg-card border-b border-edge">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <SectionLabel label="Liderazgo del ministerio" />
            <div className="flex flex-col md:flex-row items-start gap-8 max-w-2xl">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{ background: `${TEAL}18`, border: `2px solid ${TEAL}30` }}>
                {leaderImg ? (
                  <img src={leaderImg} alt={ministry.leader_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-3xl" style={{ color: TEAL }}>
                    {ministry.leader_name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: TEAL }}>
                  {ministry.leader_title ?? 'Líder'}
                </p>
                <h3 className="text-2xl font-black text-ink tracking-tight mb-3">{ministry.leader_name}</h3>
                {ministry.leader_bio && <p className="text-sm text-ink-2 leading-relaxed">{ministry.leader_bio}</p>}
                <Link href="/contacto"
                  className="inline-flex items-center gap-2 mt-5 text-[11px] font-bold uppercase tracking-[0.2em] transition"
                  style={{ color: TEAL }}>
                  Contactar <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA ═════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, #0D4A72 100%)` }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 100% at 20% 50%, rgba(118,171,174,0.08), transparent 70%)` }} />
        <div className="pointer-events-none absolute select-none font-black leading-none tracking-tighter right-0 bottom-0"
          style={{ fontSize: 'clamp(8rem, 20vw, 18rem)', color: TEAL, opacity: 0.05, lineHeight: 1 }}
          aria-hidden>
          {ministry.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8" style={{ color: 'rgba(118,171,174,0.50)' }}>— {ministry.name}</p>
            <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tighter" style={{ color: CREAM }}>
              Sé parte<br />de este<br />ministerio.
            </h2>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link href="/login"
              className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition hover:opacity-90"
              style={{ background: CREAM, color: NAVY }}>
              Unirse a la comunidad <ArrowRight size={13} />
            </Link>
            <Link href="/contacto"
              className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition"
              style={{ border: '1px solid rgba(118,171,174,0.25)', color: 'rgba(246,243,235,0.60)' }}>
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
