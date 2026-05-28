import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Users, Baby, Heart, Music, BookOpen, Globe, Church, Flame, Star, HandHeart } from 'lucide-react'
import BlockRenderer from '@/components/BlockRenderer'

export const dynamic = 'force-dynamic'

function getIcon(ministry: { slug?: string; name?: string }) {
  const key = ((ministry.slug ?? '') + ' ' + (ministry.name ?? '')).toLowerCase()
  if (key.includes('joven') || key.includes('youth')) return Users
  if (key.includes('niño') || key.includes('nino') || key.includes('infant')) return Baby
  if (key.includes('matrimoni') || key.includes('famili') || key.includes('couple')) return Heart
  if (key.includes('adorac') || key.includes('music') || key.includes('alabanz')) return Music
  if (key.includes('oraci') || key.includes('prayer') || key.includes('interces')) return HandHeart
  if (key.includes('evangel') || key.includes('mision') || key.includes('mission')) return Globe
  if (key.includes('educ') || key.includes('discipul') || key.includes('estudio')) return BookOpen
  if (key.includes('dama') || key.includes('mujer') || key.includes('ladies')) return Star
  if (key.includes('hombre') || key.includes('varon') || key.includes('men')) return Flame
  return Church
}

const placeholders = [
  'linear-gradient(150deg, #093C5D 0%, #76ABAE 100%)',
  'linear-gradient(150deg, #051828 0%, #093C5D 100%)',
  'linear-gradient(150deg, #869B7E 0%, #A8BCA2 100%)',
  'linear-gradient(150deg, #093C5D 0%, #0D4A72 100%)',
  'linear-gradient(150deg, #76ABAE 0%, #093C5D 100%)',
  'linear-gradient(150deg, #0D4A72 0%, #76ABAE 100%)',
]

