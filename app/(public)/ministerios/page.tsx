import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Users, Baby, Heart, Music, BookOpen, Globe, Church, Flame, Star, HandHeart } from 'lucide-react'
import BlockRenderer from '@/components/BlockRenderer'

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
  'linear-gradient(150deg, #082E22 0%, #1B7A5E 100%)',
  'linear-gradient(150deg, #0B4A38 0%, #22A67A 100%)',
  'linear-gradient(150deg, #0A3D2E 0%, #1B7A5E 100%)',
  'linear-gradient(150deg, #134D3F 0%, #22A67A 100%)',
  'linear-gradient(150deg, #0F5C47 0%, #1B7A5E 100%)',
  'linear-gradient(150deg, #1A7060 0%, #22A67A 100%)',
]

export default async function MinisteriosPage() {
  const supabase = await createClient()

  const [pageResult, ministriesResult] = await Promise.all([
    supabase.from('page_content').select('content').eq('page', 'ministerios').single(),
    supabase.from('ministries').select('*').order('created_at', { ascending: true }),
  ])

  const editorialBlocks = (pageResult.data?.content as any)?.blocks
  const hasBlocks = Array.isArray(editorialBlocks) && editorialBlocks.length > 0

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
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #082E22 0%, #0B4A38 50%, #1B7A5E 100%)' }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(34,166,122,0.15), transparent 70%)' }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #22A67A 0px, #22A67A 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #22A67A 0px, #22A67A 1px, transparent 1px, transparent 80px)' }} />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-28 md:pt-48 md:pb-40">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-0.5 h-12 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Ministerios<br />Un lugar para todos
            </p>
          </div>
          <h1
            className="font-display font-black leading-[0.85] tracking-tighter text-white mb-8"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            Un lugar<br />para <em style={{ color: '#22A67A' }}>todos.</em>
          </h1>
          <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Cada ministerio es una comunidad viva donde crecer en fe, servir y conectar con otros creyentes.
          </p>
        </div>
        <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
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
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B4A38 0%, #1B7A5E 60%, #22A67A 100%)' }}>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-16">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 mb-10">— Sírvenos</p>
            <h2
              className="font-display font-black leading-[0.85] tracking-tighter text-white"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
            >
              ¿Dónde<br /><em>encajas tú?</em>
            </h2>
          </div>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition flex-shrink-0 group"
          >
            Contáctanos <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  )
}
