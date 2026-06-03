import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HeroVideo } from '@/components/public/HeroVideo'
import { LeaderCards } from '@/components/public/LeaderCards'
import { cmsSingleton, cmsImageUrl, type DNosotros } from '@/lib/directus'

export const dynamic = 'force-dynamic'

type Leader = { id: string; name: string; title: string; bio: string | null; avatar_url: string | null; category: string }

const DARK  = '#051828'
const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const SAGE  = '#869B7E'
const CREAM = '#F6F3EB'

const defaultBeliefs = [
  { n: '01', title: 'La Biblia',    desc: 'La Palabra inspirada de Dios, autoridad final para la fe y la práctica cristiana.' },
  { n: '02', title: 'La salvación', desc: 'Por gracia mediante la fe en Jesucristo, no por obras humanas.' },
  { n: '03', title: 'La iglesia',   desc: 'El cuerpo de Cristo, llamada a servir, adorar y hacer discípulos en toda la tierra.' },
  { n: '04', title: 'La misión',    desc: 'Cada creyente llamado a llevar el mensaje de salvación a su comunidad y al mundo.' },
]

export default async function NosotrosPage() {
  const supabase = await createClient()
  const [cms, { data: leadersData }] = await Promise.all([
    cmsSingleton<DNosotros & {
      hero_title_main: string | null; hero_title_accent: string | null
      pullquote: string | null; pullquote_author: string | null
      historia_p1: string | null; historia_p2: string | null
      historia_p3: string | null; historia_p4: string | null
      vision_text: string | null; mision_text: string | null
      valores_list: string | null; beliefs_json: string | null
      nos_cta_eyebrow: string | null; nos_cta_title: string | null
      nos_cta1_label: string | null; nos_cta1_url: string | null
      nos_cta2_label: string | null; nos_cta2_url: string | null
    }>('nosotros'),
    supabase.from('church_leaders').select('id,name,title,bio,avatar_url,category').eq('is_public', true).order('order_index'),
  ])
  const leaders: Leader[] = leadersData ?? []
  const pastoral   = leaders.filter(l => l.category === 'pastoral')
  const ministerio = leaders.filter(l => l.category === 'ministerio')
  const c = cms ?? {} as typeof cms & Record<string, any>

  const stats = [
    { value: c?.stat_year        ?? '2008', label: 'Fundados' },
    { value: c?.stat_families    ?? '500+', label: 'Familias' },
    { value: c?.stat_generations ?? '3',    label: 'Generaciones' },
    { value: c?.stat_ministries  ?? '12+',  label: 'Ministerios' },
  ]

  const heroBody        = c?.hero_body        ?? 'Nacimos de un sueño: ver una comunidad donde el amor de Dios fluyera libremente, como agua viva que transforma vidas.'
  const heroEyebrow     = c?.hero_eyebrow     ?? 'Quiénes somos · Desde 2008'
  const heroTitleMain   = c?.hero_title_main  ?? 'Somos\nEl Manan-'
  const heroTitleAccent = c?.hero_title_accent ?? 'tial.'
  const heroImageUrl    = cmsImageUrl(c?.hero_image)
  const heroVideoUrl    = c?.hero_video_url   ?? null

  const pullquote       = c?.pullquote        ?? 'No somos un edificio. Somos una familia que se reúne, crece y sirve juntos.'
  const pullquoteAuthor = c?.pullquote_author ?? '— Fundadores de El Manantial'
  const historiaP1      = c?.historia_p1      ?? 'Iglesia El Manantial nació en 2008 de un grupo de creyentes que soñaban con una comunidad donde el amor de Dios se viviera de manera auténtica y transformadora.'
  const historiaP2      = c?.historia_p2      ?? 'A lo largo de los años hemos crecido como familia, viendo milagros, restauraciones y cientos de vidas transformadas por el poder del evangelio.'
  const historiaP3      = c?.historia_p3      ?? 'Hoy somos una iglesia vibrante, con ministerios para todas las edades y un corazón apasionado por servir a nuestra comunidad.'
  const historiaP4      = c?.historia_p4      ?? 'Creemos que cada persona que entra a El Manantial encuentra más que una congregación: encuentra un hogar espiritual.'
  const visionText      = c?.vision_text      ?? 'Ser una iglesia que impacte nuestra ciudad y nación.'
  const misionText      = c?.mision_text      ?? 'Hacer discípulos que lleven el amor de Cristo a toda la tierra.'
  const valores         = (c?.valores_list ?? 'Fe,Amor,Integridad,Servicio,Comunidad').split(',').map((v: string) => v.trim())
  let beliefs: { n: string; title: string; desc: string }[] = defaultBeliefs
  try { if (c?.beliefs_json) beliefs = JSON.parse(c.beliefs_json) } catch { /* use defaults */ }
  const nosCta_eyebrow = c?.nos_cta_eyebrow ?? '— Únete a nosotros'
  const nosCta_title   = c?.nos_cta_title   ?? 'Eres parte\nde esta\nhistoria.'
  const nosCta1_label  = c?.nos_cta1_label  ?? 'Visítanos este domingo'
  const nosCta1_url    = c?.nos_cta1_url    ?? '/contacto'
  const nosCta2_label  = c?.nos_cta2_label  ?? 'Comunidad en línea'
  const nosCta2_url    = c?.nos_cta2_url    ?? '/login'

  return (
    <div>

      {/* ══════════════════════════════════════════
          1. HERO — dark, editorial
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[85svh] md:min-h-[90vh] flex flex-col justify-end"
        style={{ background: DARK }}>

        {heroImageUrl && !heroVideoUrl && (
          <img src={heroImageUrl} alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.55 }} />
        )}
        {heroVideoUrl && <HeroVideo url={heroVideoUrl} />}
        {(heroImageUrl || heroVideoUrl) && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(160deg, rgba(5,24,40,0.75) 0%, rgba(9,60,93,0.40) 70%, transparent 100%)` }} />
        )}

        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />

        <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-end overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(18rem, 40vw, 38rem)', opacity: 0.05, lineHeight: 1, paddingRight: '1rem', color: TEAL }}>
            08
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto w-full px-6 pb-0 pt-32 md:pt-40">
          <div className="pb-20 max-w-3xl">
            <div className="flex items-center gap-5 mb-14">
              <div className="w-12 h-px" style={{ background: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}B0` }}>
                {heroEyebrow}
              </p>
            </div>
            <h1 className="font-display font-black tracking-tighter text-white mb-8 leading-[0.88]"
              style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}>
              {heroTitleMain.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
              <br /><em style={{ color: TEAL }}>{heroTitleAccent}</em>
            </h1>
            <p className="text-base leading-relaxed max-w-lg mt-8" style={{ color: 'rgba(246,243,235,0.55)' }}>
              {heroBody}
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative" style={{ borderTop: `1px solid rgba(118,171,174,0.18)` }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map(({ value, label }) => (
                <div key={label} className="px-3 py-5 first:pl-0 sm:px-6 sm:py-7 md:px-8"
                  style={{ borderRight: `1px solid rgba(118,171,174,0.12)` }}>
                  <p className="font-black tracking-tighter leading-none mb-1"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: TEAL }}>{value}</p>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em]"
                    style={{ color: 'rgba(246,243,235,0.40)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. HISTORIA — CREAM, editorial respiro
      ══════════════════════════════════════════ */}
      <section style={{ background: CREAM, borderBottom: `1px solid #D9D4C7` }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-28">

          {/* Pullquote */}
          <div className="mb-20 max-w-3xl">
            <p className="font-display font-black tracking-tight leading-snug"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: DARK }}>
              {pullquote}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mt-6"
              style={{ color: SAGE }}>
              {pullquoteAuthor}
            </p>
          </div>

          {/* Historia 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl">
            <div className="space-y-5 text-base leading-relaxed" style={{ color: `${DARK}CC` }}>
              <p>{historiaP1}</p>
              <p>{historiaP2}</p>
            </div>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: `${DARK}CC` }}>
              <p>{historiaP3}</p>
              <p>{historiaP4}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. VISIÓN + MISIÓN — dark, tipografía grande
      ══════════════════════════════════════════ */}
      <section style={{ background: DARK, borderBottom: `1px solid rgba(118,171,174,0.12)` }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-28">

          <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-16"
            style={{ color: `rgba(118,171,174,0.50)` }}>— Lo que nos mueve</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
            <div className="p-8 sm:p-12 md:p-16 rounded-2xl"
              style={{ background: CREAM }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6"
                style={{ color: SAGE }}>Visión</p>
              <p className="font-display font-black tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: DARK }}>
                {visionText}
              </p>
            </div>
            <div className="p-8 sm:p-12 md:p-16 rounded-2xl"
              style={{ background: CREAM }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-6"
                style={{ color: SAGE }}>Misión</p>
              <p className="font-display font-black tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: DARK }}>
                {misionText}
              </p>
            </div>
          </div>

          {/* Valores */}
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-3">
            {valores.map((v, i) => (
              <div key={v} className="flex items-baseline gap-3">
                <span className="font-bold"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: 'rgba(118,171,174,0.35)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-black tracking-tighter leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: CREAM }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. LO QUE CREEMOS — CREAM, lista editorial
      ══════════════════════════════════════════ */}
      <section style={{ background: CREAM, borderBottom: `1px solid #D9D4C7` }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-28">

          <div className="flex items-end justify-between mb-12 pb-7"
            style={{ borderBottom: `1px solid #D9D4C7` }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em]"
              style={{ color: SAGE }}>— Fundamentos de fe</p>
          </div>

          <div style={{ borderTop: `1px solid #D9D4C7` }}>
            {beliefs.map(({ n, title, desc }) => (
              <div key={n}
                className="flex gap-8 md:gap-16 items-start py-8 sm:py-10 md:py-12"
                style={{ borderBottom: `1px solid #D9D4C7` }}>
                <span className="text-[10px] font-bold flex-shrink-0 mt-1.5"
                  style={{ color: SAGE, letterSpacing: '0.2em' }}>{n}</span>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight mb-2"
                    style={{ color: DARK }}>{title}</h3>
                  <p className="text-sm leading-relaxed max-w-xl"
                    style={{ color: `${DARK}99` }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. EQUIPO — dark profundo, fotos como protagonistas
      ══════════════════════════════════════════ */}
      {leaders.length > 0 && (
        <section style={{ background: DARK, borderBottom: `1px solid rgba(118,171,174,0.10)` }}>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-28">

            <div className="flex items-end justify-between mb-14 pb-7"
              style={{ borderBottom: `1px solid rgba(118,171,174,0.12)` }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4"
                  style={{ color: `rgba(118,171,174,0.50)` }}>— Nuestro equipo</p>
                <h2 className="font-display font-black tracking-tighter"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: CREAM }}>
                  Quienes te<br /><em style={{ color: TEAL }}>acompañan.</em>
                </h2>
              </div>
            </div>

            <LeaderCards pastoral={pastoral} ministerio={ministerio} />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          6. CTA — gradiente, cierre dramático
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 100% at 20% 50%, rgba(0,0,0,0.30), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28 md:py-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-12"
                style={{ color: 'rgba(255,255,255,0.30)' }}>{nosCta_eyebrow}</p>
              <h2 className="font-display font-black tracking-tighter text-white leading-[0.88]"
                style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}>
                {nosCta_title.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <Link href={nosCta1_url}
                className="flex items-center justify-between bg-white hover:bg-[#F4F4F4] text-[11px] font-black uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group"
                style={{ color: DARK }}>
                {nosCta1_label}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={nosCta2_url}
                className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-5 rounded-xl transition group"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)' }}>
                {nosCta2_label}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-all opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
