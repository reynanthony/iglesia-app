import Link from 'next/link'
import { ArrowRight, Play, Zap, Heart, Music2, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const [{ data: pageData }, { data: predicasData }] = await Promise.all([
    supabase.from('page_content').select('content').eq('page', 'home').single(),
    supabase.from('ministry_content')
      .select('id, title, body, video_url, pinned, created_at, profiles(full_name), ministries(name)')
      .eq('type', 'video')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const c = (pageData?.content ?? {}) as Record<string, any>

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
          1. HERO
      ════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #EBEBEB 0%, #F4F4F4 40%, #FFFFFF 100%)' }}>

        {/* Glow suave */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 60% 90%, rgba(0,0,0,0.12) 0%, transparent 70%)' }} />

        {/* Líneas verticales sutiles */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #000000 0px, #000000 1px, transparent 1px, transparent 100px)' }} />

        {/* Número año decorativo */}
        <div className="pointer-events-none absolute right-0 bottom-0 select-none overflow-hidden" style={{ lineHeight: 1 }}>
          <span className="text-[28vw] font-black text-[#111111] opacity-[0.03] tracking-tighter leading-none block">
            2026
          </span>
        </div>

        <div className="relative flex-1 flex flex-col justify-end max-w-6xl mx-auto w-full px-6 pb-20 pt-32">

          <div className="flex items-center gap-4 mb-12 anim-up anim-d1">
            <div className="w-8 h-px bg-[#000000]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#111111]/40">
              Iglesia El Manantial · Comunidad de fe
            </p>
          </div>

          <h1 className="font-display font-black tracking-tighter text-[#111111] mb-14 max-w-5xl"
            style={{ fontSize: 'clamp(3.8rem, 13vw, 12rem)', lineHeight: 0.83 }}>
            <span className="block anim-up anim-d2">Donde</span>
            <span className="block anim-up anim-d3">fluye</span>
            <em className="text-[#000000] block anim-up anim-d4">la vida.</em>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-2xl">
            <p className="text-sm text-[#111111]/55 leading-relaxed anim-up anim-d5">
              {heroSubtitle}
            </p>
            <div className="flex flex-col gap-3 anim-up anim-d5">
              <Link href="/nosotros"
                className="inline-flex items-center justify-between bg-[#000000] hover:bg-[#222222] text-white text-[11px] font-black uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group">
                Conócenos
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/predicas"
                className="inline-flex items-center justify-between border border-[#111111]/15 text-[#111111]/50 hover:text-[#111111] hover:border-[#111111]/30 text-[11px] font-bold uppercase tracking-[0.2em] px-6 py-4 rounded-xl transition group">
                <span className="flex items-center gap-2.5"><Play size={11} /> Ver prédica</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll marker */}
        <div className="relative h-16 flex items-center px-6">
          <div className="w-px h-10 bg-gradient-to-b from-[#000000]/30 to-transparent" />
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
      <section className="relative overflow-hidden" style={{ minHeight: '55vh', background: 'linear-gradient(135deg, #E0E0E0 0%, #EBEBEB 50%, #EBEBEB 100%)' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, rgba(0,0,0,1) 0%, transparent 60%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col justify-end h-full"
          style={{ minHeight: '55vh' }}>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#000000]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#000000]">Próximo evento</p>
            </div>
            <h2 className="font-display font-black tracking-tighter text-[#111111] mb-4"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 0.9 }}>
              {eventTitle.split(' ').slice(0, -1).join(' ')}<br />{eventTitle.split(' ').slice(-1)}
            </h2>
            <p className="text-base text-[#111111]/50 mb-8">
              {eventDesc}
            </p>
            <Link href="/eventos"
              className="inline-flex items-center gap-3 bg-[#000000] hover:bg-[#222222] text-white text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition">
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
          style={{ minHeight: '420px', background: '#F4F4F4' }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.15] group-hover:opacity-[0.28] transition-opacity duration-700"
            style={{ background: 'radial-gradient(ellipse 80% 80% at 25% 80%, #000000, transparent 60%)' }} />
          <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-700"
            style={{ background: 'radial-gradient(circle, #000000, transparent 70%)' }} />
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(17,17,17,1) 1px,transparent 1px),linear-gradient(90deg,rgba(17,17,17,1) 1px,transparent 1px)', backgroundSize: '70px 70px' }} />

          <div className="relative p-10 md:p-14 lg:p-16">
            <div className="w-14 h-14 rounded-2xl bg-[#000000]/12 flex items-center justify-center mb-8">
              <Zap size={26} className="text-[#000000]" strokeWidth={2} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#111111]/40 mb-3">Ministerio de Jóvenes</p>
            <h2 className="font-display font-black text-[#111111] tracking-tighter mb-4 group-hover:text-[#000000] transition"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
              La próxima<br />generación.
            </h2>
            <p className="text-sm text-[#111111]/50 leading-relaxed mb-8 max-w-sm">
              Fe y comunidad auténtica para jóvenes que quieren vivir algo real.
            </p>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/40 group-hover:text-[#000000] transition">
              Explorar ministerio
              <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Tarjeta pequeña — 1/3 */}
        <Link href="/ministerios"
          className="group relative flex flex-col justify-end overflow-hidden"
          style={{ minHeight: '420px', background: '#F4F4F4' }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-700"
            style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 80%, #000000, transparent 65%)' }} />

          <div className="relative p-8 md:p-10">
            <div className="w-12 h-12 rounded-2xl bg-[#000000]/12 flex items-center justify-center mb-7">
              <Heart size={22} className="text-[#000000]" strokeWidth={2} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#111111]/35 mb-2">Matrimonios</p>
            <h3 className="font-display font-black text-[#111111] tracking-tighter mb-3 group-hover:text-[#000000] transition"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 0.9 }}>
              Hogares<br />sólidos.
            </h3>
            <p className="text-xs text-[#111111]/45 leading-relaxed mb-6">
              Principios bíblicos para la familia.
            </p>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]/35 group-hover:text-[#000000] transition flex items-center gap-2">
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
                <span className="text-[#000000]">{verse.split(' ').slice(-1)}."</span>
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
                style={{ background: 'linear-gradient(135deg, #E0E0E0 0%, #EBEBEB 100%)' }}>
                {(featured as any).image_url && (
                  <img src={(featured as any).image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute top-5 left-5 bg-[#000000] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                  Esta semana
                </div>
                <div className="relative w-16 h-16 rounded-full border border-[#000000]/30 group-hover:bg-[#000000] group-hover:border-[#000000] flex items-center justify-center transition duration-300">
                  <Play size={20} className="text-[#000000] group-hover:text-white ml-1 transition" />
                </div>
              </div>
              <div className="lg:col-span-3 p-8 lg:p-10 bg-card flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#000000] mb-3">
                  {(featured as any).ministries?.name ?? 'Prédica'}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-ink tracking-tight leading-tight mb-3">
                  {(featured as any).title}
                </h3>
                <p className="text-sm text-ink-3 uppercase tracking-wider">
                  {(featured as any).profiles?.full_name ?? 'Pastor'} ·{' '}
                  {new Date((featured as any).created_at).toLocaleDateString('es-DO', { month: 'long', day: 'numeric', year: 'numeric' })}
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
                  <div className="w-8 h-8 rounded-full border border-edge flex items-center justify-center flex-shrink-0 group-hover:bg-[#000000] group-hover:border-[#000000] transition duration-200">
                    <Play size={10} className="text-ink-3 group-hover:text-white ml-0.5 transition" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink group-hover:text-[#000000] transition text-sm truncate">{p.title}</p>
                    <p className="text-[11px] text-ink-3 mt-0.5">{p.ministries?.name}</p>
                  </div>
                  <p className="text-[11px] text-ink-3 flex-shrink-0 hidden sm:block">
                    {new Date(p.created_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric' })}
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
      <section className="bg-[#F4F4F4]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 border-b border-[#111111]/[0.08] pb-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#111111]/35 mb-4">— Todos los ministerios</p>
              <h2 className="font-display font-black tracking-tighter text-[#111111]"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
                Un lugar<br />para todos.
              </h2>
            </div>
            <Link href="/ministerios"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/40 hover:text-[#000000] transition">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#111111]/[0.06] rounded-2xl overflow-hidden border border-[#111111]/[0.06]">
            {[
              { n: '01', Icon: Zap,    color: '#000000', bg: 'rgba(0,0,0,0.10)', nombre: 'Jóvenes',     desc: 'Próxima generación' },
              { n: '02', Icon: Star,   color: '#000000', bg: 'rgba(0,0,0,0.10)', nombre: 'Niños',       desc: 'Fe desde pequeños' },
              { n: '03', Icon: Heart,  color: '#000000', bg: 'rgba(0,0,0,0.10)', nombre: 'Matrimonios', desc: 'Hogares fuertes' },
              { n: '04', Icon: Music2, color: '#000000', bg: 'rgba(0,0,0,0.10)', nombre: 'Adoración',   desc: 'Excelencia al Señor' },
            ].map(({ n, Icon, color, bg, nombre, desc }) => (
              <Link key={n} href="/ministerios"
                className="group p-8 bg-[#F4F4F4] hover:bg-[#EBEBEB] transition flex flex-col gap-5">
                <span className="text-[9px] font-bold text-[#111111]/25 tracking-widest">{n}</span>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition"
                  style={{ background: bg }}>
                  <Icon size={20} style={{ color }} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-black text-[#111111] text-lg leading-tight mb-1 group-hover:text-[#000000] transition">{nombre}</h3>
                  <p className="text-[11px] text-[#111111]/45 leading-relaxed">{desc}</p>
                </div>
                <ArrowRight size={13} className="text-[#111111]/25 group-hover:text-[#000000] group-hover:translate-x-1 transition-all mt-auto" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          8. CTA FINAL
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-[#111111]/[0.06]"
        style={{ background: 'linear-gradient(135deg, #000000 0%, #222222 50%, #3A6A8F 100%)' }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 90% at 85% 50%, rgba(255,255,255,0.08), transparent 70%)' }} />
        <div className="pointer-events-none absolute left-0 bottom-0 overflow-hidden select-none">
          <span className="text-[22vw] font-black text-white opacity-[0.06] tracking-tighter leading-none block">
            FE
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