export default async function MinisteriosPage() {
  const supabase = await createClient()

  const [pageResult, ministriesResult] = await Promise.all([
    supabase.from('page_content').select('content').eq('page', 'ministerios').single(),
    supabase.from('ministries').select('*').order('created_at', { ascending: true }),
  ])

  const editorialBlocks = (pageResult.data?.content as any)?.blocks
  const hasBlocks = Array.isArray(editorialBlocks) && editorialBlocks.length > 0

  const pageContent = (pageResult.data?.content ?? {}) as Record<string, any>
  const heroEyebrow     = (pageContent.hero_eyebrow     as string) || 'Ministerios\nUn lugar para todos'
  const heroTitleMain   = (pageContent.hero_title_main   as string) || 'Un lugar\npara'
  const heroTitleAccent = (pageContent.hero_title_accent as string) || 'todos.'
  const heroSubtitle    = (pageContent.hero_subtitle     as string) || 'Cada ministerio es una comunidad viva donde crecer en fe, servir y conectar con otros creyentes.'
  const heroImageUrl    = (pageContent.hero_image_url    as string) || null
  const heroVideoUrl    = (pageContent.hero_video_url    as string) || null
  const minCtaEyebrow   = (pageContent.min_cta_eyebrow   as string) || '— Sírvenos'
  const minCtaTitle     = (pageContent.min_cta_title     as string) || '¿Dónde\nencajas tú?'
  const minCtaLabel     = (pageContent.min_cta_label     as string) || 'Contáctanos'
  const minCtaUrl       = (pageContent.min_cta_url       as string) || '/contacto'

  const allMinistries = ministriesResult.data

  const parents = allMinistries?.filter(m => !m.parent_id) ?? []
  const children = allMinistries?.filter(m => m.parent_id) ?? []
  const ministriesWithSubs = parents.map((p, i) => ({
    ...p,
    n: String(i + 1).padStart(2, '0'),
    sub: children.filter(c => c.parent_id === p.id),
  }))

  return (
    <div>

      {/* ═══════════════════════════════════════
          ZONA EDITORIAL — bloques del admin, o hero hardcoded
      ═══════════════════════════════════════ */}
      {hasBlocks ? (
        <BlockRenderer blocks={editorialBlocks} />
      ) : (
      <section className="relative overflow-hidden" style={{ background: '#093C5D' }}>
        {heroImageUrl && !heroVideoUrl && (
          <img src={heroImageUrl} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
        )}
        {heroVideoUrl && (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.60 }}>
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        )}
        {(heroImageUrl || heroVideoUrl) && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.50) 0%, rgba(9,60,93,0.35) 100%)' }} />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(118,171,174,0.12), transparent 70%)' }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 80px)' }} />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-28 md:pt-48 md:pb-40">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-0.5 h-12 flex-shrink-0" style={{ background: 'rgba(118,171,174,0.5)' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] leading-relaxed" style={{ color: 'rgba(118,171,174,0.6)' }}>
              {heroEyebrow.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
          </div>
          <h1
            className="font-display font-black leading-[0.85] tracking-tighter text-white mb-8"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            {heroTitleMain.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
            {heroTitleAccent && <><br /><em style={{ color: '#76ABAE' }}>{heroTitleAccent}</em></>}
          </h1>
          <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(246,243,235,0.55)' }}>
            {heroSubtitle}
          </p>
        </div>
        <div className="h-px w-full" style={{ background: 'rgba(118,171,174,0.15)' }} />
      </section>
      )}

      {/* ═══════════════════════════════════════
          ZONA DE DATOS — siempre visible
      ═══════════════════════════════════════ */}

      {/* GRID */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-center justify-between mb-16 border-b border-edge pb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">
              — {ministriesWithSubs.length > 0 ? `${ministriesWithSubs.length} ministerios` : 'Ministerios'}
            </p>
          </div>

          {ministriesWithSubs.length === 0 ? (
            <div className="py-40 text-center border border-edge rounded-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-4">Próximamente</p>
              <p className="text-3xl font-black text-ink">Estamos preparando este espacio</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {ministriesWithSubs.map((ministry: any, idx: number) => {
                const Icon = getIcon(ministry)
                return (
                  <Link
                    key={ministry.id}
                    href={'/ministerios/' + ministry.slug}
                    className="group block"
                  >
                    {/* Image / placeholder */}
                    <div
                      className="relative rounded-2xl overflow-hidden mb-6"
                      style={{ aspectRatio: '4/3' }}
                    >
                      {ministry.image_url ? (
                        <img
                          src={ministry.image_url}
                          alt={ministry.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105"
                          style={{ background: placeholders[idx % placeholders.length] }}
                        >
                          <Icon size={48} strokeWidth={1} className="text-white/15" />
                        </div>
                      )}

                      {/* Bottom gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 via-[#000000]/10 to-transparent" />

                      {/* Number */}
                      <span className="absolute top-5 left-5 text-[10px] font-bold text-white/40 tracking-widest">
                        {ministry.n}
                      </span>

                      {/* Hover arrow */}
                      <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full border border-white/20 bg-white/0 group-hover:bg-white flex items-center justify-center transition-all duration-300">
                        <ArrowRight
                          size={14}
                          className="text-white group-hover:text-[#000000] transition-colors duration-300 translate-x-[1px] group-hover:translate-x-[3px] group-hover:transition-transform"
                        />
                      </div>

                      {/* Ministry name overlay at bottom */}
                      <div className="absolute bottom-5 left-5 right-16">
                        <p className="text-white font-black tracking-tight leading-tight"
                          style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)' }}>
                          {ministry.name}
                        </p>
                      </div>
                    </div>

                    {/* Description + sub-ministries */}
                    <div>
                      <p className="text-sm text-ink-2 leading-relaxed mb-4">
                        {ministry.description}
                      </p>

                      {ministry.sub.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {ministry.sub.map((sub: any) => (
                            <span
                              key={sub.id}
                              className="text-[10px] font-bold uppercase tracking-wider text-ink-3 bg-muted border border-edge px-3 py-1.5 rounded-full"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #051828 0%, #093C5D 60%, #76ABAE 100%)' }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 mb-10">{minCtaEyebrow}</p>
            <h2
              className="font-display font-black leading-[0.85] tracking-tighter text-white"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
            >
              {minCtaTitle.split('\n').map((line, i, arr) => (
                <span key={i}>{i === 1 ? <em>{line}</em> : line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>
          </div>
          <Link
            href={minCtaUrl}
            className="inline-flex items-center gap-3 bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition flex-shrink-0 group"
          >
            {minCtaLabel} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  )
}
