import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Quote } from 'lucide-react'
import { cmsGet, cmsById, cmsImageUrl, type DDevocional } from '@/lib/directus'

export const revalidate = 3600

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}

export default async function DevocionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [devo, others] = await Promise.all([
    cmsById<DDevocional>('devocionales', id),
    cmsGet<DDevocional>('devocionales', {
      'filter[status][_eq]': 'published',
      'filter[id][_neq]': id,
      'sort': '-date_published,-date_created',
      'limit': '3',
    }),
  ])

  if (!devo || devo.status !== 'published') notFound()

  const imgUrl = cmsImageUrl(devo.image)

  return (
    <div>

      {/* NAV */}
      <div style={{ background: '#051828', borderBottom: '1px solid rgba(118,171,174,0.10)' }}>
        <div className="max-w-4xl mx-auto px-6 py-5">
          <Link href="/biblia"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition"
            style={{ color: `${TEAL}70` }}>
            <ArrowLeft size={11} /> Biblia
          </Link>
        </div>
      </div>

      {/* VERSE HERO */}
      <section style={{ background: '#051828' }}>
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-8 text-[9px] font-black uppercase tracking-[0.25em]"
            style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}>
            <BookOpen size={10} /> Devocional
          </div>

          {devo.verse && (
            <div className="mb-10 p-8 rounded-2xl" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}20` }}>
              <Quote size={20} style={{ color: `${TEAL}60`, marginBottom: 12 }} />
              <p className="font-display font-black tracking-tighter text-white leading-tight mb-4"
                style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', lineHeight: 0.95 }}>
                "{devo.verse}"
              </p>
              {devo.verse_ref && (
                <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: TEAL }}>
                  — {devo.verse_ref}
                </p>
              )}
            </div>
          )}

          <h1 className="font-display font-black tracking-tighter text-white mb-6"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 0.9 }}>
            {devo.title}
          </h1>

          <div className="flex items-center gap-4 pt-5" style={{ borderTop: `1px solid rgba(118,171,174,0.15)` }}>
            {devo.author && (
              <p className="text-[11px] font-bold" style={{ color: 'rgba(246,243,235,0.82)' }}>{devo.author}</p>
            )}
            <span style={{ color: 'rgba(118,171,174,0.25)' }}>·</span>
            <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.84)' }}>
              {fmtDate(devo.date_published ?? devo.date_created)}
            </p>
          </div>
        </div>
      </section>

      {/* IMAGE */}
      {imgUrl && (
        <div style={{ background: '#000' }}>
          <div className="max-w-4xl mx-auto">
            <img src={imgUrl} alt={devo.title} className="w-full object-cover" style={{ maxHeight: 400 }} />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
          {devo.content.split('\n\n').map((paragraph, i) =>
            paragraph.trim() ? (
              <p key={i} className="mb-6 text-base leading-relaxed" style={{ color: `${NAVY}85` }}>
                {paragraph}
              </p>
            ) : null
          )}
        </div>
      </section>

      {/* MORE DEVOCIONALES */}
      {others.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-4xl mx-auto px-6 py-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-8" style={{ color: SAGE }}>
              — Más devocionales
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {others.map(d => (
                <Link key={d.id} href={`/biblia/devocional/${d.id}`}
                  className="group p-5 rounded-2xl transition"
                  style={{ background: CREAM, border: '1px solid #D2CDB8' }}>
                  {d.verse_ref && (
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: TEAL }}>
                      {d.verse_ref}
                    </p>
                  )}
                  <h3 className="font-black text-sm tracking-tight leading-tight mb-2 group-hover:opacity-70 transition" style={{ color: NAVY }}>
                    {d.title}
                  </h3>
                  {d.author && <p className="text-[10px]" style={{ color: SAGE }}>{d.author}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BACK + CTA */}
      <section style={{ background: NAVY }}>
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/biblia"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'rgba(246,243,235,0.88)' }}>
            <ArrowLeft size={12} /> Volver a Biblia
          </Link>
          <Link href="/registro"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl"
            style={{ background: TEAL, color: NAVY }}>
            Unirme a la comunidad <ArrowRight size={12} />
          </Link>
        </div>
      </section>

    </div>
  )
}
