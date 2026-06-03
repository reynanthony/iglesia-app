import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Trash2, Plus, BookMarked, Zap } from 'lucide-react'
import {
  updateLesson, deleteLesson,
  addBibleVerse, deleteBibleVerse,
  addChallenge, deleteChallenge,
} from '@/app/actions/discipleship-lms'

export default async function EditLeccionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lesson } = await supabase
    .from('discipleship_lessons')
    .select('*, discipleship_courses(id, title, discipleship_programs(id, title))')
    .eq('id', id)
    .single()

  if (!lesson) notFound()

  const [{ data: verses }, { data: challenges }] = await Promise.all([
    supabase.from('lesson_bible_verses').select('*').eq('lesson_id', id).order('order_index'),
    supabase.from('lesson_challenges').select('*').eq('lesson_id', id).order('order_index'),
  ])

  const course  = lesson.discipleship_courses as any
  const program = course?.discipleship_programs as any

  const saveAction   = updateLesson.bind(null, id, course?.id ?? '')
  const deleteAction = deleteLesson.bind(null, id, course?.id ?? '')
  const addVerseAction = addBibleVerse.bind(null, id)
  const addChallengeAction = addChallenge.bind(null, id)

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.40)' }

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href={`/admin/discipulado/cursos/${course?.id}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs mb-0.5 flex-wrap" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Link href="/admin/discipulado/programas" className="hover:underline">Programas</Link>
              <span>/</span>
              <Link href={`/admin/discipulado/programas/${program?.id}`} className="hover:underline truncate max-w-[80px]">
                {program?.title}
              </Link>
              <span>/</span>
              <Link href={`/admin/discipulado/cursos/${course?.id}`} className="hover:underline truncate max-w-[80px]">
                {course?.title}
              </Link>
              <span>/</span>
              <span className="truncate max-w-[100px]">{lesson.title}</span>
            </div>
            <h1 className="font-bold text-lg truncate" style={{ color: '#F6F3EB' }}>{lesson.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">

        {/* ── Contenido de la lección ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.35)' }}>
            Contenido
          </p>
          <div className="rounded-2xl p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <form action={saveAction} className="space-y-4">

              <div>
                <label className={label} style={labelStyle}>Título *</label>
                <input name="title" required defaultValue={lesson.title}
                  className={field} style={fieldStyle} />
              </div>

              <div>
                <label className={label} style={labelStyle}>Cuerpo (soporta markdown)</label>
                <textarea
                  name="body"
                  rows={12}
                  defaultValue={lesson.body ?? ''}
                  placeholder="Escribe el contenido de la lección. Soporta **negrita**, _cursiva_, ## títulos, listas, etc."
                  className={`${field} resize-y font-mono text-xs leading-relaxed`}
                  style={fieldStyle}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={label} style={labelStyle}>URL de video (YouTube / Vimeo)</label>
                  <input name="video_url" type="url" defaultValue={lesson.video_url ?? ''}
                    placeholder="https://youtube.com/watch?v=..."
                    className={field} style={fieldStyle} />
                </div>
                <div>
                  <label className={label} style={labelStyle}>URL de PDF</label>
                  <input name="pdf_url" type="url" defaultValue={lesson.pdf_url ?? ''}
                    placeholder="https://drive.google.com/..."
                    className={field} style={fieldStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label} style={labelStyle}>Orden</label>
                  <input name="order_index" type="number" defaultValue={lesson.order_index}
                    className={field} style={fieldStyle} />
                </div>
                <div>
                  <label className={label} style={labelStyle}>Estado</label>
                  <select name="is_active" defaultValue={lesson.is_active ? 'true' : 'false'}
                    className={field} style={fieldStyle}>
                    <option value="true">Activa</option>
                    <option value="false">Inactiva</option>
                  </select>
                </div>
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold"
                style={{ background: '#F6F3EB', color: '#061E30' }}>
                Guardar lección
              </button>
            </form>
            <form action={deleteAction} className="mt-2">
              <button type="submit"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                <Trash2 size={13} /> Eliminar lección
              </button>
            </form>
          </div>
        </section>

        {/* ── Versículos base ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.35)' }}>
            <BookMarked size={10} className="inline mr-1.5" />
            Versículos base ({verses?.length ?? 0})
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            {verses && verses.length > 0 && (
              <div className="divide-y" style={{ borderColor: '#0D3352' }}>
                {verses.map((v: any) => {
                  const delVerseAction = deleteBibleVerse.bind(null, v.id, id)
                  return (
                    <div key={v.id} className="flex items-start gap-4 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black mb-1" style={{ color: '#76ABAE' }}>{v.reference}</p>
                        <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(246,243,235,0.70)' }}>
                          "{v.verse_text}"
                        </p>
                      </div>
                      <form action={delVerseAction} className="flex-shrink-0">
                        <button type="submit"
                          className="p-2 rounded-lg transition"
                          style={{ color: 'rgba(248,113,113,0.50)' }}
                          title="Eliminar versículo">
                          <Trash2 size={13} />
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="px-5 py-4" style={{ borderTop: verses && verses.length > 0 ? '1px solid #0D3352' : 'none' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-3"
                style={{ color: 'rgba(246,243,235,0.30)' }}>
                <Plus size={9} className="inline mr-1" /> Agregar versículo
              </p>
              <form action={addVerseAction} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={label} style={labelStyle}>Referencia *</label>
                    <input name="reference" required placeholder="Ej: Juan 3:16"
                      className={field} style={fieldStyle} />
                  </div>
                  <div>
                    <label className={label} style={labelStyle}>Texto del versículo *</label>
                    <input name="verse_text" required placeholder="Porque de tal manera amó Dios…"
                      className={field} style={fieldStyle} />
                  </div>
                </div>
                <button type="submit"
                  className="w-full py-2 rounded-xl text-xs font-bold"
                  style={{ background: 'rgba(118,171,174,0.10)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.20)' }}>
                  Agregar versículo
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── Desafíos prácticos ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.35)' }}>
            <Zap size={10} className="inline mr-1.5" />
            Desafíos prácticos ({challenges?.length ?? 0})
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            {challenges && challenges.length > 0 && (
              <div className="divide-y" style={{ borderColor: '#0D3352' }}>
                {challenges.map((c: any) => {
                  const delChallengeAction = deleteChallenge.bind(null, c.id, id)
                  return (
                    <div key={c.id} className="flex items-start gap-4 px-5 py-4">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-black mt-0.5"
                        style={{ background: 'rgba(118,171,174,0.12)', color: '#76ABAE' }}
                      >
                        S{c.week_number}
                      </div>
                      <p className="flex-1 text-sm leading-relaxed" style={{ color: 'rgba(246,243,235,0.80)' }}>
                        {c.description}
                      </p>
                      <form action={delChallengeAction} className="flex-shrink-0">
                        <button type="submit"
                          className="p-2 rounded-lg transition"
                          style={{ color: 'rgba(248,113,113,0.50)' }}
                          title="Eliminar desafío">
                          <Trash2 size={13} />
                        </button>
                      </form>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="px-5 py-4" style={{ borderTop: challenges && challenges.length > 0 ? '1px solid #0D3352' : 'none' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-3"
                style={{ color: 'rgba(246,243,235,0.30)' }}>
                <Plus size={9} className="inline mr-1" /> Agregar desafío
              </p>
              <form action={addChallengeAction} className="space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className={label} style={labelStyle}>Semana</label>
                    <input name="week_number" type="number" defaultValue={1} min={1}
                      className={field} style={fieldStyle} />
                  </div>
                  <div className="col-span-3">
                    <label className={label} style={labelStyle}>Descripción del desafío *</label>
                    <input name="description" required
                      placeholder="Ej: Ora 15 minutos cada mañana esta semana…"
                      className={field} style={fieldStyle} />
                  </div>
                </div>
                <button type="submit"
                  className="w-full py-2 rounded-xl text-xs font-bold"
                  style={{ background: 'rgba(118,171,174,0.10)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.20)' }}>
                  Agregar desafío
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
