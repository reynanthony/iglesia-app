import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import BlockRenderer from '@/components/BlockRenderer'
import { HeroVideo } from '@/components/public/HeroVideo'

type Leader = { id: string; name: string; title: string; bio: string | null; avatar_url: string | null; category: string }

export const dynamic = 'force-dynamic'

const defaultBeliefs = [
  { n: '01', title: 'La Biblia',    desc: 'La Palabra inspirada de Dios, autoridad final para la fe y la práctica cristiana.' },
  { n: '02', title: 'La salvación', desc: 'Por gracia mediante la fe en Jesucristo, no por obras humanas.' },
  { n: '03', title: 'La iglesia',   desc: 'El cuerpo de Cristo, llamada a servir, adorar y hacer discípulos en toda la tierra.' },
  { n: '04', title: 'La misión',    desc: 'Cada creyente llamado a llevar el mensaje de salvación a su comunidad y al mundo.' },
]

export default async function NosotrosPage() {
  const supabase = await createClient()
  const [{ data }, { data: leadersData }] = await Promise.all([
    supabase.from('page_content').select('content').eq('page', 'nosotros').single(),
    supabase.from('church_leaders').select('id,name,title,bio,avatar_url,category').eq('is_public', true).order('order_index'),
  ])
  const leaders: Leader[] = leadersData ?? []
  const pastoral   = leaders.filter(l => l.category === 'pastoral')
  const ministerio = leaders.filter(l => l.category === 'ministerio')
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

  const heroBody        = c.hero_body        || 'Nacimos de un sueño: ver una comunidad donde el amor de Dios fluyera libremente, como agua viva que transforma vidas.'
  const heroEyebrow     = c.hero_eyebrow     || 'Quiénes somos · Desde 2008'
  const heroTitleMain   = c.hero_title_main   || 'Somos\nEl Manan-'
  const heroTitleAccent = c.hero_title_accent || 'tial.'
  const heroImageUrl    = c.hero_image_url    || null
  const heroVideoUrl    = c.hero_video_url    || null

  // New CMS fields
  const pullquote       = c.pullquote        || 'No somos un edificio. Somos una familia que se reúne, crece y sirve juntos.'
  const pullquoteAuthor = c.pullquote_author  || '— Fundadores de El Manantial'
  const historiaP1      = c.historia_p1      || 'Iglesia El Manantial nació en 2008 de un grupo de creyentes que soñaban con una comunidad donde el amor de Dios se viviera de manera auténtica y transformadora.'
  const historiaP2      = c.historia_p2      || 'A lo largo de los años hemos crecido como familia, viendo milagros, restauraciones y cientos de vidas transformadas por el poder del evangelio.'
  const historiaP3      = c.historia_p3      || 'Hoy somos una iglesia vibrante, con ministerios para todas las edades y un corazón apasionado por servir a nuestra comunidad.'
  const historiaP4      = c.historia_p4      || 'Creemos que cada persona que entra a El Manantial encuentra más que una congregación: encuentra un hogar espiritual.'
  const visionText      = c.vision_text      || 'Ser una iglesia que impacte nuestra ciudad y nación.'
  const misionText      = c.mision_text      || 'Hacer discípulos que lleven el amor de Cristo a toda la tierra.'
  const valores         = (c.valores_list || 'Fe,Amor,Integridad,Servicio,Comunidad').split(',').map((v: string) => v.trim())
  const beliefs: { n: string; title: string; desc: string }[] = Array.isArray((content as Record<string, any>).beliefs_json) ? (content as Record<string, any>).beliefs_json : defaultBeliefs
  const nosCta_eyebrow  = c.nos_cta_eyebrow  || '— Únete a nosotros'
  const nosCta_title    = c.nos_cta_title    || 'Eres parte\nde esta\nhistoria.'
  const nosCta1_label   = c.nos_cta1_label   || 'Visítanos este domingo'
  const nosCta1_url     = c.nos_cta1_url     || '/contacto'
  const nosCta2_label   = c.nos_cta2_label   || 'Comunidad en línea'
  const nosCta2_url     = c.nos_cta2_url     || '/login'

  return (
    <div>

      {/* ═══════════════════════════════════════
          HERO — navy oscuro con tipografía cream
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-end" style={{ background: '#093C5D' }}>

        {/* Imagen de fondo opcional */}
        {heroImageUrl && !heroVideoUrl && (
          <img src={heroImageUrl} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.65 }} />
        )}
        {/* Video de fondo opcional */}
        {heroVideoUrl && <HeroVideo url={heroVideoUrl} />}

        {/* Overlay navy */}
        {(heroImageUrl || heroVideoUrl) && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(9,60,93,0.45) 0%, rgba(9,60,93,0.30) 60%, rgba(9,60,93,0.15) 100%)' }} />
        )}

        {/* Grid sutil */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, #76ABAE 0px, #76ABAE 1px, transparent 1px, transparent 90px)' }} />

        {/* Año fundación decorativo */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-end overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(18rem, 40vw, 38rem)', opacity: 0.06, lineHeight: 1, paddingRight: '1rem', color: '#76ABAE' }}>
            08
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto w-full px-6 pb-0 pt-32 md:pt-40">
          <div className="pb-20">
            {/* Texto */}
            <div className="max-w-3xl">
              <div className="flex items-center gap-5 mb-14">
                <div className="w-12 h-px" style={{ background: '#76ABAE' }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: 'rgba(118,171,174,0.7)' }}>
                  {heroEyebrow}
                </p>
              </div>
              <h1 className="font-display font-black tracking-tighter text-white mb-8"
                style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)', lineHeight: 0.85 }}>
                {heroTitleMain.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
                <br /><em style={{ color: '#76ABAE' }}>{heroTitleAccent}</em>
              </h1>
              <p className="text-base leading-relaxed max-w-lg mt-10" style={{ color: 'rgba(246,243,235,0.55)' }}>
                {heroBody}
              </p>
            </div>

          </div>
        </div>

        {/* Stats strip */}
        <div className="relative" style={{ borderTop: '1px solid rgba(118,171,174,0.2)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map(({ value, label }) => (
                <div key={label} className="px-8 py-7 first:pl-0" style={{ borderRight: '1px solid rgba(118,171,174,0.15)' }}>
                  <p className="font-black tracking-tighter leading-none mb-1"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#76ABAE' }}>{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(246,243,235,0.45)' }}>{label}</p>
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
          <div className="border-l-2 pl-8 mb-20 max-w-3xl" style={{ borderColor: '#76ABAE' }}>
            <p className="font-display font-black text-ink tracking-tight leading-snug"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)' }}>
              "{pullquote}"
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mt-6">
              {pullquoteAuthor}
            </p>
          </div>

          {/* Texto historia 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl">
            <div className="space-y-5 text-base text-ink-2 leading-relaxed">
              <p>{historiaP1}</p>
              <p>{historiaP2}</p>
            </div>
            <div className="space-y-5 text-base text-ink-2 leading-relaxed">
              <p>{historiaP3}</p>
              <p>{historiaP4}</p>
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
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-6">Visión</p>
              <p className="font-display font-black text-ink tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
                {visionText}
              </p>
            </div>

            <div className="bg-muted p-12 md:p-16 hover:bg-card transition border-t md:border-t-0 md:border-l border-edge">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-6">Misión</p>
              <p className="font-display font-black text-ink tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
                {misionText}
              </p>
            </div>

          </div>

          {/* Valores — fila con números */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-edge border border-edge rounded-2xl overflow-hidden">
            {valores.map((v, i) => (
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
                  <h3 className="text-xl md:text-2xl font-black text-ink tracking-tight mb-3 transition">{title}</h3>
                  <p className="text-sm text-ink-2 leading-relaxed max-w-xl">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          EQUIPO PASTORAL
      ═══════════════════════════════════════ */}
      {leaders.length > 0 && (
        <section className="bg-card border-b border-edge">
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">

            <div className="flex items-end justify-between mb-14 border-b border-edge pb-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-4">— Nuestro equipo</p>
                <h2 className="font-display font-black tracking-tighter text-ink"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
                  Quienes te<br /><em style={{ color: '#76ABAE' }}>acompañan.</em>
                </h2>
              </div>
            </div>

            {/* Pastores / liderazgo general */}
            {pastoral.length > 0 && (
              <div className="mb-16">
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-8">Liderazgo pastoral</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastoral.map((l, i) => (
                    <div key={l.id}
                      className="group relative flex flex-col gap-5 p-8 rounded-2xl border border-edge hover:border-[rgba(118,171,174,0.40)] transition"
                      style={{ background: i === 0 ? '#093C5D' : undefined }}>
                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
                          style={{ background: i === 0 ? 'rgba(118,171,174,0.20)' : 'rgba(9,60,93,0.10)', border: `1px solid ${i === 0 ? 'rgba(118,171,174,0.30)' : 'rgba(9,60,93,0.15)'}` }}>
                          {l.avatar_url
                            ? <img src={l.avatar_url} alt={l.name} className="w-full h-full object-cover" />
                            : <span className="font-black text-2xl" style={{ color: i === 0 ? '#76ABAE' : '#093C5D' }}>
                                {l.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                              </span>
                          }
                        </div>
                        <div>
                          <p className="font-black text-base leading-tight" style={{ color: i === 0 ? '#F6F3EB' : undefined }}>
                            {l.name}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mt-0.5" style={{ color: '#76ABAE' }}>
                            {l.title}
                          </p>
                        </div>
                      </div>
                      {/* Bio */}
                      {l.bio && (
                        <p className="text-sm leading-relaxed" style={{ color: i === 0 ? 'rgba(246,243,235,0.60)' : 'rgba(9,60,93,0.60)' }}>
                          {l.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Líderes de ministerios */}
            {ministerio.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-ink-3 mb-8">Líderes de ministerios</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ministerio.map(l => (
                    <div key={l.id}
                      className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-edge hover:bg-muted transition">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
                        style={{ background: 'rgba(9,60,93,0.10)', border: '2px solid rgba(118,171,174,0.25)' }}>
                        {l.avatar_url
                          ? <img src={l.avatar_url} alt={l.name} className="w-full h-full object-cover" />
                          : <span className="font-black text-2xl" style={{ color: '#093C5D' }}>
                              {l.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                            </span>
                        }
                      </div>
                      <div>
                        <p className="font-black text-sm leading-tight text-ink">{l.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: '#76ABAE' }}>
                          {l.title}
                        </p>
                      </div>
                      {l.bio && (
                        <p className="text-[11px] text-ink-3 leading-relaxed line-clamp-3">{l.bio}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          CTA — con "FAMILIA" decorativo
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #051828 0%, #093C5D 60%, #76ABAE 100%)' }}>
        {/* Texto decorativo */}
        <div className="pointer-events-none absolute left-0 bottom-0 overflow-hidden select-none">
          <span className="font-black text-white leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(10rem, 30vw, 28rem)', opacity: 0.04, lineHeight: 0.85 }}>
            FAMILIA
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 20% 50%, rgba(0, 0, 0, 0.35), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-12">{nosCta_eyebrow}</p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', lineHeight: 0.85 }}>
                {nosCta_title.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <Link href={nosCta1_url}
                className="inline-flex items-center justify-between bg-white hover:bg-[#F4F4F4] text-[#000000] text-[11px] font-black uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group">
                {nosCta1_label}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={nosCta2_url}
                className="inline-flex items-center justify-between border border-white/10 text-white/40 hover:text-white hover:border-white/25 text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group">
                {nosCta2_label}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
