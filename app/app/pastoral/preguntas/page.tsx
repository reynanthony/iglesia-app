import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import PastoralQuestionForm from '@/components/app/pastoral/PastoralQuestionForm'

const P = {
  bg: '#060E07', surface: '#0D1A0E',
  sage: '#869B7E', teal: '#76ABAE', gold: '#C9A227',
  cream: '#F6F3EB', muted: 'rgba(246,243,235,0.72)', border: 'rgba(134,155,126,0.15)',
}

const CAT_LABELS: Record<string, string> = {
  doctrinal: 'Doctrinal', consejo: 'Consejo', orientacion: 'Orientación', general: 'General',
}

export default async function PastoralPreguntasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: myQuestions } = await supabase
    .from('pastoral_questions')
    .select('id, question, category, status, answer_body, answer_media_url, answer_media_type, is_public, created_at, answered_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: publicQA } = await supabase
    .from('pastoral_questions')
    .select('id, question, category, answer_body, answer_media_url, answer_media_type, answered_at')
    .eq('is_public', true)
    .eq('status', 'answered')
    .order('answered_at', { ascending: false })
    .limit(10)

  return (
    <div style={{ background: P.bg, minHeight: '100%', color: P.cream }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${P.border}` }}>
        <Link href="/app/pastoral" className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: P.surface }}>
          <ArrowLeft size={15} style={{ color: P.muted }} />
        </Link>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: P.sage }}>Pastoral Room</p>
          <h1 className="font-black text-[17px] tracking-tight">Pregunta al Pastor</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Formulario */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4"
            style={{ color: P.sage }}>— Envía tu pregunta</p>
          <div className="p-5 rounded-2xl" style={{ background: P.surface, border: `1px solid ${P.border}` }}>
            <PastoralQuestionForm userId={user.id} />
          </div>
        </section>

        {/* Mis preguntas */}
        {myQuestions && myQuestions.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4"
              style={{ color: 'rgba(246,243,235,0.25)' }}>— Mis preguntas</p>
            <div className="space-y-3">
              {myQuestions.map(q => (
                <div key={q.id} className="rounded-2xl p-4"
                  style={{ background: P.surface, border: `1px solid ${P.border}` }}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: '#061E30', color: 'rgba(118,171,174,0.60)' }}>
                          {CAT_LABELS[q.category] ?? q.category}
                        </span>
                        {q.status === 'answered'
                          ? <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: P.teal }}>
                              <CheckCircle size={10} /> Respondida
                            </span>
                          : <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
                              <Clock size={10} /> Pendiente
                            </span>}
                      </div>
                      <p className="text-[13px] leading-relaxed" style={{ color: P.muted }}>{q.question}</p>
                    </div>
                  </div>
                  {q.status === 'answered' && q.answer_body && (
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${P.border}` }}>
                      <p className="text-[11px] font-black uppercase tracking-wider mb-1.5"
                        style={{ color: P.sage }}>Respuesta del pastor</p>
                      <p className="text-[13px] leading-relaxed" style={{ color: P.muted }}>{q.answer_body}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Preguntas públicas */}
        {publicQA && publicQA.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-4"
              style={{ color: P.gold }}>— Preguntas respondidas (públicas)</p>
            <div className="space-y-3">
              {publicQA.map(q => (
                <div key={q.id} className="rounded-2xl p-4"
                  style={{ background: 'rgba(201,162,39,0.04)', border: '1px solid rgba(201,162,39,0.15)' }}>
                  <p className="text-[13px] font-bold mb-2" style={{ color: P.cream }}>{q.question}</p>
                  {q.answer_body && (
                    <p className="text-[12px] leading-relaxed" style={{ color: P.muted }}>{q.answer_body}</p>
                  )}
                  {q.answered_at && (
                    <p className="text-[10px] mt-2" style={{ color: 'rgba(246,243,235,0.25)' }}>
                      {new Date(q.answered_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'long' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
