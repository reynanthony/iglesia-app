import Link from 'next/link'
import { ArrowRight, BookOpen, Users, ChevronRight } from 'lucide-react'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const PATHS = [
  {
    href:     '/educacion/discipulado',
    n:        '01',
    label:    'Discipulado',
    headline: 'Crecer en\nCristo.',
    desc:     'Un camino estructurado de siete etapas desde el primer encuentro con Dios hasta el liderazgo pleno. No es un programa — es una transformación.',
    icon:     Users,
    bg:       NAVY,
    fg:       CREAM,
    accent:   TEAL,
    tags:     ['7 etapas', 'Mentoría personal', 'Crecimiento espiritual'],
  },
  {
    href:     '/educacion/estudio-biblico',
    n:        '02',
    label:    'Estudio Bíblico',
    headline: 'La Palabra\nviva.',
    desc:     'Estudios semanales profundos que te llevan libro por libro, tema por tema. La Biblia no es un texto antiguo — es la voz de Dios hoy.',
    icon:     BookOpen,
    bg:       '#E8EDE6',
    fg:       NAVY,
    accent:   SAGE,
    tags:     ['Miércoles 7PM', 'Todas las edades', 'Recursos descargables'],
  },
]

export default function EducacionPage() {
  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '80vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 60% 70% at 90% 30%, ${TEAL}15, transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter block"
            style={{ fontSize: 'clamp(14rem, 32vw, 30rem)', opacity: 0.05, color: TEAL, lineHeight: 1 }}>
            FE
          </span>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-28 flex flex-col justify-end"
          style={{ minHeight: '80vh' }}>
          <div className="flex items-center gap-5 mb-14">
            <div className="w-12 h-px" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}90` }}>
              Educación · Formación espiritual
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <h1 className="font-display font-black tracking-tighter text-white"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
              Antes de<br />servir,<br /><em style={{ color: TEAL }}>aprender.</em>
            </h1>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: 'rgba(246,243,235,0.55)' }}>
                La fe sin conocimiento se apaga. La formación espiritual es el fundamento sobre el que se construye todo lo demás — la comunidad, el servicio, el impacto.
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: `${TEAL}70` }}>
                Dos caminos de formación
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DOS CAMINOS — editorial full-bleed */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {PATHS.map(({ href, n, label, headline, desc, icon: Icon, bg, fg, accent, tags }) => (
          <Link key={href} href={href}
            className="group relative flex flex-col justify-between overflow-hidden"
            style={{ minHeight: 520, background: bg }}>

            {/* Decorative number */}
            <div className="pointer-events-none absolute right-8 bottom-0 font-black leading-none select-none overflow-hidden"
              style={{ fontSize: 'clamp(10rem, 22vw, 20rem)', opacity: 0.06, color: accent, lineHeight: 1 }}>
              {n}
            </div>

            {/* Top */}
            <div className="relative p-10 md:p-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}20`, border: `1px solid ${accent}35` }}>
                  <Icon size={20} style={{ color: accent }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.35em]"
                    style={{ color: fg === CREAM ? `${CREAM}50` : `${NAVY}40` }}>{n}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: accent }}>{label}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <div className="relative p-10 md:p-14">
              <h2 className="font-display font-black tracking-tighter mb-5 transition"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.88, color: fg }}>
                {headline.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-sm"
                style={{ color: fg === CREAM ? `${CREAM}60` : `${NAVY}60` }}>
                {desc}
              </p>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition group-hover:gap-3"
                style={{ color: accent }}>
                Explorar <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Por qué importa — versículo + texto */}
      <section style={{ background: CREAM, borderTop: '1px solid #D2CDB8', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6" style={{ color: SAGE }}>— Por qué formamos</p>
              <h2 className="font-display font-black tracking-tighter mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                La educación espiritual es el camino, no el destino.
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: `${NAVY}70` }}>
                Antes de que alguien pueda servir con excelencia, conectarse en comunidad, o liderar con integridad — necesita conocer a Dios profundamente.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: `${NAVY}70` }}>
                Por eso nuestros programas de educación son el punto de entrada al ecosistema de El Manantial: primero formamos, luego servimos juntos.
              </p>
              <Link href="/registro"
                className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition"
                style={{ background: NAVY, color: CREAM }}>
                Comenzar mi camino <ArrowRight size={12} />
              </Link>
            </div>
            <div className="relative">
              <div className="w-2 absolute left-0 top-0 bottom-0 rounded-full" style={{ background: TEAL }} />
              <div className="pl-8">
                <p className="font-display font-black tracking-tighter leading-tight mb-6"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: NAVY }}>
                  "Procura con diligencia presentarte a Dios aprobado, como obrero que no tiene de qué avergonzarse, que usa bien la palabra de verdad."
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: SAGE }}>
                  — 2 Timoteo 2:15
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Puente app → web */}
      <section style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl p-8 md:p-10"
            style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.20)' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: `${TEAL}80` }}>
                También en la app
              </p>
              <h3 className="font-black text-xl text-white tracking-tight">
                Continúa tu formación en la comunidad en línea
              </h3>
              <p className="text-sm mt-2" style={{ color: 'rgba(246,243,235,0.50)' }}>
                En la app puedes ver tu progreso de discipulado, participar en grupos de estudio y conectar con tu mentor.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link href="/registro"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition"
                style={{ background: TEAL, color: NAVY }}>
                Crear cuenta <ChevronRight size={13} />
              </Link>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition text-center justify-center"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.60)' }}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
