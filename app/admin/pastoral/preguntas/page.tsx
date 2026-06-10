import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { HelpCircle, CheckCircle, Clock } from 'lucide-react'
import AnswerPastoralQuestionForm from '@/components/admin/AnswerPastoralQuestionForm'

const CAT_LABELS: Record<string, string> = {
  doctrinal: 'Doctrinal', consejo: 'Consejo', orientacion: 'Orientación', general: 'General',
}

export default async function AdminPastoralPreguntasPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('pastoral_questions')
    .select('id, question, category, status, answer_body, is_public, created_at, profiles(full_name, username)')
    .order('created_at', { ascending: false })

  const pending  = items?.filter(i => i.status === 'pending') ?? []
  const answered = items?.filter(i => i.status === 'answered') ?? []

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5">
          <div className="flex items-center gap-2 mb-0.5">
            <Link href="/admin/pastoral" className="text-[13px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
              Pastoral
            </Link>
            <span style={{ color: 'rgba(246,243,235,0.20)' }}>/</span>
            <span className="text-[13px] text-white">Preguntas</span>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: '#F59E0B' }}>
              <Clock size={12} /> {pending.length} pendientes
            </span>
            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: 'rgba(118,171,174,0.60)' }}>
              <CheckCircle size={12} /> {answered.length} respondidas
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">

        {/* Pendientes */}
        {pending.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4"
              style={{ color: '#F59E0B' }}>— Pendientes de respuesta</p>
            <div className="space-y-4">
              {pending.map(item => (
                <div key={item.id} className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: '#061E30', color: 'rgba(118,171,174,0.60)' }}>
                        {CAT_LABELS[item.category] ?? item.category}
                      </span>
                      <span className="text-[11px]" style={{ color: 'rgba(246,243,235,0.62)' }}>
                        {(item as any).profiles?.full_name ?? 'Anónimo'} ·{' '}
                        {new Date(item.created_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-sm text-white leading-relaxed">{item.question}</p>
                  </div>
                  <div className="border-t px-4 py-4" style={{ borderColor: '#0D3352', background: '#061E30' }}>
                    <AnswerPastoralQuestionForm id={item.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {pending.length === 0 && (
          <div className="py-16 text-center rounded-2xl border" style={{ borderColor: '#0D3352' }}>
            <CheckCircle size={28} style={{ color: 'rgba(118,171,174,0.30)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.68)' }}>
              No hay preguntas pendientes.
            </p>
          </div>
        )}

        {/* Respondidas */}
        {answered.length > 0 && (
          <section>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4"
              style={{ color: 'rgba(118,171,174,0.50)' }}>— Respondidas</p>
            <div className="space-y-3">
              {answered.map(item => (
                <div key={item.id} className="rounded-2xl border p-4"
                  style={{ borderColor: '#0D3352', background: '#0B2D47' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white leading-relaxed">{item.question}</p>
                      {item.answer_body && (
                        <p className="text-[12px] mt-2 line-clamp-2" style={{ color: 'rgba(246,243,235,0.50)' }}>
                          R: {item.answer_body}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.is_public && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(134,155,126,0.15)', color: '#869B7E' }}>
                          Pública
                        </span>
                      )}
                      <CheckCircle size={14} style={{ color: 'rgba(118,171,174,0.50)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
