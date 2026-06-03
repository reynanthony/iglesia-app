import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, Target, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

export default async function SessionPage({
  params,
}: {
  params: Promise<{ seriesSlug: string; sessionSlug: string }>
}) {
  const { seriesSlug, sessionSlug } = await params
  const supabase = await createClient()

  const { data: series } = await supabase
    .from('bible_study_series')
    .select('id, title, slug, book, theme, cover_color')
    .eq('slug', seriesSlug)
    .eq('is_active', true)
    .single()

  if (!series) notFound()

  const { data: session } = await supabase
    .from('bible_study_sessions')
    .select('*, bible_study_questions(id, question, order_index)')
    .eq('series_id', series.id)
    .eq('slug', sessionSlug)
    .eq('is_active', true)
    .single()

  if (!session) notFound()

  // Prev / next session
  const { data: allSessions } = await supabase
    .from('bible_study_sessions')
    .select('id, slug, title, order_index')
    .eq('series_id', series.id)
    .eq('is_active', true)
    .order('order_index')

  const idx = (allSessions ?? []).findIndex((s: any) => s.id === session.id)
  const prev = idx > 0 ? allSessions![idx - 1] : null
  const next = idx < (allSessions?.length ?? 0) - 1 ? allSessions![idx + 1] : null

  const color = series.cover_color || TEAL
  const questions = [...(session.bible_study_questions ?? [])].sort(
    (a: any, b: any) => a.order_index - b.order_index
  )

  return (
    <div style={{ background: '#EDEAE0' }}>

      {/* Header bar */}
      <div style={{ background: '#051828', borderBottom: '1px solid rgba(118,171,174,0.12)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3 flex-wrap">
          <Link href="/educacion/estudio-biblico"
            className="text-[10px] font-bold uppercase tracking-[0.3em] transition hover:opacity-80"
            style={{ color: `${TEAL}60` }}>
            Estudio Bíblico
          </Link>
          <span style={{ color: `${TEAL}30` }}>/</span>
          <Link href={`/educacion/estudio-biblico/${seriesSlug}`}
            className="text-[10px] font-bold uppercase tracking-[0.3em] transition hover:opacity-80"
            style={{ color: `${TEAL}60` }}>
            {series.book || series.title}
          </Link>
          <span style={{ color: `${TEAL}30` }}>/</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: `${TEAL}90` }}>
            {session.title}
          </span>
        </div>
      </div>

      {/* Session header */}
      <div style={{ background: '#051828' }}>
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-14 md:pt-16 md:pb-20">
          {session.reference && (
            <span className="inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-6"
              style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
              {session.reference}
            </span>
          )}
          <h1 className="font-display font-black tracking-tighter text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', lineHeight: 0.85 }}>
            {session.title}
          </h1>
          {session.summary && (
            <p className="text-base leading-relaxed max-w-2xl mt-6"
              style={{ color: 'rgba(246,243,235,0.55)' }}>
              {session.summary}
            </p>
          )}
          <div className="flex items-center gap-2 mt-6">
            <BookOpen size={13} style={{ color: `${TEAL}60` }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `${TEAL}60` }}>
              Sesión {idx + 1} de {allSessions?.length ?? '?'}
            </span>
          </div>
        </div>
      </div>

      {/* Objectives */}
      {session.objectives && session.objectives.length > 0 && (
        <div style={{ background: CREAM, borderBottom: '1px solid #D2CDB8' }}>
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex items-center gap-3 mb-6">
              <Target size={16} style={{ color: TEAL }} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: SAGE }}>
                Objetivos de la sesión
              </p>
            </div>
            <ul className="space-y-3">
              {session.objectives.map((obj: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[9px] font-black mt-0.5 flex-shrink-0" style={{ color: `${color}60` }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: NAVY }}>{obj}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main content */}
      {session.content && (
        <div style={{ background: '#EDEAE0' }}>
          <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">
            <div className="prose-content max-w-none">
              {session.content.split('\n\n').map((para: string, i: number) => (
                para.trim() ? (
                  <p key={i} className="text-base leading-[1.85] mb-6"
                    style={{ color: '#1a2a38' }}>
                    {para.trim()}
                  </p>
                ) : null
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Discussion questions */}
      {questions.length > 0 && (
        <div style={{ background: NAVY }}>
          <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">
            <div className="flex items-center gap-3 mb-10">
              <MessageCircle size={18} style={{ color: TEAL }} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: `${TEAL}60` }}>
                  Para reflexionar
                </p>
                <h2 className="font-display font-black tracking-tighter text-white"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 0.9 }}>
                  Preguntas de<br />discusión.
                </h2>
              </div>
            </div>
            <div className="space-y-5">
              {questions.map((q: any, i: number) => (
                <div key={q.id} className="flex items-start gap-5 p-6 rounded-2xl"
                  style={{ background: 'rgba(118,171,174,0.08)', border: '1px solid rgba(118,171,174,0.12)' }}>
                  <span className="font-black text-2xl flex-shrink-0" style={{ color: `${TEAL}30` }}>
                    {i + 1}
                  </span>
                  <p className="text-base leading-relaxed" style={{ color: 'rgba(246,243,235,0.80)' }}>
                    {q.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prev / Next navigation */}
      <div style={{ background: '#051828', borderTop: '1px solid rgba(118,171,174,0.12)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            {prev ? (
              <Link href={`/educacion/estudio-biblico/${seriesSlug}/${prev.slug}`}
                className="flex items-center gap-3 group"
                style={{ textDecoration: 'none' }}>
                <ArrowLeft size={14} style={{ color: `${TEAL}60` }}
                  className="group-hover:-translate-x-1 transition-transform" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider mb-0.5"
                    style={{ color: `${TEAL}50` }}>Anterior</p>
                  <p className="text-sm font-bold" style={{ color: 'rgba(246,243,235,0.70)' }}>
                    {prev.title}
                  </p>
                </div>
              </Link>
            ) : (
              <Link href={`/educacion/estudio-biblico/${seriesSlug}`}
                className="flex items-center gap-2 text-[11px] font-bold"
                style={{ color: `${TEAL}60`, textDecoration: 'none' }}>
                <ArrowLeft size={12} /> Ver todas
              </Link>
            )}

            {next ? (
              <Link href={`/educacion/estudio-biblico/${seriesSlug}/${next.slug}`}
                className="flex items-center gap-3 text-right group"
                style={{ textDecoration: 'none' }}>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider mb-0.5"
                    style={{ color: `${TEAL}50` }}>Siguiente</p>
                  <p className="text-sm font-bold" style={{ color: 'rgba(246,243,235,0.70)' }}>
                    {next.title}
                  </p>
                </div>
                <ArrowRight size={14} style={{ color: `${TEAL}60` }}
                  className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link href={`/educacion/estudio-biblico/${seriesSlug}`}
                className="flex items-center gap-2 text-[11px] font-bold"
                style={{ color: `${TEAL}60`, textDecoration: 'none' }}>
                Ver todas <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
