import Link from 'next/link'
import { ArrowRight, Heart, Shield, ChevronRight, BookOpen, Users } from 'lucide-react'

export const revalidate = 3600

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const IMPACT = [
  { n: '01', label: 'Familias alcanzadas',  value: '200+',  desc: 'Familias que participan activamente en la comunidad de fe.' },
  { n: '02', label: 'Ministerios activos',  value: '8',     desc: 'Áreas de servicio donde la iglesia impacta cada semana.' },
  { n: '03', label: 'Años de ministerio',   value: '15+',   desc: 'Años sembrando en nuestra ciudad con el amor de Cristo.' },
  { n: '04', label: 'Servicios al año',     value: '150+',  desc: 'Reuniones de adoración, estudio y oración durante el año.' },
]

const AREAS = [
  { icon: BookOpen, title: 'Educación y discipulado',  desc: 'Material bíblico, recursos de formación y programas de mentoría para cada etapa de crecimiento.' },
  { icon: Heart,    title: 'Alcance comunitario',       desc: 'Ayuda a familias en necesidad, misiones locales y proyectos de impacto social.' },
  { icon: Users,    title: 'Ministerios y programas',   desc: 'Jóvenes, niños, matrimonios, adoración — cada ministerio necesita recursos para funcionar.' },
  { icon: Shield,   title: 'Infraestructura y tecnología', desc: 'Mantenimiento del templo, plataformas digitales y equipos para servir con excelencia.' },
]

export default function DonacionesPage() {
  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '85vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 55% 65% at 85% 30%, ${TEAL}10, transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter"
            style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', opacity: 0.05, color: TEAL, lineHeight: 1 }}>
            DAR
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-28 flex flex-col justify-end"
          style={{ minHeight: '85vh' }}>

          <div className="flex items-center gap-5 mb-12">
            <div className="w-px h-10" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
              Donaciones · Apoyo a la misión
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h1 className="font-display font-black tracking-tighter text-white mb-6"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
                Da con<br /><em style={{ color: TEAL }}>alegría.</em>
              </h1>
            </div>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: 'rgba(246,243,235,0.55)' }}>
                "Dios ama al dador alegre." Cada ofrenda es un acto de fe y un voto de confianza en el trabajo que Dios está haciendo a través de esta comunidad.
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: `${TEAL}70` }}>
                — 2 Corintios 9:7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTODOS DE DONACIÓN */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Cómo dar</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Simple y<br />seguro.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Transferencia bancaria */}
            <div className="rounded-2xl p-8 md:p-10 flex flex-col" style={{ background: NAVY }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: `${TEAL}80` }}>
                01 — Transferencia bancaria
              </p>
              <h3 className="font-black text-xl tracking-tight text-white mb-6">
                Banco directo
              </h3>
              <div className="space-y-3 mb-8 flex-1">
                {[
                  { label: 'Banco',   value: 'Banco Popular Dominicano' },
                  { label: 'Cuenta',  value: '123-456789-0' },
                  { label: 'Titular', value: 'Iglesia El Manantial Inc.' },
                  { label: 'RNC',     value: '1-23-45678-9' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: `${TEAL}60` }}>{label}</p>
                    <p className="text-sm font-bold text-white mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(246,243,235,0.40)' }}>
                Envíanos el comprobante de transferencia por WhatsApp o correo para el registro.
              </p>
            </div>

            {/* Zelle */}
            <div className="rounded-2xl p-8 md:p-10 flex flex-col" style={{ background: '#EDEAE0', border: '1px solid #D2CDB8' }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>
                02 — Zelle
              </p>
              <h3 className="font-black text-xl tracking-tight mb-6" style={{ color: NAVY }}>
                Transferencia directa
              </h3>
              <div className="space-y-3 mb-8 flex-1">
                {[
                  { label: 'Email Zelle',   value: 'elmanantial@iglesia.com' },
                  { label: 'Nombre',        value: 'Iglesia El Manantial' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: `${NAVY}50` }}>{label}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: NAVY }}>{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: `${NAVY}50` }}>
                Disponible desde cualquier banco en Estados Unidos. Sin comisiones adicionales.
              </p>
            </div>

            {/* En persona */}
            <div className="rounded-2xl p-8 md:p-10 flex flex-col"
              style={{ background: `linear-gradient(135deg, ${TEAL}18 0%, ${TEAL}06 100%)`, border: `1px solid ${TEAL}25` }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: TEAL }}>
                03 — En persona
              </p>
              <h3 className="font-black text-xl tracking-tight mb-6" style={{ color: NAVY }}>
                Durante el culto
              </h3>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}30` }}>
                    <span className="text-[10px] font-black" style={{ color: TEAL }}>D</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: NAVY }}>Domingo 10:00 AM</p>
                    <p className="text-[11px]" style={{ color: `${NAVY}60` }}>Servicio principal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}30` }}>
                    <span className="text-[10px] font-black" style={{ color: TEAL }}>M</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: NAVY }}>Miércoles 7:00 PM</p>
                    <p className="text-[11px]" style={{ color: `${NAVY}60` }}>Estudio bíblico</p>
                  </div>
                </div>
              </div>
              <Link href="/contacto"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider"
                style={{ color: TEAL }}>
                Ver ubicación <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Tu impacto</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Lo que tu<br />ofrenda hace.
              </h2>
            </div>
          </div>

          <div className="space-y-px rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid #D2CDB8' }}>
            {IMPACT.map(({ n, label, value, desc }, idx) => (
              <div key={n}
                className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-6 md:px-8 py-6 md:py-7"
                style={{ background: idx % 2 === 0 ? CREAM : '#F4F1E8' }}>
                <span className="text-[9px] font-black tracking-widest flex-shrink-0" style={{ color: '#D2CDB8' }}>{n}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base tracking-tight" style={{ color: NAVY }}>{label}</h3>
                  <p className="text-[12px] mt-1" style={{ color: `${NAVY}60` }}>{desc}</p>
                </div>
                <p className="font-black text-3xl flex-shrink-0" style={{ color: TEAL }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÁREAS DE INVERSIÓN */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— A dónde va</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Inversión con<br />propósito.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AREAS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-8 rounded-2xl flex items-start gap-6" style={{ background: NAVY }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}30` }}>
                  <Icon size={22} style={{ color: TEAL }} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-black text-base tracking-tight text-white mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.50)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERSÍCULO + CTA */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="w-2 h-14 rounded-full mb-8" style={{ background: TEAL }} />
              <p className="font-display font-black tracking-tighter text-white mb-6"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 0.95 }}>
                "El que siembra escasamente, también segará escasamente; y el que siembra generosamente, generosamente también segará."
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: 'rgba(118,171,174,0.60)' }}>
                — 2 Corintios 9:6
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.55)' }}>
                ¿Tienes preguntas sobre cómo realizar tu ofrenda o sobre la administración de los fondos? Estamos disponibles para responderte.
              </p>
              <Link href="/contacto"
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                Contáctanos <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/nosotros"
                className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.60)' }}>
                Conocer nuestra visión <ArrowRight size={12} className="opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
