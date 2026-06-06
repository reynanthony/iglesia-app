import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Megaphone } from 'lucide-react'
import { updateAnnouncement } from '@/app/actions/announcements'
import DeleteCampanaButton from '@/components/admin/DeleteCampanaButton'
import ImageUploader from '@/components/admin/ImageUploader'
import CtaDestinationField from '@/components/admin/CtaDestinationField'

const field  = "w-full px-3.5 py-2.5 text-sm focus:outline-none rounded-xl"
const fStyle = { background: '#0B2D47', border: '1px solid #0D3352', color: '#F6F3EB' }
const label  = "block text-[10px] font-black uppercase tracking-[0.2em] mb-1.5"
const lStyle = { color: 'rgba(246,243,235,0.45)' }

function toLocalDatetime(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  d.setSeconds(0, 0)
  return d.toISOString().slice(0, 16)
}

export default async function EditarCampanaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = await params
  const supabase  = await createClient()
  const { data: item } = await supabase.from('announcements').select('*').eq('id', id).single()
  if (!item) notFound()

  async function handleUpdate(formData: FormData) {
    'use server'
    const result = await updateAnnouncement(id, formData)
    if (!result?.error) redirect('/admin/campanas')
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 md:mb-8">
          <Link href="/admin/campanas"
            className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: '#0B2D47', border: '1px solid #0D3352', color: 'rgba(246,243,235,0.55)' }}>
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(118,171,174,0.12)' }}>
              <Megaphone size={14} style={{ color: '#76ABAE' }} />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold leading-tight">Editar campaña</h1>
              <p className="text-[11px] truncate max-w-[200px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
                {item.title}
              </p>
            </div>
          </div>
        </div>

        <form action={handleUpdate} className="space-y-4">

          <div>
            <label className={label} style={lStyle}>Título *</label>
            <input name="title" required defaultValue={item.title}
              className={field} style={fStyle} />
          </div>

          <div>
            <label className={label} style={lStyle}>Descripción</label>
            <textarea name="description" rows={3} defaultValue={item.description ?? ''}
              className={`${field} resize-none`} style={fStyle} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={lStyle}>Tipo</label>
              <select name="content_type" defaultValue={item.content_type} className={field} style={fStyle}>
                <option value="image">Imagen</option>
                <option value="video">Video</option>
                <option value="pastoral_message">Pastoral</option>
                <option value="event">Evento</option>
                <option value="course">Clase</option>
                <option value="live_invitation">En Vivo</option>
              </select>
            </div>
            <div>
              <label className={label} style={lStyle}>Prioridad</label>
              <select name="priority" defaultValue={item.priority} className={field} style={fStyle}>
                <option value="normal">Normal</option>
                <option value="high">Importante</option>
                <option value="critical">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className={label} style={lStyle}>Imagen o video de fondo</label>
            <ImageUploader name="image_url" defaultValue={item.image_url ?? ''} />
            <p className="text-[10px] mt-1" style={{ color: 'rgba(246,243,235,0.30)' }}>
              Sube una imagen desde tu dispositivo, o pega URL de imagen / YouTube.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={lStyle}>Texto del botón</label>
              <input name="cta_label" defaultValue={item.cta_label ?? ''}
                placeholder="Más información" className={field} style={fStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={lStyle}>Destino del botón</label>
            <CtaDestinationField defaultValue={item.cta_destination ?? ''} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={lStyle}>Inicio</label>
              <input name="start_date" type="datetime-local"
                defaultValue={toLocalDatetime(item.start_date)}
                className={field} style={fStyle} />
            </div>
            <div>
              <label className={label} style={lStyle}>Fin (opcional)</label>
              <input name="end_date" type="datetime-local"
                defaultValue={toLocalDatetime(item.end_date)}
                className={field} style={fStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={lStyle}>Frecuencia</label>
              <select name="show_frequency" defaultValue={item.show_frequency} className={field} style={fStyle}>
                <option value="once">Una sola vez</option>
                <option value="daily">Una vez al día</option>
                <option value="session">Por sesión</option>
                <option value="always">Siempre</option>
              </select>
            </div>
            <div>
              <label className={label} style={lStyle}>Audiencia</label>
              <select name="audience" defaultValue={item.audience?.[0] ?? 'all'} className={field} style={fStyle}>
                <option value="all">Todos</option>
                <option value="miembro">Miembros</option>
                <option value="liderazgo">Liderazgo</option>
                <option value="visitante">Visitantes</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <input type="checkbox" name="is_banner" defaultChecked={item.is_banner ?? false} className="flex-shrink-0" />
            <div>
              <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Banner de texto (barra superior)</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
                Barra discreta en Comunidad. Sin imagen ni video. Desmarca para pantalla completa con imagen o video de fondo.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer"
            style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
            <input type="checkbox" name="is_active" defaultChecked={item.is_active} className="flex-shrink-0" />
            <div>
              <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Campaña activa</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.40)' }}>
                Desactiva para pausar sin eliminar
              </p>
            </div>
          </label>

          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            Guardar cambios
          </button>
        </form>

        <DeleteCampanaButton id={id} />
      </div>
    </div>
  )
}
