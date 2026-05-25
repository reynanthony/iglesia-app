import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteEvento } from '@/app/actions/eventos-admin'

function formatFecha(fechaInicio: string, fechaFin?: string | null) {
  const d1 = new Date(fechaInicio + 'T00:00:00')
  const mes = d1.toLocaleDateString('es-DO', { month: 'short' }).toUpperCase()
  const dia = fechaFin
    ? `${d1.getUTCDate()}–${new Date(fechaFin + 'T00:00:00').getUTCDate()}`
    : d1.getUTCDate().toString()
  return `${mes} ${dia}`
}

export default async function AdminEventosPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('fecha_inicio', { ascending: true })

  const noTable = !events && true // if table doesn't exist yet

  return (
    <div>
      {/* Header */}
      <div className="border-b px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
        style={{ borderColor: '#1F1F1F' }}>
        <div>
          <h1 className="font-bold text-lg text-white">Eventos</h1>
          <p className="text-[13px] mt-0.5" style={{ color: '#5A5A5A' }}>
            Gestiona los eventos del sitio web
          </p>
        </div>
        <Link href="/admin/eventos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-black self-start"
          style={{ background: '#F5F5F5' }}>
          <Plus size={14} /> Nuevo evento
        </Link>
      </div>

      {/* SQL notice if table missing */}
      {(!events || events.length === 0) && (
        <div className="mx-4 md:mx-8 mt-6 rounded-xl border p-5" style={{ borderColor: '#2A2A2A', background: '#111111' }}>
          <p className="text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: '#5A5A5A' }}>
            Configuración requerida
          </p>
          <p className="text-sm text-white mb-3">
            Crea la tabla <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#1A1A1A' }}>events</code> en Supabase ejecutando este SQL:
          </p>
          <pre className="text-[11px] rounded-xl p-4 overflow-x-auto leading-relaxed"
            style={{ background: '#0A0A0A', color: '#8A8A8A', border: '1px solid #1F1F1F' }}>
{`CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  lugar TEXT,
  categoria TEXT,
  badge TEXT DEFAULT 'Próximo',
  image_url TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events visibles para todos"
  ON events FOR SELECT USING (visible = true);

CREATE POLICY "Admins gestionan eventos"
  ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin','pastor'))
  );

-- Bucket de storage para imágenes de eventos:
-- Ir a Storage → New bucket → nombre: "eventos" → Public`}
          </pre>
        </div>
      )}

      {/* Event list */}
      <div className="px-4 md:px-8 py-6 space-y-3">
        {events?.map(event => (
          <div key={event.id} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: '#1F1F1F', background: '#111111' }}>
            <div className="flex items-center gap-4 p-4">
              {/* Date block */}
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex flex-col items-center justify-center"
                style={{ background: '#1A1A1A' }}>
                <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#4D4D4D' }}>
                  {new Date(event.fecha_inicio + 'T00:00:00').toLocaleDateString('es-DO', { month: 'short' }).toUpperCase()}
                </span>
                <span className="font-black text-white text-lg leading-none">
                  {new Date(event.fecha_inicio + 'T00:00:00').getUTCDate()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-white text-sm truncate">{event.titulo}</p>
                  {!event.visible && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: '#2A2A2A', color: '#4D4D4D' }}>Oculto</span>
                  )}
                </div>
                <p className="text-[12px] truncate" style={{ color: '#5A5A5A' }}>
                  {event.categoria && `${event.categoria} · `}{event.lugar}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/eventos/${event.id}/editar`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: '#1A1A1A' }}>
                  <Pencil size={13} style={{ color: '#8A8A8A' }} />
                </Link>
                <form action={async () => {
                  'use server'
                  await deleteEvento(event.id)
                }}>
                  <button type="submit"
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: '#1A1A1A' }}>
                    <Trash2 size={13} style={{ color: '#6B3333' }} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
