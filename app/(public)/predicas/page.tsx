import { Play, ArrowRight, Headphones } from 'lucide-react'
import Link from 'next/link'
import { cmsGet, cmsImageUrl } from '@/lib/directus'

export const revalidate = 60

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
function fmtFecha(iso: string) {
  const d = new Date(iso)
  return `${MESES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

type DirectusPredica = {
  id: string
  title: string
  description?: string
  video_url?: string
  thumbnail?: string
  series?: string
  speaker?: string
  date?: string
  pinned?: boolean
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
  const cmsSermons = await cmsGet<DirectusPredica>('predicas', { sort: '-date', limit: '12' })

  const sermons: any[] = cmsSermons.length > 0
    ? cmsSermons.map(s => ({
        id: s.id,
        titulo: s.title,
        pastor: s.speaker ?? 'Pastor Principal',
        fecha: s.date ? fmtFecha(s.date) : '',
        serie: s.series ?? 'Serie',
        video_url: s.video_url ?? null,
        image_url: cmsImageUrl(s.thumbnail),
      }))
    : fallbackSermons

  const [featured, ...rest] = sermons
  const allSeries = Array.from(new Set(sermons.map(s => s.serie)))

  return (
    <div>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '80vh', background: '#093C5D' }}>
        <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: 'clamp(12rem, 30vw, 28rem)', opacity: 0.05, color: '#76ABAE' }}>
            PALABRA
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 70% at 90% 40%, rgba(118,171,174,0.10), transparent 65%)' }} />
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-16 md:pt-48 md:pb-20 flex flex-col justify-end"
          style={{ minHeight: '80vh' }}>
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px" style={{ background: '#76ABAE' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: 'rgba(118,171,174,0.6)' }}>
              Mensajes · Palabra de vida
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <h1 className="font-display font-black tracking-tighter text-white"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
              Crece<br />en la<br /><em style={{ color: '#76ABAE' }}>Palabra.</em>
            </h1>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: 'rgba(246,243,235,0.50)' }}>
                Escucha los mensajes de nuestra iglesia y déjate transformar por la Palabra de Dios cada semana.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2" style={{ color: 'rgba(118,171,174,0.60)' }}>
                  <Headphones size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{sermons.length}+ mensajes</span>
                </div>
                <div className="w-px h-4" style={{ background: 'rgba(118,171,174,0.20)' }} />
                <div className="flex items-center gap-2" style={{ color: 'rgba(118,171,174,0.60)' }}>
                  <span className="text-[11px] font-bold uppercase tracking-wider">{allSeries.length} series</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sermón destacado */}
      <section className="border-b border-edge bg-card">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#76ABAE' }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: '#76ABAE' }}>Mensaje reciente</p>
          </div>
          <a href={featured.video_url ?? '#'} target={featured.video_url ? '_blank' : undefined} rel="noopener noreferrer"
            className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border transition cursor-pointer" style={{ borderColor: 'rgba(118,171,174,0.20)' }}>
            <div className="lg:col-span-5 relative min-h-[260px] flex items-center justify-center overflow-hidden"
              style={{
                background: featured.image_url
                  ? `url(${featured.image_url}) center/cover`
                  : 'linear-gradient(135deg, #093C5D 0%, #76ABAE 100%)',
              }}>
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 70% 80% at 30% 60%, rgba(118,171,174,0.12), transparent 65%)' }} />
              <div className="absolute top-5 left-5 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                style={{ background: '#76ABAE', color: '#093C5D' }}>
                Esta semana
              </div>
              <div className="relative w-20 h-20 rounded-full border border-white/25 group-hover:bg-white/20 group-hover:border-white/50 flex items-center justify-center transition duration-500 group-hover:scale-110">
                <Play size={22} className="text-white ml-1.5" />
              </div>
            </div>
            <div className="lg:col-span-7 p-10 lg:p-14 transition flex flex-col justify-between gap-8 bg-muted">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: '#76ABAE' }}>{featured.serie}</p>
                <h2 className="font-display font-black tracking-tight leading-tight mb-4"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#093C5D' }}>
                  {featured.titulo}
                </h2>
                <p className="text-sm uppercase tracking-wider" style={{ color: 'rgba(9,60,93,0.55)' }}>{featured.pastor} · {featured.fecha}</p>
              </div>
              <button className="inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition self-start group/btn"
                style={{ background: '#093C5D' }}>
                <Play size={12} /> Escuchar ahora
                <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </a>
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
                    background: image_url ? `url(${image_url}) center/cover` : 'linear-gradient(135deg, #093C5D 0%, #76ABAE 100%)',
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-white/25 group-hover:bg-white/20 group-hover:border-white/50 flex items-center justify-center transition duration-300 group-hover:scale-110">
                      <Play size={14} className="text-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{serie}</span>
                </div>
                <h3 className="font-black text-ink transition text-lg leading-tight mb-2 tracking-tight">{titulo}</h3>
                <p className="text-[11px] text-ink-3 uppercase tracking-wider">{pastor} · {fecha}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #051828 0%, #093C5D 60%, #76ABAE 100%)' }}>
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
