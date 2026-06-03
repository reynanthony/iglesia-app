import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Play, Calendar, User, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
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
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('ministry_content')
    .select('id, title, body, video_url, image_url, pinned, created_at, profiles(full_name, avatar_url), ministries(name, slug)')
    .eq('id', id)
    .single()

  if (!item) notFound()

  const { data: related } = await supabase
    .from('ministry_content')
    .select('id, title, video_url, image_url, created_at, ministries(name, slug)')
    .eq('type', 'video')
    .neq('id', id)
    .order('created_at', { ascending: false })
    .limit(3)

  const profile  = item.profiles as any
  const ministry = item.ministries as any
  const ytId     = getYoutubeId(item.video_url)
  const thumbUrl = item.image_url ?? (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)

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
          {ministry && (
            <>
              <span style={{ color: 'rgba(118,171,174,0.25)' }}>/</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: 'rgba(246,243,235,0.30)' }}>{ministry.name}</span>
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
          {ministry && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 text-[9px] font-black uppercase tracking-[0.25em]"
              style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}30` }}>
              <BookOpen size={10} /> {ministry.name}
            </div>
          )}

          <h1 className="font-display font-black tracking-tighter text-white mb-6"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', lineHeight: 0.9 }}>
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 pt-5"
            style={{ borderTop: '1px solid rgba(118,171,174,0.15)' }}>
            {profile?.full_name && (
              <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.65)' }}>
                <User size={12} />
                <span className="text-[12px] font-bold">{profile.full_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Calendar size={12} />
              <span className="text-[12px]">{fmtDate(item.created_at)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      {item.body && (
        <section style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
            {item.body.split('\n\n').map((p: string, i: number) =>
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
      {(related ?? []).length > 0 && (
        <section style={{ background: '#EDEAE0', borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-5xl mx-auto px-6 py-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-8" style={{ color: SAGE }}>
              — Más prédicas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(related ?? []).map((r: any) => {
                const rYtId = getYoutubeId(r.video_url)
                const rThumb = r.image_url ?? (rYtId ? `https://img.youtube.com/vi/${rYtId}/mqdefault.jpg` : null)
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
            style={{ color: 'rgba(246,243,235,0.45)' }}>
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
