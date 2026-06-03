import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const STATUS_LABEL: Record<string, string> = { active: 'En curso', upcoming: 'Próximamente', archived: 'Completada' }
const STATUS_COLOR: Record<string, string> = { active: '#76ABAE', upcoming: SAGE, archived: '#94A3B8' }

export default async function SeriesPage({ params }: { params: Promise<{ seriesSlug: string }> }) {
  const { seriesSlug } = await params
  const supabase = await createClient()

  const { data: series } = await supabase
    .from('bible_study_series')
    .select('*')
    .eq('slug', seriesSlug)
    .eq('is_active', true)
    .single()

  if (!series) notFound()

  const { data: sessions } = await supabase
    .from('bible_study_sessions')
    .select('id, title, slug, reference, summary, order_index')
    .eq('series_id', series.id)
    .eq('is_active', true)
    .order('order_index')

  const color = series.cover_color || TEAL

  return (
    <div>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: '#051828' }}>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 60% 80% at 70% 40%, ${color}18, transparent 70%)` }} />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-36 md:pb-20">
          <div className="flex items-center gap-3 mb-10">
            <Link href="/educacion/estudio-biblico"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition"
              style={{ color: `${TEAL}60` }}>
              <ArrowLeft size={11} /> Estudio Bíblico
            </Link>
            <span style={{ color: `${TEAL}30` }}>/</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: `${TEAL}60` }}>
              {series.book || series.title}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ background: `${STATUS_COLOR[series.status]}20`, color: STATUS_COLOR[series.status], border: `1px solid ${STATUS_COLOR[series.status]}30` }}>
                  {STATUS_LABEL[series.status] ?? series.status}
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.45em] mb-4" style={{ color: `${color}80` }}>
                {series.book}
              </p>
              <h1 className="font-display font-black tracking-tighter text-white mb-4"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.85 }}>
                {series.theme || series.title}
              </h1>
            </div>
            <div>
              {series.description && (
                <p className="text-base leading-relaxed" style={{ color: 'rgba(246,243,235,0.55)' }}>
                  {series.description}
                </p>
              )}
              <div className="mt-6 flex items-center gap-2">
                <BookOpen size={14} style={{ color: `${TEAL}60` }} />
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: `${TEAL}60` }}>
                  {sessions?.length ?? 0} sesiones
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSION LIST */}
      <section style={{ background: '#EDEAE0' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="mb-12 pb-7" style={{ borderBottom: '1px solid #D2CDB8' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: SAGE }}>— Sesiones</p>
            <h2 className="font-display font-black tracking-tighter"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 0.9, color: NAVY }}>
              Contenido de<br />esta serie.
            </h2>
          </div>

          {!sessions || sessions.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: CREAM, border: '1px solid #D2CDB8' }}>
              <BookOpen size={28} style={{ color: `${NAVY}30`, margin: '0 auto 0.75rem' }} />
              <p className="font-bold" style={{ color: `${NAVY}60` }}>Las sesiones se publicarán pronto.</p>
              <p className="text-sm mt-1" style={{ color: `${NAVY}40` }}>Esta serie está en preparación.</p>
            </div>
          ) : (
            <div className="space-y-px rounded-2xl overflow-hidden" style={{ border: '1px solid #D2CDB8' }}>
              {sessions.map((sess: any, idx: number) => (
                <Link
                  key={sess.id}
                  href={`/educacion/estudio-biblico/${seriesSlug}/${sess.slug}`}
                  className="group flex flex-col md:flex-row md:items-center gap-3 md:gap-8 px-6 md:px-8 py-5 md:py-6 transition hover:bg-white"
                  style={{ background: idx % 2 === 0 ? CREAM : '#F4F1E8', textDecoration: 'none' }}>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[9px] font-black tracking-widest w-6 text-right" style={{ color: '#D2CDB8' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <CheckCircle2 size={16} style={{ color: `${color}50` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <h3 className="font-black text-[15px] tracking-tight" style={{ color: NAVY }}>{sess.title}</h3>
                      {sess.reference && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: `${color}15`, color }}>
                          {sess.reference}
                        </span>
                      )}
                    </div>
                    {sess.summary && (
                      <p className="text-[12px] leading-snug line-clamp-1" style={{ color: `${NAVY}60` }}>
                        {sess.summary}
                      </p>
                    )}
                  </div>
                  <ArrowRight size={14} style={{ color: TEAL, flexShrink: 0 }}
                    className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center gap-4">
            <Link href="/educacion/estudio-biblico"
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition"
              style={{ background: NAVY, color: CREAM }}>
              <ArrowLeft size={12} /> Todas las series
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
