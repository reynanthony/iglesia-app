import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Radio, Clock, FileText } from 'lucide-react'
import LivePlayer from '@/components/LivePlayer'

const P = {
  bg: '#060E07', surface: '#0D1A0E',
  sage: '#869B7E', teal: '#76ABAE', gold: '#C9A227',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.45)', border: 'rgba(134,155,126,0.15)',
}

const TYPE_LABELS: Record<string, string> = {
  clase: 'Clase', mentoria: 'Mentoría', conversatorio: 'Conversatorio', preguntas: 'Q&A',
}

export default async function PastoralEncuentroPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: enc } = await supabase
    .from('pastoral_encounters')
    .select('*')
    .eq('id', id)
    .single()

  if (!enc) notFound()

  const isLive     = enc.status === 'live'
  const isFinished = enc.status === 'finished'
  const resources: Array<{ label: string; url: string }> =
    Array.isArray(enc.resources_json) ? enc.resources_json : []

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${P.border}` }}>
        <Link href="/app/pastoral/encuentros"
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: P.surface }}>
          <ArrowLeft size={15} style={{ color: P.muted }} />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>
            {TYPE_LABELS[enc.type] ?? 'Encuentro'}
          </p>
          <h1 className="font-black text-[16px] tracking-tight leading-tight truncate">{enc.title}</h1>
        </div>
        {isLive && (
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171', border: '1px solid rgba(248,113,113,0.30)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            En Vivo
          </span>
        )}
      </div>

      {/* Video */}
      {enc.live_url && (isLive || isFinished) && (
        <div className="bg-black" style={{ aspectRatio: '16/9', maxHeight: 360 }}>
          <LivePlayer url={enc.live_url} title={enc.title} />
        </div>
      )}

      {/* Scheduled — no stream yet */}
      {enc.status === 'scheduled' && (
        <div className="flex flex-col items-center justify-center py-16 px-4"
          style={{ borderBottom: `1px solid ${P.border}` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: P.surface }}>
            <Clock size={22} style={{ color: P.teal }} />
          </div>
          <p className="font-black text-lg text-center" style={{ color: P.cream }}>Encuentro próximo</p>
          {enc.scheduled_at && (
            <p className="text-sm mt-2 text-center" style={{ color: P.muted }}>
              {new Date(enc.scheduled_at).toLocaleDateString('es-DO', {
                weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          )}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Description */}
        {enc.description && (
          <p className="text-[14px] leading-relaxed" style={{ color: P.muted }}>{enc.description}</p>
        )}

        {/* Notes */}
        {enc.notes_markdown && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={13} style={{ color: P.sage }} />
              <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>
                Notas del encuentro
              </p>
            </div>
            <div className="p-5 rounded-2xl" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
              <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-sans"
                style={{ color: P.muted }}>
                {enc.notes_markdown}
              </pre>
            </div>
          </section>
        )}

        {/* Resources */}
        {resources.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3"
              style={{ color: 'rgba(246,243,235,0.25)' }}>— Recursos</p>
            <div className="space-y-2">
              {resources.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl transition"
                  style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.teal }}>
                  <FileText size={14} />
                  <span className="text-[13px] font-bold">{r.label}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Prayer CTA */}
        <Link href="/app/oracion/nueva"
          className="flex items-center justify-center gap-2 py-4 rounded-2xl text-[13px] font-bold w-full transition"
          style={{ background: P.surface, border: `1px solid ${P.border}`, color: P.muted }}>
          🙏 Enviar petición de oración
        </Link>

      </div>
    </div>
  )
}
