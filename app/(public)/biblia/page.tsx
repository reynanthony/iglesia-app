import Link from 'next/link'
import { ArrowRight, BookOpen, ChevronRight, Quote } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

// Versículo del día — rota por día del año
const VERSES = [
  { ref: 'Salmo 119:105',   text: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.' },
  { ref: 'Josué 1:9',       text: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.' },
  { ref: 'Mateo 11:28',     text: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.' },
  { ref: 'Filipenses 4:7',  text: 'Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.' },
  { ref: 'Isaías 40:31',    text: 'Los que esperan en Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.' },
  { ref: 'Romanos 8:28',    text: 'A los que aman a Dios, todas las cosas les ayudan a bien.' },
  { ref: 'Salmo 23:1',      text: 'Jehová es mi pastor; nada me faltará.' },
  { ref: 'Juan 3:16',       text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
  { ref: 'Proverbios 3:5',  text: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.' },
  { ref: 'Jeremías 29:11',  text: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.' },
  { ref: 'Gálatas 2:20',    text: 'Con Cristo estoy juntamente crucificado, y ya no vivo yo, mas vive Cristo en mí.' },
  { ref: 'Filipenses 4:13', text: 'Todo lo puedo en Cristo que me fortalece.' },
  { ref: 'Salmo 46:10',     text: 'Estad quietos, y conoced que yo soy Dios.' },
  { ref: '2 Timoteo 3:16',  text: 'Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia.' },
]

function getVerseOfDay() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return VERSES[dayOfYear % VERSES.length]
}

// Pasajes bíblicos destacados para explorar
const PASSAGES = [
  { ref: 'Juan 1:1–18',        title: 'El Verbo hecho carne',         desc: 'El prólogo más profundo de la Escritura.' },
  { ref: 'Romanos 8',           title: 'Vida en el Espíritu',          desc: 'El capítulo del triunfo cristiano.' },
  { ref: 'Salmo 23',            title: 'El Buen Pastor',               desc: 'El salmo más conocido del mundo.' },
  { ref: 'Mateo 5–7',           title: 'El Sermón del Monte',          desc: 'El corazón de la ética de Jesús.' },
  { ref: '1 Corintios 13',      title: 'El Himno del Amor',            desc: 'La definición perfecta del amor bíblico.' },
  { ref: 'Hebreos 11',          title: 'Galería de la Fe',             desc: 'Los héroes de la fe a lo largo de la historia.' },
]

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]}`
}

export default async function BibliaPage() {
  const supabase = await createClient()
  const verse = getVerseOfDay()

  const { data: devocionales } = await supabase
    .from('devocionales')
    .select('id,title,content,author,verse,verse_ref,created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const devos = devocionales ?? []

  return (
    <div>

      {/* ══ HERO — versículo del día ════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#051828', minHeight: '90vh' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 55% 65% at 85% 30%, ${TEAL}10, transparent 65%)` }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-24 flex flex-col justify-between"
          style={{ minHeight: '90vh' }}>

          {/* Eyebrow */}
          <div className="flex items-center gap-5">
            <div className="w-12 h-px" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
              Biblia · Palabra de Dios para hoy
            </p>
          </div>

          {/* Versículo del día */}
          <div className="py-16 md:py-20">
            <p className="text-[9px] font-bold uppercase tracking-[0.5em] mb-8" style={{ color: `${TEAL}60` }}>
              — Versículo del día
            </p>
            <div className="max-w-4xl">
              <p className="font-display font-black tracking-tighter text-white leading-[0.88] mb-8"
                style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}>
                "{verse.text}"
              </p>
              <p className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: TEAL }}>
                — {verse.ref}
              </p>
            </div>
          </div>

          {/* Call to app */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8"
            style={{ borderTop: `1px solid rgba(118,171,174,0.15)` }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}30` }}>
                <BookOpen size={18} style={{ color: TEAL }} />
              </div>
              <div>
                <p className="text-sm font-black text-white">Explora la Escritura</p>
                <p className="text-[11px]" style={{ color: `rgba(246,243,235,0.45)` }}>
                  Devocionales · Pasajes destacados · Reflexiones
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:ml-auto">
              <Link href="/registro"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition"
                style={{ background: TEAL, color: NAVY }}>
                Crear cuenta <ChevronRight size={12} />
              </Link>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition"
                style={{ border: `1px solid ${TEAL}30`, color: `rgba(246,243,235,0.55)` }}>
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DEVOCIONALES ══════════════════════════════════════ */}
      {devos.length > 0 ? (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
            <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Devocionales</p>
                <h2 className="font-display font-black tracking-tighter"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                  Reflexiones<br />para el alma.
                </h2>
              </div>
            </div>

            {/* Devocional destacado */}
            <Link href={`/biblia/devocional/${devos[0].id}`}
              className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden mb-5 transition"
              style={{ border: '1px solid #D2CDB8' }}>
              <div className="lg:col-span-5 flex items-center justify-center p-12 md:p-16"
                style={{ background: NAVY }}>
                {devos[0].verse && (
                  <div className="text-center">
                    <Quote size={20} style={{ color: `${TEAL}60`, margin: '0 auto 12px' }} />
                    <p className="font-display font-black text-white tracking-tight leading-tight mb-4"
                      style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>
                      "{devos[0].verse}"
                    </p>
                    {devos[0].verse_ref && (
                      <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: TEAL }}>
                        — {devos[0].verse_ref}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center gap-4" style={{ background: CREAM }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.35em]" style={{ color: TEAL }}>
                  Devocional reciente
                </p>
                <h3 className="font-black text-2xl md:text-3xl tracking-tight leading-tight" style={{ color: NAVY }}>
                  {devos[0].title}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-4" style={{ color: `${NAVY}65` }}>
                  {devos[0].content}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: SAGE }}>
                    {devos[0].author}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider"
                    style={{ color: TEAL }}>
                    Leer <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>

            {/* Otros devocionales */}
            {devos.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devos.slice(1).map(d => (
                  <Link key={d.id} href={`/biblia/devocional/${d.id}`}
                    className="group p-7 rounded-2xl transition hover:brightness-95"
                    style={{ background: '#EDEAE0', border: '1px solid #D2CDB8' }}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: TEAL }}>
                      {d.verse_ref ?? 'Devocional'}
                    </p>
                    <h4 className="font-black text-lg tracking-tight leading-tight mb-3 group-hover:opacity-70 transition" style={{ color: NAVY }}>
                      {d.title}
                    </h4>
                    <p className="text-[12px] leading-relaxed line-clamp-3 mb-4" style={{ color: `${NAVY}60` }}>
                      {d.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: SAGE }}>
                        {d.author}
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1" style={{ color: TEAL }}>
                        Leer <ArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Devocionales</p>
                <h2 className="font-display font-black tracking-tighter"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                  Reflexiones<br />para el alma.
                </h2>
              </div>
            </div>
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: `${NAVY}50` }}>
                Los devocionales estarán disponibles pronto.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ══ PASAJES DESTACADOS ════════════════════════════════ */}
      <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-14 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Escritura</p>
              <h2 className="font-display font-black tracking-tighter"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                Pasajes que<br />transforman.
              </h2>
            </div>
          </div>

          <div className="space-y-px rounded-2xl overflow-hidden" style={{ border: '1px solid #D2CDB8' }}>
            {PASSAGES.map(({ ref, title, desc }, idx) => (
              <div key={ref}
                className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 px-6 md:px-8 py-6 md:py-7"
                style={{ background: idx % 2 === 0 ? CREAM : '#F4F1E8' }}>
                <div className="flex-shrink-0 w-32">
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: TEAL }}>{ref}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base tracking-tight" style={{ color: NAVY }}>{title}</h3>
                  <p className="text-[12px] mt-0.5" style={{ color: `${NAVY}60` }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] mt-6 text-center" style={{ color: `${NAVY}40` }}>
            Consulta estos pasajes en tu Biblia o en aplicaciones como YouVersion, Bible Gateway o Blue Letter Bible.
          </p>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-10" style={{ color: 'rgba(118,171,174,0.50)' }}>
                — Únete a la comunidad
              </p>
              <h2 className="font-display font-black tracking-tighter text-white"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.85 }}>
                La Escritura<br />es mejor<br /><em style={{ color: TEAL }}>en comunidad.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Únete a grupos de estudio, comparte versículos que te impactaron y lee la Biblia con toda la iglesia.
              </p>
              <Link href="/registro"
                className="inline-flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                Crear mi cuenta <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/educacion/estudio-biblico"
                className="inline-flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.60)' }}>
                Ver estudio bíblico presencial <ArrowRight size={12} className="opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
