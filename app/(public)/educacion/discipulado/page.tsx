import Link from 'next/link'
import { ArrowRight, ArrowLeft, ChevronRight, Users, Heart, BookOpen, Droplets, HandHeart, UserCheck, Crown } from 'lucide-react'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const STAGES = [
  { n: '01', icon: Users,     title: 'Visitante',       desc: 'El primer encuentro. Explorar la fe sin presión, con apertura y bienvenida.', color: '#94A3B8' },
  { n: '02', icon: Heart,     title: 'Nuevo creyente',  desc: 'El nacimiento espiritual. Primeros pasos, primera comunidad, primera oración.', color: '#86EFAC' },
  { n: '03', icon: BookOpen,  title: 'Fundamentos',     desc: 'La raíz. Doctrina, Biblia, oración, adoración — el cimiento de todo lo que viene.', color: '#6EE7B7' },
  { n: '04', icon: Droplets,  title: 'Bautismo',        desc: 'La declaración pública. Un acto de fe que marca el antes y el después en la vida cristiana.', color: '#60A5FA' },
  { n: '05', icon: HandHeart, title: 'Servicio',        desc: 'Descubrir los dones. Encontrar el lugar en el cuerpo de Cristo y comenzar a dar.', color: '#C084FC' },
  { n: '06', icon: UserCheck, title: 'Discipulado',     desc: 'La relación de uno a uno. Un mentor que camina contigo, un discípulo al que acompañas.', color: '#F59E0B' },
  { n: '07', icon: Crown,     title: 'Liderazgo',       desc: 'El fruto del proceso. Servir, guiar y reproducir lo que recibiste en otros.', color: '#F87171' },
]

export default function DiscipuladoPage() {
  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: NAVY, minHeight: '85vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 55% 70% at 85% 40%, ${TEAL}12, transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter"
            style={{ fontSize: 'clamp(14rem, 30vw, 28rem)', opacity: 0.05, color: TEAL, lineHeight: 1 }}>
            VII
          </span>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-28 flex flex-col justify-end"
          style={{ minHeight: '85vh' }}>
          {/* Breadcrumb */}
          <Link href="/educacion"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] mb-14 transition"
            style={{ color: `${TEAL}60` }}>
            <ArrowLeft size={11} /> Educación
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-px h-10" style={{ background: TEAL }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
                  Discipulado · 7 etapas de crecimiento
                </p>
              </div>
              <h1 className="font-display font-black tracking-tighter text-white mb-6"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
                Crecer<br />en<br /><em style={{ color: TEAL }}>Cristo.</em>
              </h1>
            </div>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: 'rgba(246,243,235,0.55)' }}>
                El discipulado no es un evento — es un proceso. Siete etapas diseñadas para llevar a cada persona desde el primer encuentro con Dios hasta el liderazgo pleno en su comunidad.
              </p>
              <Link href="/registro"
                className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3.5 rounded-xl transition"
                style={{ background: TEAL, color: NAVY }}>
                Iniciar mi camino <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LAS 7 ETAPAS */}
      <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— El camino</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Siete etapas.<br />Un destino.
              </h2>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Línea vertical (desktop) */}
            <div className="hidden md:block absolute left-[3.5rem] top-0 bottom-0 w-px" style={{ background: '#D2CDB8' }} />

            <div className="space-y-3">
              {STAGES.map(({ n, icon: Icon, title, desc, color }, idx) => (
                <div key={n}
                  className="group relative flex items-start gap-8 p-7 rounded-2xl transition hover:bg-white"
                  style={{ border: '1px solid transparent' }}>
                  {/* Número + ícono */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10"
                      style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                      <Icon size={22} style={{ color }} strokeWidth={1.8} />
                    </div>
                    <span className="text-[9px] font-black tracking-widest" style={{ color: '#D2CDB8' }}>{n}</span>
                  </div>
                  {/* Contenido */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-black text-xl tracking-tight" style={{ color: NAVY }}>{title}</h3>
                      {idx === 0 && (
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{ background: `${TEAL}18`, color: TEAL }}>Punto de entrada</span>
                      )}
                      {idx === 6 && (
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{ background: `${color}18`, color }}>Meta del proceso</span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed max-w-2xl" style={{ color: `${NAVY}65` }}>{desc}</p>
                  </div>
                  {/* Indicador de progreso */}
                  <div className="hidden md:flex flex-shrink-0 items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `${NAVY}30` }}>
                      {idx + 1}/7
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MENTORÍA — cómo funciona */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6" style={{ color: SAGE }}>— Mentoría personal</p>
              <h2 className="font-display font-black tracking-tighter mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Nadie crece<br />solo.
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: `${NAVY}70` }}>
                Cada etapa del discipulado incluye una relación de mentoría — un creyente más maduro que camina contigo, te hace preguntas difíciles, te celebra en los logros y te sostiene en los momentos difíciles.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: `${NAVY}70` }}>
                Cuando llegas a la etapa 6, ya no solo eres discípulo — también comienzas a discipular a otro. Así se multiplica el Reino.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/contacto"
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition self-start"
                  style={{ background: NAVY, color: CREAM }}>
                  Quiero un mentor <ArrowRight size={12} />
                </Link>
                <Link href="/registro"
                  className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition self-start"
                  style={{ border: `1px solid ${NAVY}30`, color: `${NAVY}70` }}>
                  Unirme a la comunidad
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Relación 1a1', value: 'con tu mentor' },
                { label: 'Frecuencia',  value: 'Quincenal o mensual' },
                { label: 'Duración',    value: 'Sin límite de tiempo' },
                { label: 'Resultado',   value: 'Multiplicación' },
              ].map(({ label, value }) => (
                <div key={label} className="p-6 rounded-2xl" style={{ background: NAVY }}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: `${TEAL}80` }}>{label}</p>
                  <p className="font-black text-base leading-tight" style={{ color: CREAM }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRESO EN LA APP */}
      <section style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10"
            style={{ background: 'rgba(118,171,174,0.10)', border: '1px solid rgba(118,171,174,0.20)' }}>
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: `${TEAL}70` }}>
                Continúa en la app
              </p>
              <h3 className="font-black text-2xl text-white tracking-tight mb-3">
                Sigue tu progreso de discipulado en tiempo real
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.55)' }}>
                En la comunidad en línea puedes ver tu etapa actual, los recursos de cada fase, tu mentor asignado y conectar con otros en el mismo camino.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0 w-full md:w-auto">
              <Link href="/registro"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-wider transition"
                style={{ background: TEAL, color: NAVY }}>
                Crear cuenta <ChevronRight size={13} />
              </Link>
              <Link href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.55)' }}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
