import Link from 'next/link'
import { ArrowRight, ArrowLeft, BookOpen, Clock, Users, ChevronRight, Calendar } from 'lucide-react'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const SERIES = [
  { n: '01', book: 'Evangelio de Juan',   theme: 'La identidad de Cristo',           sessions: 12, status: 'activa',   color: TEAL },
  { n: '02', book: 'Salmos selectos',      theme: 'Adoración y vida interior',        sessions: 8,  status: 'próxima',  color: SAGE },
  { n: '03', book: 'Filipenses',           theme: 'Gozo en toda circunstancia',       sessions: 6,  status: 'próxima',  color: '#C084FC' },
  { n: '04', book: 'Génesis 1–11',         theme: 'Los orígenes de todo',             sessions: 10, status: 'archivo',  color: '#60A5FA' },
  { n: '05', book: 'Proverbios temático',  theme: 'Sabiduría para la vida diaria',   sessions: 7,  status: 'archivo',  color: '#F59E0B' },
]

const STATUS_LABEL: Record<string, string>   = { activa: 'En curso', próxima: 'Próximamente', archivo: 'Completada' }
const STATUS_COLOR: Record<string, string>   = { activa: '#76ABAE', próxima: SAGE, archivo: '#94A3B8' }

const HOW = [
  { n: '01', title: 'Contexto histórico',  desc: 'Quién escribió el libro, cuándo, para quién y en qué situación. El texto habla más cuando conoces su mundo.' },
  { n: '02', title: 'Estructura del texto', desc: 'Analizamos párrafo por párrafo, idea por idea. No saltamos a aplicaciones antes de entender qué dice el texto.' },
  { n: '03', title: 'Principio eterno',    desc: 'De cada pasaje extraemos la verdad universal que trasciende el tiempo y la cultura.' },
  { n: '04', title: 'Aplicación práctica', desc: 'Cómo vive esa verdad una persona real, en 2026, en nuestra ciudad. El estudio se vuelve vida.' },
]

export default function EstudioBiblicoPage() {
  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '85vh' }}>
        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 65% at 80% 35%, ${TEAL}10, transparent 65%)` }} />
        {/* Decorative word */}
        <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden select-none">
          <span className="font-black leading-none tracking-tighter"
            style={{ fontSize: 'clamp(10rem, 28vw, 26rem)', opacity: 0.05, color: TEAL, lineHeight: 1 }}>
            LOGOS
          </span>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-28 flex flex-col justify-end"
          style={{ minHeight: '85vh' }}>
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
                  Estudio Bíblico · Miércoles 7PM
                </p>
              </div>
              <h1 className="font-display font-black tracking-tighter text-white mb-6"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.85 }}>
                La Palabra<br /><em style={{ color: TEAL }}>viva.</em>
              </h1>
            </div>
            <div>
              <p className="text-base leading-relaxed max-w-sm mb-8" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Cada miércoles nos reunimos para estudiar la Biblia con rigor, comunidad y aplicación práctica. No interpretamos la Escritura solos — la interpretamos juntos.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2" style={{ color: `${TEAL}80` }}>
                  <Calendar size={13} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Miércoles</span>
                </div>
                <div className="w-px h-4" style={{ background: `${TEAL}30` }} />
                <div className="flex items-center gap-2" style={{ color: `${TEAL}80` }}>
                  <Clock size={13} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">7:00 PM</span>
                </div>
                <div className="w-px h-4" style={{ background: `${TEAL}30` }} />
                <div className="flex items-center gap-2" style={{ color: `${TEAL}80` }}>
                  <Users size={13} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Todas las edades</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERIES — tabla editorial */}
      <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Series de estudio</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Lo que<br />estudiamos.
              </h2>
            </div>
          </div>

          <div className="space-y-px rounded-2xl overflow-hidden" style={{ border: '1px solid #D2CDB8' }}>
            {SERIES.map(({ n, book, theme, sessions, status, color }, idx) => (
              <div key={n}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-6 md:px-8 py-6 md:py-7 transition hover:bg-white"
                style={{ background: idx % 2 === 0 ? CREAM : '#F4F1E8', cursor: status === 'activa' ? 'pointer' : 'default' }}>
                <span className="text-[9px] font-black tracking-widest flex-shrink-0" style={{ color: '#D2CDB8' }}>{n}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-base tracking-tight" style={{ color: NAVY }}>{book}</h3>
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${STATUS_COLOR[status]}20`, color: STATUS_COLOR[status], border: `1px solid ${STATUS_COLOR[status]}30` }}>
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                  <p className="text-[12px]" style={{ color: `${NAVY}60` }}>{theme}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-black text-xl leading-none" style={{ color }}>{sessions}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: `${NAVY}40` }}>sesiones</p>
                  </div>
                  {status === 'activa' && (
                    <ArrowRight size={14} style={{ color: TEAL }} className="group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METODOLOGÍA */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Cómo estudiamos</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Método que<br />transforma.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HOW.map(({ n, title, desc }) => (
              <div key={n} className="p-8 rounded-2xl" style={{ background: NAVY }}>
                <div className="flex items-start gap-5">
                  <span className="text-[9px] font-black tracking-widest mt-1 flex-shrink-0" style={{ color: `${TEAL}50` }}>{n}</span>
                  <div>
                    <h3 className="font-black text-base tracking-tight mb-3" style={{ color: CREAM }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.55)' }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERSÍCULO + CTA */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 80% at 80% 50%, rgba(255,255,255,0.04), transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <div className="w-2 h-14 rounded-full mb-8" style={{ background: TEAL }} />
              <p className="font-display font-black tracking-tighter text-white mb-6"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 0.95 }}>
                "Lámpara es a mis pies tu palabra, y lumbrera a mi camino."
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: 'rgba(118,171,174,0.60)' }}>
                — Salmo 119:105
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Únete al estudio bíblico este miércoles a las 7PM. No necesitas traer nada más que tu Biblia y un corazón abierto.
              </p>
              <Link href="/contacto"
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                ¿Cómo llegar? <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/registro"
                className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.60)' }}>
                Unirme en línea <ChevronRight size={12} className="opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
