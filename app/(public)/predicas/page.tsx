import { Play, ArrowRight, Headphones } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BlockRenderer from '@/components/BlockRenderer'
import PhotoSlot from '@/components/PhotoSlot'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
function fmtFecha(iso: string) {
  const d = new Date(iso)
  return `${MESES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

const fallbackSermons = [
  { id: '1', titulo: 'El poder de la oración', pastor: 'Pastor Principal', fecha: 'Mayo 18, 2025', serie: 'Vida de oración',      video_url: null, image_url: null },
  { id: '2', titulo: 'Fe que mueve montañas',  pastor: 'Pastor Principal', fecha: 'Mayo 11, 2025', serie: 'Fe viva',              video_url: null, image_url: null },
  { id: '3', titulo: 'Identidad en Cristo',    pastor: 'Pastor Principal', fecha: 'Mayo 4, 2025',  serie: 'Quiénes somos',       video_url: null, image_url: null },
  { id: '4', titulo: 'El llamado de Dios',     pastor: 'Pastor Principal', fecha: 'Abr 27, 2025',  serie: 'Propósito divino',    video_url: null, image_url: null },
  { id: '5', titulo: 'Gracia y perdón',        pastor: 'Pastor Principal', fecha: 'Abr 20, 2025',  serie: 'El corazón de Dios',  video_url: null, image_url: null },
  { id: '6', titulo: 'Viviendo en victoria',   pastor: 'Pastor Principal', fecha: 'Abr 13, 2025',  serie: 'Vida abundante',      video_url: null, image_url: null },
]

export default async function PredicasPage() {
  const supabase = await createClient()

  // Fetch editorial blocks and sermon data in parallel
  const [pageResult, sermonsResult] = await Promise.all([
    supabase.from('page_content').select('content').eq('page', 'predicas').single(),
    supabase.from('ministry_content')
      .select('id, title, body, video_url, image_url, created_at, profiles(full_name), ministries(name)')
      .eq('type', 'video')
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const editorialBlocks = (pageResult.data?.content as any)?.blocks
  const hasBlocks = Array.isArray(editorialBlocks) && editorialBlocks.length > 0

  const dbSermons = sermonsResult.data
  const sermons: any[] = dbSermons && dbSermons.length > 0
    ? dbSermons.map(s => ({
        id: s.id,
        titulo: s.title,
        pastor: (s.profiles as any)?.full_name ?? 'Pastor Principal',
        fecha: fmtFecha(s.created_at),
        serie: (s.ministries as any)?.name ?? 'Serie',
        video_url: s.video_url,
        image_url: s.image_url,
      }))
    : fallbackSermons

  const [featured, ...rest] = sermons
  const allSeries = Array.from(new Set(sermons.map(s => s.serie)))

  return (
    <div>

      {/* ═══════════════════════════════════════
          ZONA EDITORIAL — bloques del admin, o hero hardcoded
      ═══════════════════════════════════════ */}
      {hasBlocks ? (
        <BlockRenderer blocks={editorialBlocks} />
      ) : (
        <section className="relative overflow-hidden" style={{ minHeight: '80vh', background: 'linear-gradient(160deg, #0A0A0A 0%, #111111 60%, #1A1A1A 100%)' }}>
          <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none">
            <span className="font-black text-[#F5F5F5] leading-none tracking-tighter whitespace-nowrap"
              style={{ fontSize: 'clamp(12rem, 30vw, 28rem)', opacity: 0.04 }}>
              PALABRA
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 50% 70% at 90% 40%, rgba(201,169,110,0.06), transparent 65%)' }} />
          <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-16 md:pt-48 md:pb-20 flex flex-col justify-end"
            style={{ minHeight: '80vh' }}>
            <div className="flex items-center gap-5 mb-14">
              <div className="w-12 h-px bg-[#C9A96E]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#F5F5F5]/40">
                Mensajes · Palabra de vida
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
              <h1 className="font-display font-black tracking-tighter text-[#F5F5F5]"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
                Crece<br />en la<br />
                <em style={{ color: '#C9A96E' }}>Palabra.</em>
              </h1>
              <div>
                <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: 'rgba(245,245,245,0.5)' }}>
                  Escucha los mensajes de nuestra iglesia y déjate transformar por la Palabra de Dios cada semana.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2" style={{ color: 'rgba(245,245,245,0.35)' }}>
                    <Headphones size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{sermons.length}+ mensajes</span>
                  </div>
                  <div className="w-px h-4" style={{ background: 'rgba(245,245,245,0.08)' }} />
                  <div className="flex items-center gap-2" style={{ color: 'rgba(245,245,245,0.35)' }}>
                    <span className="text-[11px] font-bold uppercase tracking-wider">{allSeries.length} series</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          ZONA DE DATOS — siempre visible
      ═══════════════════════════════════════ */}

      {/* Sermón destacado */}
      <section className="bg-[#F4F4F4] border-b border-[#111111]/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A96E' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#111111]/45">Mensaje reciente</p>
          </div>
          <div className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-[#111111]/10 hover:border-[#111111]/15 transition cursor-pointer">
            <div className="lg:col-span-5 relative min-h-[260px] flex items-center justify-center overflow-hidden"
              style={{
                background: featured.image_url
                  ? `url(${featured.image_url}) center/cover`
                  : '#EDE8DF',
              }}>
              {!featured.image_url && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#C9A96E' }} />
                </div>
              )}
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 70% 80% at 30% 60%, rgba(0,0,0,0.06), transparent 65%)' }} />
              <div className="absolute top-5 left-5 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                style={{ background: '#C9A96E', color: '#0A0A0A' }}>
                Esta semana
              </div>
              <div className="relative w-20 h-20 rounded-full border border-[#111111]/15 group-hover:bg-[#000000] group-hover:border-[#000000] flex items-center justify-center transition duration-500 group-hover:scale-110">
                <Play size={22} className="text-[#111111] group-hover:text-white ml-1.5" />
              </div>
            </div>
            <div className="lg:col-span-7 p-10 lg:p-14 bg-[#EBEBEB] group-hover:bg-[#E0E0E0] transition flex flex-col justify-between gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#000000]/80 mb-4">{featured.serie}</p>
                <h2 className="font-display font-black text-[#111111] tracking-tight leading-tight mb-4"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                  {featured.titulo}
                </h2>
                <p className="text-sm text-[#111111]/50 uppercase tracking-wider">{featured.pastor} · {featured.fecha}</p>
              </div>
              <button className="inline-flex items-center gap-3 bg-[#000000] hover:bg-[#222222] text-white text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition self-start group/btn">
                <Play size={12} /> Escuchar ahora
                <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtro de series */}
      <section className="bg-card border-b border-edge sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 py-0">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none -mx-6 px-6">
            <button className="flex-shrink-0 text-[11px] font-black uppercase tracking-wider text-ink border-b-2 border-ink py-4 pr-6 transition whitespace-nowrap">
              Todos
            </button>
            {allSeries.map(s => (
              <button key={s}
                className="flex-shrink-0 text-[11px] font-bold uppercase tracking-wider text-ink-3 hover:text-ink border-b-2 border-transparent hover:border-ink py-4 px-6 transition whitespace-nowrap">
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grilla de mensajes */}
      <section className="bg-muted border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12 border-b border-edge pb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">— Mensajes anteriores</p>
            <p className="text-[11px] font-bold text-ink-3">{rest.length} mensajes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rest.map(({ id, titulo, pastor, fecha, serie, image_url, video_url }) => (
              <Link key={id} href={video_url ?? '#'} className="group block">
                <div className="relative rounded-xl overflow-hidden mb-5"
                  style={{
                    aspectRatio: '16/10',
                    background: image_url ? `url(${image_url}) center/cover` : 'linear-gradient(135deg, #EBEBEB 0%, #E0E0E0 100%)',
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/8 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-[#111111]/20 group-hover:bg-[#000000] group-hover:border-[#000000] flex items-center justify-center transition duration-300 group-hover:scale-110">
                      <Play size={14} className="text-[#000000] group-hover:text-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#000000]/70">{serie}</span>
                </div>
                <h3 className="font-black text-ink group-hover:text-[#222222] transition text-lg leading-tight mb-2 tracking-tight">{titulo}</h3>
                <p className="text-[11px] text-ink-3 uppercase tracking-wider">{pastor} · {fecha}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #222222 100%)' }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 80% 50%, rgba(0,0,0,0.07), transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 mb-10">— Comunidad</p>
            <h2 className="font-display font-black leading-[0.85] tracking-tighter text-white"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              ¿Listo<br />para más?
            </h2>
          </div>
          <Link href="/login"
            className="inline-flex items-center gap-3 bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl transition flex-shrink-0">
            Unirte a la comunidad <ArrowRight size={13} />
          </Link>
        </div>
      </section>

    </div>
  )
}
