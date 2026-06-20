import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Play, Calendar, User } from 'lucide-react'
import { cmsById, cmsGet, cmsImageUrl, type DPredica } from '@/lib/directus'
import VideoPlayer from '@/components/VideoPlayer'

export const revalidate = 300

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
function fmtDate(d: string) {
  const dt = new Date(d)
  return `${dt.getUTCDate()} de ${MESES[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
}

function getYoutubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default async function PredicaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const item = await cmsById<DPredica>('predicas', id)
  if (!item) notFound()

  const related = await cmsGet<DPredica>('predicas', {
    'sort': '-date_created',
    'limit': '4',
  })
  const relatedFiltered = related.filter(p => String(p.id) !== id).slice(0, 3)

  const ytId     = getYoutubeId(item.video_url)
  const thumbUrl = cmsImageUrl(item.thumbnail) ?? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)

  return (
    <div>

      {/* NAV */}
      <div style={{ background: '#051828', borderBottom: '1px solid rgba(118,171,174,0.10)' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <Link href="/en-vivo"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition"
            style={{ color: `${TEAL}70` }}>
            <ArrowLeft size={11} /> En Vivo / Prédicas
          </Link>
          {item.series && (
            <>
              <span style={{ color: 'rgba(118,171,174,0.25)' }}>/</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: 'rgba(246,243,235,0.82)' }}>{item.series}</span>
            </>
          )}
        </div>
      </div>

      {/* VIDEO PLAYER */}
      {ytId ? (
        <div style={{ background: '#000' }}>
          <div className="max-w-5xl mx-auto">
            <VideoPlayer ytId={ytId} thumbnail={thumbUrl} title={item.title} />
          </div>
        </div>
      ) : thumbUrl ? (
        <div style={{ background: '#000', maxHeight: 480, overflow: 'hidden' }}>
          <img src={thumbUrl} alt={item.title} className="w-full object-cover" style={{ maxHeight: 480 }} />
        </div>
      ) : null}

      {/* META */}
      <section style={{ background: '#051828' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">
          {item.series && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 text-[9px] font-black uppercase tracking-[0.25em]"
              style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}>
              {item.series}
            </div>
          )}

          <h1 className="font-display font-black tracking-tighter text-white mb-6"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 pt-5"
            style={{ borderTop: '1px solid rgba(118,171,174,0.15)' }}>
            {item.speaker && (
              <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.86)' }}>
                <User size={12} />
                <span className="text-[12px] font-bold">{item.speaker}</span>
              </div>
            )}
            {item.date && (
              <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.84)' }}>
                <Calendar size={12} />
                <span className="text-[12px]">{fmtDate(item.date)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {item.description && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
            {item.description.split('\n\n').map((p: string, i: number) =>
              p.trim() ? (
                <p key={i} className="mb-6 text-base leading-relaxed" style={{ color: `${NAVY}85` }}>
                  {p}
                </p>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* MORE */}
      {relatedFiltered.length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-5xl mx-auto px-6 py-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-8" style={{ color: SAGE }}>
              — Más prédicas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedFiltered.map(r => {
                const rYtId = getYoutubeId(r.video_url)
                const rThumb = cmsImageUrl(r.thumbnail) ?? (rYtId ? `https://img.youtube.com/vi/${rYtId}/mqdefault.jpg` : null)
                return (
                  <Link key={r.id} href={`/predicas/${r.id}`}
                    className="group block rounded-2xl overflow-hidden transition"
                    style={{ border: '1px solid #D2CDB8', background: CREAM }}>
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: NAVY }}>
                      {rThumb && (
                        <img src={rThumb} alt={r.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/20 transition">
                          <Play size={12} className="text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-sm tracking-tight leading-tight group-hover:opacity-70 transition" style={{ color: NAVY }}>
                        {r.title}
                      </h3>
                      {r.speaker && (
                        <p className="text-[11px] mt-1" style={{ color: SAGE }}>{r.speaker}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* BACK + CTA */}
      <section style={{ background: NAVY }}>
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/en-vivo"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition"
            style={{ color: 'rgba(246,243,235,0.88)' }}>
            <ArrowLeft size={12} /> Volver a Prédicas
          </Link>
          <Link href="/registro"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl transition"
            style={{ background: TEAL, color: NAVY }}>
            Unirme a la comunidad <ArrowRight size={12} />
          </Link>
        </div>
      </section>

    </div>
  )
}
