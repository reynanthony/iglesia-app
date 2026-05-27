import Link from 'next/link'
import { ArrowRight, Play, Zap, Heart, Music2, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import BlockRenderer from '@/components/BlockRenderer'

const MESES_LARGO = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
function fmtFechaLarga(iso: string) {
  const d = new Date(iso)
  return `${d.getUTCDate()} de ${MESES_LARGO[d.getUTCMonth()]} de ${d.getUTCFullYear()}`
}
function fmtFechaCorta(iso: string) {
  const d = new Date(iso)
  return `${MESES_CORTO[d.getUTCMonth()]} ${d.getUTCDate()}`
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: pageData } = await supabase.from('page_content').select('content').eq('page', 'home').single()
  const pageContent = (pageData?.content ?? {}) as Record<string, any>

  if (Array.isArray(pageContent.blocks) && pageContent.blocks.length > 0) {
    return <BlockRenderer blocks={pageContent.blocks} />
  }

  const { data: predicasData } = await supabase.from('ministry_content')
    .select('id, title, body, video_url, pinned, created_at, profiles(full_name), ministries(name)')
    .eq('type', 'video')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  const c = pageContent

  const defaultServices = [
    { n: '01', day: 'Domingo',   time: '10:00', label: 'AM', type: 'Servicio principal' },
    { n: '02', day: 'Miércoles', time: '7:00',  label: 'PM', type: 'Estudio bíblico' },
    { n: '03', day: 'Viernes',   time: '7:00',  label: 'PM', type: 'Noche de oración' },
  ]
  const rawServices: any[] = c.services ?? defaultServices
  const services = rawServices.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }))

  const verse        = c.verse                ?? 'Vengan a mí todos los que están cansados y yo les daré descanso.'
  const verseRef     = c.verse_ref            ?? 'Mateo 11:28'
  const eventTitle   = c.featured_event_title ?? 'Retiro Anual 2026'
  const eventDesc    = c.featured_event_desc  ?? 'Junio 2026 · Un fin de semana de encuentro y renovación espiritual.'
  const heroSubtitle = c.hero_subtitle        ?? 'Una comunidad de fe viva donde encontrarás amor, propósito y una familia que te recibe como eres.'

  const predicas    = predicasData ?? []
  const featured    = predicas[0]
  const moreSermons = predicas.slice(1)
  return (
    <div>

      {/* ════════════════════════════════════════════════
          1. HERO — video/gradiente animado oscuro
      ════════════════════════════════════════════════ */}
      <section className="hero-mesh relative min-h-screen flex flex-col overflow-hidden">

        {/* Video loop opcional — configurable desde admin */}
        {(pageContent as any).hero_video_url && (
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.35 }}
          >
            <source src={(pageContent as any).hero_video_url} type="video/mp4" />
          </video>
        )}

        {/* Overlay oscuro jade */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(8,46,34,0.85) 0%, rgba(10,61,46,0.75) 60%, rgba(27,122,94,0.5) 100%)' }} />

        {/* Patrón de cuadrícula sutil */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #22A67A 0px, #22A67A 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #22A67A 0px, #22A67A 1px, transparent 1px, transparent 80px)' }} />

        {/* Número año decorativo */}
        <div className="pointer-events-none absolute right-0 bottom-0 select-none overflow-hidden" style={{ lineHeight: 1 }}>
          <span className="text-[30vw] font-black text-white opacity-[0.04] tracking-tighter leading-none block">
            2026
          </span>
        </div>

        <div className="relative flex-1 flex flex-col justify-end max-w-6xl mx-auto w-full px-6 pb-20 pt-32">

          <div className="flex items-center gap-4 mb-12 anim-up anim-d1">
            <div className="w-8 h-px bg-white/40" />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-white/50">
              Iglesia El Manantial · Comunidad de fe
            </p>
          </div>

          <h1 className="font-display font-black tracking-tighter text-white mb-14 max-w-5xl"
            style={{ fontSize: 'clamp(3.8rem, 13vw, 12rem)', lineHeight: 0.83 }}>
            <span className="block anim-up anim-d2">Donde</span>
            <span className="block anim-up anim-d3">fluye</span>
            <em className="block anim-up anim-d4" style={{ color: '#22A67A' }}>la vida.</em>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-2xl">
            <p className="text-sm text-white/60 leading-relaxed anim-up anim-d5">
              {heroSubtitle}
            </p>
            <div className="flex flex-col gap-3 anim-up anim-d5">
              <Link href="/nosotros"
                className="inline-flex items-center justify-between bg-white hover:bg-[#F2F8F5] text-[11px] font-black uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group"
                style={{ color: '#0B4A38' }}>
                Conócenos
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/predicas"
                className="inline-flex items-center justify-between border border-white/25 text-white/70 hover:text-white hover:border-white/50 text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group">
                <span className="flex items-center gap-2.5"><Play size={11} /> Ver prédica</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll marker */}
        <div className="relative h-16 flex items-center px-6">
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          2. SERVICES
      ════════════════════════════════════════════════ */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 divide-x divide-edge">
            {services.map(({ n, day, time, label, type }) => (
              <div key={n} className="px-8 first:pl-0 last:pr-0 py-6">
                <span className="text-[9px] font-black text-[#000000]/70 tracking-[0.3em] uppercase block mb-4">{n}</span>
                <div className="flex items-baseline gap-1 mb-1">
                  <p className="text-5xl font-black text-ink leading-none tracking-tight">{time}</p>
                  <p className="text-lg font-black text-ink-3">{label}</p>
                </div>
                <p className="text-[11px] font-bold text-ink-2">{type}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink-3 mt-0.5">{day}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3. EVENTO DESTACADO
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '55vh', background: 'linear-gradient(135deg, #EAF3EF 0%, #F2F8F5 50%, #F2F8F5 100%)' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, rgba(0,0,0,1) 0%, transparent 60%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col justify-end h-full"
          style={{ minHeight: '55vh' }}>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1B7A5E' }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: '#1B7A5E' }}>Próximo evento</p>
            </div>
            <h2 className="font-display font-black tracking-tighter text-[#111111] mb-4"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 0.9 }}>
              {eventTitle.split(' ').slice(0, -1).join(' ')}<br />{eventTitle.split(' ').slice(-1)}
            </h2>
            <p className="text-base text-[#111111]/50 mb-8">
              {eventDesc}
            </p>
            <Link href="/eventos"
              className="inline-flex items-center gap-3 bg-[#1B7A5E] hover:bg-[#0B4A38] text-white text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition">
              Más información <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          4. MINISTERIOS FEATURED
      ════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-3" style={{ minHeight: '520px' }}>

        {/* Tarjeta grande — 2/3 */}
        <Link href="/ministerios"
          className="group relative md:col-span-2 flex flex-col justify-end overflow-hidden"
          style={{ minHeight: '420px', background: '#0B4A38' }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-700"
            style={{ background: 'radial-gradient(ellipse 80% 80% at 25% 80%, rgba(34,166,122,0.6), transparent 60%)' }} />
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700"
            style={{ background: 'radial-gradient(circle, #22A67A, transparent 70%)' }} />
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '70px 70px' }} />

          <div className="relative p-10 md:p-14 lg:p-16">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
              <Zap size={26} className="text-white" strokeWidth={2} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-3">Ministerio de Jóvenes</p>
            <h2 className="font-display font-black text-white tracking-tighter mb-4 transition"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
              La próxima<br />generación.
            </h2>
            <p className="text-sm text-white/55 leading-relaxed mb-8 max-w-sm">
              Fe y comunidad auténtica para jóvenes que quieren vivir algo real.
            </p>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition">
              Explorar ministerio
              <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Tarjeta pequeña — 1/3 */}
        <Link href="/ministerios"
          className="group relative flex flex-col justify-end overflow-hidden"
          style={{ minHeight: '420px', background: '#1B7A5E' }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.10] group-hover:opacity-[0.20] transition-opacity duration-700"
            style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 80%, rgba(34,166,122,0.8), transparent 65%)' }} />

          <div className="relative p-8 md:p-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-7">
              <Heart size={22} className="text-white" strokeWidth={2} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 mb-2">Matrimonios</p>
            <h3 className="font-display font-black text-white tracking-tighter mb-3 transition"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 0.9 }}>
              Hogares<br />sólidos.
            </h3>
            <p className="text-xs text-white/50 leading-relaxed mb-6">
              Principios bíblicos para la familia.
            </p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition flex items-center gap-2">
              Ver <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </section>

      {/* ════════════════════════════════════════════════
          5. STATEMENT TIPOGRÁFICO
      ════════════════════════════════════════════════ */}
      <section className="bg-card border-y border-edge overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-ink-3 [writing-mode:vertical-rl] rotate-180 hidden md:block">
                {verseRef}
              </p>
            </div>
            <div className="md:col-span-11">
              <p className="font-display font-black text-ink tracking-tighter leading-[0.88]"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}>
                "{verse.split(' ').slice(0, -1).join(' ')}{' '}
                <span style={{ color: '#1B7A5E' }}>{verse.split(' ').slice(-1)}."</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mt-8 md:hidden">
                — {verseRef}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6. MENSAJES
      ════════════════════════════════════════════════ */}
      <section className="bg-muted border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">

          <div className="flex items-end justify-between mb-14 border-b border-edge pb-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-4">— Mensajes</p>
              <h2 className="font-display font-black tracking-tighter text-ink"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
                Crece en<br />la Palabra.
              </h2>
            </div>
            <Link href="/predicas"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3 hover:text-ink transition">
              Todos <ArrowRight size={12} />
            </Link>
          </div>

          {/* Sermón destacado */}
          {featured ? (
            <Link href="/predicas" className="group grid grid-cols-1 lg:grid-cols-5 border border-edge rounded-2xl overflow-hidden mb-4 hover:border-edge-2 transition">
              <div className="lg:col-span-2 relative min-h-[220px] flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0B4A38 0%, #1B7A5E 100%)' }}>
                {(featured as any).image_url && (
                  <img src={(featured as any).image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                )}
                <div className="absolute top-5 left-5 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg" style={{ background: 'rgba(34,166,122,0.85)' }}>
                  Esta semana
                </div>
                <div className="relative w-16 h-16 rounded-full border border-white/30 group-hover:bg-white/20 group-hover:border-white/60 flex items-center justify-center transition duration-300">
                  <Play size={20} className="text-white ml-1 transition" />
                </div>
              </div>
              <div className="lg:col-span-3 p-8 lg:p-10 bg-card flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: '#1B7A5E' }}>
                  {(featured as any).ministries?.name ?? 'Prédica'}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-ink tracking-tight leading-tight mb-3">
                  {(featured as any).title}
                </h3>
                <p className="text-sm text-ink-3 uppercase tracking-wider">
                  {(featured as any).profiles?.full_name ?? 'Pastor'} ·{' '}
                  {fmtFechaLarga((featured as any).created_at)}
                </p>
              </div>
            </Link>
          ) : (
            <div className="border border-edge rounded-2xl p-10 mb-4 text-center text-ink-3 text-sm">
              Aún no hay prédicas publicadas.{' '}
              <Link href="/admin/predicas/nuevo" className="font-bold text-ink hover:underline">Agregar la primera →</Link>
            </div>
          )}

          {/* Lista de sermones */}
          {moreSermons.length > 0 && (
            <div className="divide-y divide-edge border border-edge rounded-2xl overflow-hidden">
              {(moreSermons as any[]).map((p, i) => (
                <Link key={p.id} href="/predicas"
                  className="group flex items-center gap-6 px-6 py-5 bg-card hover:bg-muted transition">
                  <span className="text-[10px] font-bold text-ink-3 tracking-widest w-6 flex-shrink-0">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-edge flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B7A5E] group-hover:border-[#1B7A5E] transition duration-200">
                    <Play size={10} className="text-ink-3 group-hover:text-white ml-0.5 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink group-hover:text-[#000000] transition text-sm truncate">{p.title}</p>
                    <p className="text-[11px] text-ink-3 mt-0.5">{p.ministries?.name}</p>
                  </div>
                  <p className="text-[11px] text-ink-3 flex-shrink-0 hidden sm:block">
                    {fmtFechaCorta(p.created_at)}
                  </p>
                  <ArrowRight size={13} className="text-ink-3 flex-shrink-0 group-hover:translate-x-1 group-hover:text-ink transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          7. MINISTERIOS GRID
      ════════════════════════════════════════════════ */}
      <section style={{ background: '#0B4A38' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>— Todos los ministerios</p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
                Un lugar<br />para todos.
              </h2>
            </div>
            <Link href="/ministerios"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition"
              style={{ color: 'rgba(255,255,255,0.40)' }}>
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { n: '01', Icon: Zap,    cardBg: '#134D3F', nombre: 'Jóvenes',     desc: 'Próxima generación' },
              { n: '02', Icon: Star,   cardBg: '#1B7A5E', nombre: 'Niños',       desc: 'Fe desde pequeños' },
              { n: '03', Icon: Heart,  cardBg: '#0F5C47', nombre: 'Matrimonios', desc: 'Hogares fuertes' },
              { n: '04', Icon: Music2, cardBg: '#22A67A', nombre: 'Adoración',   desc: 'Excelencia al Señor' },
            ].map(({ n, Icon, cardBg, nombre, desc }) => (
              <Link key={n} href="/ministerios"
                className="group p-8 flex flex-col gap-5 transition hover:brightness-110"
                style={{ background: cardBg }}>
                <span className="text-[9px] font-bold tracking-widest" style={{ color: 'rgba(255,255,255,0.30)' }}>{n}</span>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition"
                  style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <Icon size={20} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg leading-tight mb-1">{nombre}</h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)' }}>{desc}</p>
                </div>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-all mt-auto" style={{ color: 'rgba(255,255,255,0.30)' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          8. CTA FINAL
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-[#111111]/[0.06]"
        style={{ background: 'linear-gradient(135deg, #0B4A38 0%, #1B7A5E 60%, #22A67A 100%)' }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 90% at 85% 50%, rgba(255,255,255,0.08), transparent 70%)' }} />
        <div className="pointer-events-none absolute left-0 bottom-0 overflow-hidden select-none">
          <span className="text-[22vw] font-black text-white opacity-[0.06] tracking-tighter leading-none block">
            VIDA
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-12">
                — Eres bienvenido
              </p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.83 }}>
                Tu historia<br />comienza<br />
                <em className="text-white/80">aquí.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-base text-white/60 leading-relaxed max-w-xs">
                No importa dónde estés ni qué hayas vivido. Hay un lugar para ti.
              </p>
              <div className="flex flex-col gap-3 mt-4">
                <Link href="/contacto"
                  className="inline-flex items-center justify-between bg-white hover:bg-[#FFFFFF] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group">
                  Visítanos este domingo
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login"
                  className="inline-flex items-center justify-between border border-white/25 text-white/70 hover:text-white hover:border-white/50 text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group">
                  Unirse a la comunidad en línea
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform opacity-50 group-hover:opacity-100" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
