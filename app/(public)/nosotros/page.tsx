import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import BlockRenderer from '@/components/BlockRenderer'

const beliefs = [
  { n: '01', title: 'La Biblia',    desc: 'La Palabra inspirada de Dios, autoridad final para la fe y la práctica cristiana.' },
  { n: '02', title: 'La salvación', desc: 'Por gracia mediante la fe en Jesucristo, no por obras humanas.' },
  { n: '03', title: 'La iglesia',   desc: 'El cuerpo de Cristo, llamada a servir, adorar y hacer discípulos en toda la tierra.' },
  { n: '04', title: 'La misión',    desc: 'Cada creyente llamado a llevar el mensaje de salvación a su comunidad y al mundo.' },
]

export default async function NosotrosPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('page_content').select('content').eq('page', 'nosotros').single()
  const content = (data?.content ?? {}) as Record<string, any>
  if (Array.isArray(content.blocks) && content.blocks.length > 0) {
    return <BlockRenderer blocks={content.blocks} />
  }
  const c = content as Record<string, string>

  const stats = [
    { value: c.stat_year        || '2008', label: 'Fundados' },
    { value: c.stat_families    || '500+', label: 'Familias' },
    { value: c.stat_generations || '3',    label: 'Generaciones' },
    { value: c.stat_ministries  || '12+',  label: 'Ministerios' },
  ]

  const heroBody = c.hero_body || 'Nacimos de un sueño: ver una comunidad donde el amor de Dios fluyera libremente, como agua viva que transforma vidas.'
  return (
    <div>

      {/* ═══════════════════════════════════════
          HERO — split asimétrico: texto + año
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-end" style={{ background: 'linear-gradient(160deg, #EBEBEB 0%, #F4F4F4 50%, #FFFFFF 100%)' }}>

        {/* Año fundación — número decorativo derecha */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-end overflow-hidden select-none">
          <span className="font-black text-[#111111] leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(18rem, 40vw, 38rem)', opacity: 0.04, lineHeight: 1, paddingRight: '1rem' }}>
            08
          </span>
        </div>

        {/* Glow izquierda */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 70% at 10% 60%, rgba(0,0,0,0.07), transparent 65%)' }} />

        <div className="relative max-w-6xl mx-auto w-full px-6 pb-0 pt-32 md:pt-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end pb-20">
            {/* Texto */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-5 mb-14">
                <div className="w-12 h-px bg-[#000000]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#111111]/40">
                  Quiénes somos · Desde 2008
                </p>
              </div>
              <h1 className="font-display font-black tracking-tighter text-[#111111] mb-8"
                style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)', lineHeight: 0.85 }}>
                Somos<br />El Manan-<br />
                <em style={{ color: '#1B7A5E' }}>tial.</em>
              </h1>
              <p className="text-base text-[#111111]/50 leading-relaxed max-w-lg mt-10">
                {heroBody}
              </p>
            </div>

            {/* Fotografía de comunidad */}
            <div className="hidden lg:block lg:col-span-5 pb-4">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ aspectRatio: '4/5', background: '#E8E0D4' }}
              >
                {/* Placeholder hasta que haya foto real */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8"
                  style={{ color: '#A89878' }}>
                  <Users size={36} strokeWidth={1.2} />
                  <p className="text-sm font-bold tracking-wide leading-snug">
                    Fotografía de la comunidad
                  </p>
                  <p className="text-xs opacity-60">
                    Agrégala en Admin → Página Nosotros
                  </p>
                </div>
                {/* Accent line inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: '#1B7A5E' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-[#111111]/[0.08]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#111111]/[0.08]">
              {stats.map(({ value, label }) => (
                <div key={label} className="px-8 py-7 first:pl-0">
                  <p className="font-black text-[#111111] tracking-tighter leading-none mb-1"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#111111]/45">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HISTORIA — editorial + foto collage
      ═══════════════════════════════════════ */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-36">

          {/* Pullquote editorial */}
          <div className="border-l-2 border-[#000000] pl-8 mb-20 max-w-3xl">
            <p className="font-display font-black text-ink tracking-tight leading-snug"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)' }}>
              "No somos un edificio. Somos una familia que se reúne, crece y sirve juntos."
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mt-6">
              — Fundadores de El Manantial
            </p>
          </div>

          {/* Foto collage placeholder 3 paneles */}
          <div className="grid grid-cols-12 gap-4 mb-20">
            <div className="col-span-7 rounded-2xl overflow-hidden bg-[#EBEBEB]" style={{ minHeight: 320 }}>
              <div className="w-full h-full flex items-center justify-center text-[#111111]/20 text-[10px] uppercase tracking-widest font-bold" style={{ minHeight: 320 }}>
                Foto comunidad
              </div>
            </div>
            <div className="col-span-5 grid grid-rows-2 gap-4">
              <div className="rounded-2xl overflow-hidden bg-[#F4F4F4]" style={{ minHeight: 152 }}>
                <div className="w-full h-full flex items-center justify-center text-[#111111]/20 text-[10px] uppercase tracking-widest font-bold" style={{ minHeight: 152 }}>
                  Foto servicio
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden bg-[#EBEBEB]" style={{ minHeight: 152 }}>
                <div className="w-full h-full flex items-center justify-center text-[#111111]/20 text-[10px] uppercase tracking-widest font-bold" style={{ minHeight: 152 }}>
                  Foto jóvenes
                </div>
              </div>
            </div>
          </div>

          {/* Texto historia 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl">
            <div className="space-y-5 text-base text-ink-2 leading-relaxed">
              <p>
                Iglesia El Manantial nació en 2008 de un grupo de creyentes que soñaban con una comunidad donde el amor de Dios se viviera de manera auténtica y transformadora.
              </p>
              <p>
                A lo largo de los años hemos crecido como familia, viendo milagros, restauraciones y cientos de vidas transformadas por el poder del evangelio.
              </p>
            </div>
            <div className="space-y-5 text-base text-ink-2 leading-relaxed">
              <p>
                Hoy somos una iglesia vibrante, con ministerios para todas las edades y un corazón apasionado por servir a nuestra comunidad.
              </p>
              <p>
                Creemos que cada persona que entra a El Manantial encuentra más que una congregación: encuentra un hogar espiritual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VISIÓN + MISIÓN — tipografía grande
      ═══════════════════════════════════════ */}
      <section className="bg-muted border-b border-edge overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-36">

          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink-3 mb-16">— Lo que nos mueve</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-edge rounded-2xl overflow-hidden border border-edge">

            <div className="bg-muted p-12 md:p-16 hover:bg-card transition">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#000000]/70 mb-6">Visión</p>
              <p className="font-display font-black text-ink tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
                Ser una iglesia que impacte nuestra ciudad y nación.
              </p>
            </div>

            <div className="bg-muted p-12 md:p-16 hover:bg-card transition border-t md:border-t-0 md:border-l border-edge">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#000000]/70 mb-6">Misión</p>
              <p className="font-display font-black text-ink tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
                Hacer discípulos que lleven el amor de Cristo a toda la tierra.
              </p>
            </div>

          </div>

          {/* Valores — fila con números */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-edge border border-edge rounded-2xl overflow-hidden">
            {['Fe', 'Amor', 'Integridad', 'Servicio', 'Comunidad'].map((v, i) => (
              <div key={v} className="bg-card px-7 py-6 hover:bg-muted transition flex flex-col gap-2">
                <span className="text-[9px] font-bold text-ink-3 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-black text-ink text-lg">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LO QUE CREEMOS — lista numerada
      ═══════════════════════════════════════ */}
      <section className="bg-card border-b border-edge">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 border-b border-edge pb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3">— Fundamentos de fe</p>
          </div>

          <div className="space-y-px bg-edge rounded-2xl overflow-hidden border border-edge">
            {beliefs.map(({ n, title, desc }) => (
              <div key={n} className="bg-card hover:bg-muted transition p-8 md:p-10 flex gap-8 md:gap-14 items-start group">
                <span className="text-[10px] font-bold text-ink-3 tracking-widest flex-shrink-0 mt-1">{n}</span>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-black text-ink tracking-tight mb-3 group-hover:text-[#222222] transition">{title}</h3>
                  <p className="text-sm text-ink-2 leading-relaxed max-w-xl">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — con "FAMILIA" decorativo
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0B4A38 0%, #1B7A5E 60%, #22A67A 100%)' }}>
        {/* Texto decorativo */}
        <div className="pointer-events-none absolute left-0 bottom-0 overflow-hidden select-none">
          <span className="font-black text-white leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(10rem, 30vw, 28rem)', opacity: 0.04, lineHeight: 0.85 }}>
            FAMILIA
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 20% 50%, rgba(0,0,0,0.06), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-12">— Únete a nosotros</p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', lineHeight: 0.85 }}>
                Eres parte<br />de esta<br />
                <em className="text-[#EBEBEB]">historia.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/contacto"
                className="inline-flex items-center justify-between bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group">
                Visítanos este domingo
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login"
                className="inline-flex items-center justify-between border border-white/10 text-white/40 hover:text-white hover:border-white/25 text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group">
                Comunidad en línea
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
