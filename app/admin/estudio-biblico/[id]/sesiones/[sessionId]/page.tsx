import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { updateSession } from '@/app/actions/bible-study'

const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
const labelStyle = { color: 'rgba(246,243,235,0.68)' }
const hint = "text-[10px] mt-1.5"
const hintStyle = { color: 'rgba(246,243,235,0.25)' }

export default async function EditarSesionPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>
}) {
  const { id, sessionId } = await params
  const supabase = await createClient()

  const [{ data: series }, { data: session }] = await Promise.all([
    supabase.from('bible_study_series').select('id, title').eq('id', id).single(),
    supabase.from('bible_study_sessions')
      .select('*, bible_study_questions(id, question, order_index)')
      .eq('id', sessionId)
      .eq('series_id', id)
      .single(),
  ])

  if (!series || !session) notFound()

  const questions = [...(session.bible_study_questions ?? [])].sort(
    (a: any, b: any) => a.order_index - b.order_index
  )
  const questionsText = questions.map((q: any) => q.question).join('\n')
  const objectivesText = (session.objectives ?? []).join('\n')

  const updateAction = updateSession.bind(null, sessionId, id)

  return (
    <div>
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href={`/admin/estudio-biblico/${id}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.68)' }} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs mb-0.5" style={{ color: 'rgba(246,243,235,0.62)' }}>
              <Link href="/admin/estudio-biblico" className="hover:underline">Estudio Bíblico</Link>
              <span>/</span>
              <Link href={`/admin/estudio-biblico/${id}`} className="hover:underline truncate max-w-[8rem]">{series.title}</Link>
              <span>/</span>
              <span className="truncate max-w-[8rem]">{session.title}</span>
            </div>
            <h1 className="font-bold text-lg" style={{ color: '#F6F3EB' }}>Editar sesión</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
        <form action={updateAction} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Título *</label>
              <input name="title" required defaultValue={session.title}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Referencia bíblica</label>
              <input name="reference" defaultValue={session.reference ?? ''}
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Slug (URL)</label>
              <input name="slug" defaultValue={session.slug}
                className={field} style={fieldStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Orden</label>
              <input name="order_index" type="number" defaultValue={session.order_index}
                className={field} style={fieldStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={labelStyle}>Resumen</label>
            <textarea name="summary" rows={2} defaultValue={session.summary ?? ''}
              className={`${field} resize-none`} style={fieldStyle} />
          </div>

          <div>
            <label className={label} style={labelStyle}>Objetivos</label>
            <textarea name="objectives" rows={4} defaultValue={objectivesText}
              className={`${field} resize-none`} style={fieldStyle} />
            <p className={hint} style={hintStyle}>Un objetivo por línea.</p>
          </div>

          <div>
            <label className={label} style={labelStyle}>Contenido</label>
            <textarea name="content" rows={16} defaultValue={session.content ?? ''}
              className={`${field} resize-y`}
              style={{ ...fieldStyle, fontFamily: 'inherit', lineHeight: '1.7' }} />
            <p className={hint} style={hintStyle}>Separa párrafos con una línea en blanco.</p>
          </div>

          <div>
            <label className={label} style={labelStyle}>Preguntas de discusión</label>
            <textarea name="questions" rows={5} defaultValue={questionsText}
              className={`${field} resize-none`} style={fieldStyle} />
            <p className={hint} style={hintStyle}>Una pregunta por línea. Se reemplazarán todas al guardar.</p>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input name="is_active" type="checkbox" id="is_active" value="true"
              defaultChecked={session.is_active} className="rounded" />
            <label htmlFor="is_active" className={label} style={{ ...labelStyle, margin: 0 }}>
              Visible en el sitio público
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: '#F6F3EB', color: '#061E30' }}>
              Guardar cambios
            </button>
            <Link href={`/admin/estudio-biblico/${id}`}
              className="px-5 py-3 rounded-xl text-sm font-medium text-center"
              style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.68)' }}>
              Cancelar
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}
