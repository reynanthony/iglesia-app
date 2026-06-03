import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Plus, BookOpen, Trash2, ChevronRight, Video, FileText } from 'lucide-react'
import { updateCourse, deleteCourse, createLesson } from '@/app/actions/discipleship-lms'

export default async function EditCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('discipleship_courses')
    .select('*, discipleship_programs(id, title)')
    .eq('id', id)
    .single()

  if (!course) notFound()

  const { data: lessons } = await supabase
    .from('discipleship_lessons')
    .select('*')
    .eq('course_id', id)
    .order('order_index')

  const program = course.discipleship_programs as any
  const saveAction = updateCourse.bind(null, id, program?.id ?? '')
  const deleteAction = deleteCourse.bind(null, id, program?.id ?? '')
  const newLessonAction = createLesson.bind(null, id)

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: '#061E30', borderColor: '#0D3352', color: '#F6F3EB' }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: 'rgba(246,243,235,0.40)' }

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#0D3352' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href={`/admin/discipulado/programas/${program?.id}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#0B2D47' }}>
            <ArrowLeft size={14} style={{ color: 'rgba(246,243,235,0.40)' }} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs mb-0.5 flex-wrap" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Link href="/admin/discipulado" className="hover:underline">Discipulado</Link>
              <span>/</span>
              <Link href="/admin/discipulado/programas" className="hover:underline">Programas</Link>
              <span>/</span>
              <Link href={`/admin/discipulado/programas/${program?.id}`} className="hover:underline truncate max-w-[120px]">
                {program?.title}
              </Link>
              <span>/</span>
              <span className="truncate">{course.title}</span>
            </div>
            <h1 className="font-bold text-lg truncate" style={{ color: '#F6F3EB' }}>{course.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">

        {/* ── Editar curso ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.35)' }}>
            Datos del curso
          </p>
          <div className="rounded-2xl p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <form action={saveAction} className="space-y-4">

              <div>
                <label className={label} style={labelStyle}>Título *</label>
                <input name="title" required defaultValue={course.title}
                  className={field} style={fieldStyle} />
              </div>

              <div>
                <label className={label} style={labelStyle}>Descripción</label>
                <textarea name="description" rows={2} defaultValue={course.description ?? ''}
                  className={`${field} resize-none`} style={fieldStyle} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={label} style={labelStyle}>Autor</label>
                  <input name="author" defaultValue={course.author ?? ''}
                    placeholder="Ej: Pastor Principal"
                    className={field} style={fieldStyle} />
                </div>
                <div>
                  <label className={label} style={labelStyle}>Nivel</label>
                  <select name="level" defaultValue={course.level}
                    className={field} style={fieldStyle}>
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
                <div>
                  <label className={label} style={labelStyle}>Duración (min)</label>
                  <input name="duration_minutes" type="number" defaultValue={course.duration_minutes ?? 0}
                    className={field} style={fieldStyle} />
                </div>
                <div>
                  <label className={label} style={labelStyle}>Orden</label>
                  <input name="order_index" type="number" defaultValue={course.order_index}
                    className={field} style={fieldStyle} />
                </div>
              </div>

              <div>
                <label className={label} style={labelStyle}>Estado</label>
                <select name="is_active" defaultValue={course.is_active ? 'true' : 'false'}
                  className={`${field} max-w-xs`} style={fieldStyle}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold"
                style={{ background: '#F6F3EB', color: '#061E30' }}>
                Guardar cambios
              </button>
            </form>
            <form action={deleteAction} className="mt-2">
              <button type="submit"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                <Trash2 size={13} /> Eliminar curso
              </button>
            </form>
          </div>
        </section>

        {/* ── Lecciones ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.35)' }}>
            Lecciones ({lessons?.length ?? 0})
          </p>

          {lessons && lessons.length > 0 && (
            <div className="space-y-2 mb-4">
              {lessons.map((l: any) => (
                <Link
                  key={l.id}
                  href={`/admin/discipulado/lecciones/${l.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 rounded-xl transition hover:brightness-110"
                  style={{ background: '#061E30', border: '1px solid #0D3352' }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{ background: '#0D3352', color: '#76ABAE' }}
                  >
                    {l.order_index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: '#F6F3EB' }}>{l.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {l.video_url && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(118,171,174,0.70)' }}>
                          <Video size={10} /> Video
                        </span>
                      )}
                      {l.pdf_url && (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(118,171,174,0.70)' }}>
                          <FileText size={10} /> PDF
                        </span>
                      )}
                      {!l.is_active && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(248,113,113,0.12)', color: '#F87171' }}>
                          Inactiva
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'rgba(246,243,235,0.25)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}

          {/* Nueva lección */}
          <div className="rounded-2xl p-5" style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(246,243,235,0.35)' }}>
              <Plus size={10} className="inline mr-1" />
              Nueva lección
            </p>
            <form action={newLessonAction} className="space-y-4">
              <div>
                <label className={label} style={labelStyle}>Título *</label>
                <input name="title" required placeholder="Ej: El problema del pecado"
                  className={field} style={fieldStyle} />
              </div>
              <div>
                <label className={label} style={labelStyle}>Contenido (markdown)</label>
                <textarea name="body" rows={4}
                  placeholder="Escribe el contenido de la lección…"
                  className={`${field} resize-none font-mono text-xs`} style={fieldStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label} style={labelStyle}>URL de video (YouTube/Vimeo)</label>
                  <input name="video_url" type="url" placeholder="https://youtube.com/watch?v=..."
                    className={field} style={fieldStyle} />
                </div>
                <div>
                  <label className={label} style={labelStyle}>URL de PDF</label>
                  <input name="pdf_url" type="url" placeholder="https://..."
                    className={field} style={fieldStyle} />
                </div>
              </div>
              <div className="w-24">
                <label className={label} style={labelStyle}>Orden</label>
                <input name="order_index" type="number" defaultValue={(lessons?.length ?? 0) + 1}
                  className={field} style={fieldStyle} />
              </div>
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: 'rgba(118,171,174,0.15)', color: '#76ABAE', border: '1px solid rgba(118,171,174,0.25)' }}>
                <BookOpen size={14} /> Crear lección
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  )
}
