import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { cmsGet, cmsImageUrl, type DPredica } from '@/lib/directus'

export const revalidate = 300

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
function fmtFecha(iso: string) {
  const d = new Date(iso)
  return `${MESES[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

function getYoutubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default async function PredicasPage() {
  const rawPredicas = await cmsGet<DPredica>('predicas', { sort: '-id', limit: '50' })

  const predicas = rawPredicas.map(s => ({
    id: s.id,
    titulo: s.title,
    pastor: s.speaker ?? 'Pastor Principal',
    fecha: s.date ? fmtFecha(s.date) : '',
    serie: s.series ?? '',
    video_url: s.video_url ?? null,
    image_url: cmsImageUrl(s.thumbnail) ?? null,
  }))

  const featured = predicas[0] ?? null
  const archive  = predicas.slice(1)

  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[72svh] md:min-h-[72vh]" style={{ background: '#051828' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px), repeating-linear-gradient(0deg, ${TEAL} 0px, ${TEAL} 1px, transparent 1px, transparent 90px)` }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 50% 70% at 90% 40%, rgba(118,171,174,0.10), transparent 65%)` }} />
        <div className="pointer-events-none absolute right-0 bottom-0 select-none">
          <span className="font-black leading-none"
            style={{ fontSize: 'clamp(12rem, 28vw, 26rem)', opacity: 0.04, color: TEAL, lineHeight: 1 }}>
            FE
          </span>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12 sm:pt-32 sm:pb-20 md:pt-44 md:pb-24 flex flex-col justify-end"
          style={{ minHeight: '72vh' }}>
          <div className="flex items-center gap-5 mb-12">
            <div className="w-12 h-px" style={{ background: TEAL }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.45em]" style={{ color: `${TEAL}80` }}>
              Prédicas · Archivo de mensajes
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <h1 className="font-display font-black tracking-tighter text-white leading-[0.9] md:leading-[0.85]"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}>
              La Palabra<br /><em style={{ color: TEAL }}>donde estés.</em>
            </h1>
            <div>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Accede al archivo completo de nuestras prédicas. Escucha, medita y crece en la fe desde donde estés.
              </p>
              {predicas.length > 0 && (
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: `${TEAL}60` }}>
                  {predicas.length} mensaje{predicas.length !== 1 ? 's' : ''} disponible{predicas.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRÉDICA DESTACADA */}
      {featured && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: TEAL }}>Prédica reciente</p>
            </div>

            <Link href={`/predicas/${featured.id}`}
              className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border transition"
              style={{ borderColor: '#D2CDB8' }}>
              <div className="lg:col-span-5 relative min-h-[260px] flex items-center justify-center overflow-hidden"
                style={{
                  background: featured.image_url
                    ? `url(${featured.image_url}) center/cover`
                    : `linear-gradient(135deg, ${NAVY} 0%, #0D4A72 100%)`,
                }}>
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.20)' }} />
                {featured.serie && (
                  <div className="absolute top-5 left-5 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg"
                    style={{ background: TEAL, color: NAVY }}>
                    {featured.serie}
                  </div>
                )}
                <div className="relative w-20 h-20 rounded-full border-2 border-white/25 group-hover:bg-white/20 flex items-center justify-center transition duration-300 group-hover:scale-110">
                  <Play size={22} className="text-white ml-1.5" />
                </div>
              </div>
              <div className="lg:col-span-7 p-10 lg:p-14 flex flex-col justify-between gap-8"
                style={{ background: '#EDEAE0' }}>
                <div>
                  {featured.serie && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4" style={{ color: TEAL }}>{featured.serie}</p>
                  )}
                  <h2 className="font-display font-black tracking-tight leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: NAVY }}>
                    {featured.titulo}
                  </h2>
                  <p className="text-sm uppercase tracking-wider" style={{ color: SAGE }}>
                    {featured.pastor} · {featured.fecha}
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl self-start"
                  style={{ background: NAVY }}>
                  <Play size={12} /> Ver prédica <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ARCHIVO */}
      {archive.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Archivo</p>
                <h2 className="font-display font-black tracking-tighter"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.9, color: NAVY }}>
                  Prédicas<br />anteriores.
                </h2>
              </div>
              <p className="hidden sm:block text-[11px] font-bold uppercase tracking-wider" style={{ color: SAGE }}>
                {predicas.length} mensajes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {archive.map(({ id, titulo, pastor, fecha, serie, image_url, video_url }) => {
                const ytId = getYoutubeId(video_url ?? '')
                const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : image_url
                return (
                  <Link key={id} href={`/predicas/${id}`} className="group block">
                    <div className="relative rounded-xl overflow-hidden mb-4"
                      style={{ aspectRatio: '16/10', background: NAVY }}>
                      {thumb && (
                        <img src={thumb} alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-white/25 group-hover:bg-white/20 flex items-center justify-center transition group-hover:scale-110">
                          <Play size={14} className="text-white ml-0.5" />
                        </div>
                      </div>
                      {serie && (
                        <span className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">{serie}</span>
                      )}
                    </div>
                    <h3 className="font-black text-base tracking-tight leading-tight mb-1" style={{ color: NAVY }}>{titulo}</h3>
                    <p className="text-[11px] uppercase tracking-wider" style={{ color: SAGE }}>{pastor} · {fecha}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {predicas.length === 0 && (
        <section style={{ background: CREAM }}>
          <div className="max-w-6xl mx-auto px-6 py-40 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}25` }}>
              <Play size={36} style={{ color: TEAL }} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: SAGE }}>Próximamente</p>
            <h2 className="text-2xl font-black tracking-tight mb-3" style={{ color: NAVY }}>Las prédicas estarán aquí pronto</h2>
            <p className="text-sm max-w-sm mx-auto" style={{ color: `${NAVY}60` }}>
              Estamos preparando el archivo de mensajes para que puedas escucharlos cuando quieras.
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #051828 0%, ${NAVY} 60%, ${TEAL} 100%)` }}>
        <div className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-10" style={{ color: 'rgba(118,171,174,0.50)' }}>
                — También en la comunidad
              </p>
              <h2 className="font-display font-black tracking-tighter text-white leading-[0.9] md:leading-[0.85]"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
                La Palabra<br />es mejor<br /><em style={{ color: TEAL }}>en comunidad.</em>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Únete a la comunidad en línea para comentar, compartir y discutir los mensajes con otros creyentes.
              </p>
              <Link href="/registro"
                className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-5 sm:py-4 rounded-xl transition group"
                style={{ background: CREAM, color: NAVY }}>
                Crear mi cuenta <ArrowRight size={12} />
              </Link>
              <Link href="/en-vivo"
                className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] px-7 py-5 sm:py-4 rounded-xl transition group"
                style={{ border: '1px solid rgba(118,171,174,0.30)', color: 'rgba(246,243,235,0.60)' }}>
                Ver transmisiones en vivo <ArrowRight size={12} className="opacity-50 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
