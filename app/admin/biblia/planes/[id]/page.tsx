import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Plus, Wand2, Trash2 } from 'lucide-react'
import {
  updateReadingPlan, deleteReadingPlan, addReadingPlanDay, generateReadingPlanDays,
} from '@/app/actions/bible-reading-plans'
import DeleteReadingPlanDayButton from '@/components/admin/DeleteReadingPlanDayButton'
import { OT_BOOKS, NT_BOOKS } from '@/lib/bible'
import { formatDayReference } from '@/lib/bible-reading-plans'
import { BG, CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

export default async function EditPlanLecturaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: plan } = await supabase.from('bible_reading_plans').select('*').eq('id', id).single()
  if (!plan) notFound()

  const { data: days } = await supabase
    .from('bible_reading_plan_days')
    .select('*')
    .eq('plan_id', id)
    .order('day_number')

  const saveAction = updateReadingPlan.bind(null, id)
  const deleteAction = deleteReadingPlan.bind(null, id)
  const addDayAction = addReadingPlanDay.bind(null, id)
  const generateAction = generateReadingPlanDays.bind(null, id)

  const field = "w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition"
  const fieldStyle = { background: BG, borderColor: BORDER, color: INK }
  const label = "text-[10px] font-black uppercase tracking-[0.2em] block mb-2"
  const labelStyle = { color: MUTED }

  return (
    <div>
      {/* Header */}
      <div className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
          <Link href="/admin/biblia/planes"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: CARD }}>
            <ArrowLeft size={14} style={{ color: MUTED }} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs mb-0.5" style={{ color: MUTED }}>
              <Link href="/admin/biblia/planes" className="hover:underline">Planes de lectura</Link>
              <span>/</span>
              <span className="truncate">{plan.title}</span>
            </div>
            <h1 className="font-bold text-lg truncate" style={{ color: INK }}>{plan.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">

        {/* ── Datos del plan ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: MUTED }}>
            Datos del plan
          </p>
          <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <form action={saveAction} encType="multipart/form-data" className="space-y-4">

              <div>
                <label className={label} style={labelStyle}>Título *</label>
                <input name="title" required defaultValue={plan.title}
                  className={field} style={fieldStyle} />
              </div>

              <div>
                <label className={label} style={labelStyle}>Slug</label>
                <input name="slug" defaultValue={plan.slug}
                  className={field} style={fieldStyle} />
              </div>

              <div>
                <label className={label} style={labelStyle}>Descripción</label>
                <textarea name="description" rows={3} defaultValue={plan.description ?? ''}
                  className={`${field} resize-none`} style={fieldStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label} style={labelStyle}>Categoría</label>
                  <input name="category" list="categorias" defaultValue={plan.category ?? ''}
                    className={field} style={fieldStyle} />
                  <datalist id="categorias">
                    <option value="evangelios" />
                    <option value="pentateuco" />
                    <option value="sabiduria" />
                    <option value="nuevo-testamento" />
                  </datalist>
                </div>
                <div>
                  <label className={label} style={labelStyle}>Orden</label>
                  <input name="order_index" type="number" defaultValue={plan.order_index}
                    className={field} style={fieldStyle} />
                </div>
              </div>

              <div>
                <label className={label} style={labelStyle}>Estado</label>
                <select name="is_active" defaultValue={plan.is_active ? 'true' : 'false'}
                  className={`${field} max-w-xs`} style={fieldStyle}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <div>
                <label className={label} style={labelStyle}>Portada</label>
                {plan.thumbnail_url && (
                  <img src={plan.thumbnail_url} alt="" className="w-32 h-20 object-cover rounded-lg mb-2" />
                )}
                <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: BORDER }}>
                  <input type="file" name="image" accept="image/*"
                    className="w-full text-sm cursor-pointer" style={{ color: MUTED }} />
                  <p className="text-[11px] mt-2" style={{ color: MUTED }}>Deja vacío para mantener la actual</p>
                </div>
              </div>

              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold"
                style={{ background: GOLD, color: GOLD_INK }}>
                Guardar cambios
              </button>
            </form>
            <form action={deleteAction} className="mt-2">
              <button type="submit"
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: 'rgba(248,113,113,0.10)', color: '#F87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                <Trash2 size={13} /> Eliminar plan
              </button>
            </form>
          </div>
        </section>

        {/* ── Días ── */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: MUTED }}>
            Días ({plan.duration_days})
          </p>

          {days && days.length > 0 && (
            <div className="space-y-2 mb-4">
              {days.map(day => (
                <div key={day.id}
                  className="flex items-center gap-4 px-5 py-3 rounded-xl"
                  style={{ background: BG, border: `1px solid ${BORDER}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{ background: BORDER, color: GOLD }}>
                    {day.day_number}
                  </div>
                  <p className="flex-1 text-sm font-bold" style={{ color: INK }}>
                    {formatDayReference(day.book_id, day.chapter_start, day.chapter_end)}
                  </p>
                  <DeleteReadingPlanDayButton planId={id} dayId={day.id} />
                </div>
              ))}
            </div>
          )}

          {/* Agregar día manual */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: MUTED }}>
              <Plus size={10} className="inline mr-1" />
              Agregar día
            </p>
            <form action={addDayAction} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className={label} style={labelStyle}>Libro</label>
                  <select name="book_id" required className={field} style={fieldStyle} defaultValue="">
                    <option value="" disabled>Elige un libro</option>
                    <optgroup label="Antiguo Testamento">
                      {OT_BOOKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </optgroup>
                    <optgroup label="Nuevo Testamento">
                      {NT_BOOKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className={label} style={labelStyle}>Cap. inicio</label>
                  <input name="chapter_start" type="number" min={1} required defaultValue={1}
                    className={field} style={fieldStyle} />
                </div>
                <div>
                  <label className={label} style={labelStyle}>Cap. fin</label>
                  <input name="chapter_end" type="number" min={1} placeholder="= inicio"
                    className={field} style={fieldStyle} />
                </div>
              </div>
              <div className="w-24">
                <label className={label} style={labelStyle}>Día #</label>
                <input name="day_number" type="number" defaultValue={(days?.length ?? 0) + 1}
                  className={field} style={fieldStyle} />
              </div>
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: `${GOLD}26`, color: GOLD, border: '1px solid rgba(217,166,42,0.25)' }}>
                <Plus size={14} /> Agregar día
              </button>
            </form>
          </div>

          {/* Generar automáticamente */}
          <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: MUTED }}>
              <Wand2 size={10} className="inline mr-1" />
              Generar automáticamente
            </p>
            <p className="text-[11px] mb-4" style={{ color: MUTED }}>
              Reparte los capítulos de los libros elegidos en bloques iguales, sin cruzar de un libro a otro
              dentro del mismo día. Se agregan al final del plan.
            </p>
            <form action={generateAction} className="space-y-4">
              <div>
                <label className={label} style={labelStyle}>Libros (Ctrl/Cmd + clic para elegir varios)</label>
                <select name="book_ids" multiple size={8} required className={field} style={fieldStyle}>
                  <optgroup label="Antiguo Testamento">
                    {OT_BOOKS.map(b => <option key={b.id} value={b.id}>{b.name} ({b.chapters} cap.)</option>)}
                  </optgroup>
                  <optgroup label="Nuevo Testamento">
                    {NT_BOOKS.map(b => <option key={b.id} value={b.id}>{b.name} ({b.chapters} cap.)</option>)}
                  </optgroup>
                </select>
              </div>
              <div className="w-40">
                <label className={label} style={labelStyle}>Capítulos por día</label>
                <input name="chunk" type="number" min={1} defaultValue={1}
                  className={field} style={fieldStyle} />
              </div>
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: `${GOLD}26`, color: GOLD, border: '1px solid rgba(217,166,42,0.25)' }}>
                <Wand2 size={14} /> Generar días
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  )
}
