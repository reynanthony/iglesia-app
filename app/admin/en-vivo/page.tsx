import { createClient } from '@/lib/supabase/server'
import { setLiveUrl, toggleLive } from '@/app/actions/liveconfig'
import { Radio, AlertCircle } from 'lucide-react'

export default async function AdminEnVivoPage() {
  const supabase = await createClient()
  const { data: configs } = await supabase.from('site_config').select('key, value')
  const cfg = Object.fromEntries((configs ?? []).map((c: any) => [c.key, c.value]))

  const isLive         = cfg['is_live'] === 'true'
  const liveUrl        = cfg['live_url'] ?? ''
  const liveTitle      = cfg['live_title'] ?? 'Culto en vivo'
  const liveVisibleWeb = cfg['live_visible_web'] === 'true'
  const tableExists    = configs !== null

  return (
    <div className="px-4 md:px-8 py-4 md:py-8">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#0D3352' }}>
            <Radio size={15} style={{ color: '#76ABAE' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">En Vivo</h1>
            <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.40)' }}>
              Gestión de la transmisión
            </p>
          </div>
        </div>

        {/* SQL setup notice */}
        {!tableExists && (
          <div className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(248,113,113,0.30)' }}>
            <div className="flex items-start gap-3 p-3"
              style={{ background: 'rgba(248,113,113,0.10)' }}>
              <AlertCircle size={15} style={{ color: '#F87171', flexShrink: 0, marginTop: 1 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: '#F87171' }}>Tabla no configurada</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(246,243,235,0.55)' }}>
                  Ejecuta el SQL en <strong>Supabase → SQL Editor</strong> para activar esta sección.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status card */}
        <div className="p-4 rounded-xl"
          style={{ background: '#0B2D47', border: `1px solid ${isLive ? 'rgba(248,113,113,0.40)' : '#0D3352'}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
              <p className="font-black text-sm" style={{ color: isLive ? '#F87171' : '#F6F3EB' }}>
                {isLive ? 'Transmisión activa' : 'Sin transmisión'}
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: isLive ? 'rgba(248,113,113,0.15)' : '#0D3352',
                color: isLive ? '#F87171' : 'rgba(246,243,235,0.40)',
              }}>
              {isLive ? 'EN VIVO' : 'OFFLINE'}
            </span>
          </div>
          {liveUrl && (
            <p className="text-[11px] mt-1.5 truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>
              {liveUrl}
            </p>
          )}
        </div>

        {/* Toggle */}
        <form action={toggleLive}>
          <input type="hidden" name="is_live" value={isLive ? '' : 'on'} />
          <button type="submit" disabled={!tableExists}
            className="w-full py-2.5 rounded-xl text-sm font-black transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isLive ? 'rgba(248,113,113,0.15)' : 'rgba(118,171,174,0.15)',
              color:      isLive ? '#F87171' : '#76ABAE',
              border: `1px solid ${isLive ? 'rgba(248,113,113,0.30)' : 'rgba(118,171,174,0.30)'}`,
            }}>
            {isLive ? 'Detener transmisión' : 'Iniciar transmisión'}
          </button>
        </form>

        {/* URL & title */}
        <form action={setLiveUrl} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: 'rgba(246,243,235,0.50)' }}>
              URL del stream (YouTube)
            </label>
            <input
              name="live_url"
              type="url"
              defaultValue={liveUrl}
              placeholder="https://www.youtube.com/watch?v=…"
              className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
              style={{ background: '#0B2D47', border: '1px solid #0D3352', borderRadius: 10, color: '#F6F3EB' }}
            />
            <p className="text-[10px] mt-1" style={{ color: 'rgba(246,243,235,0.35)' }}>
              URL pública del video (youtube.com/watch?v=... o youtu.be/...)
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: 'rgba(246,243,235,0.50)' }}>
              Título de la transmisión
            </label>
            <input
              name="live_title"
              type="text"
              defaultValue={liveTitle}
              placeholder="Culto en vivo"
              className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
              style={{ background: '#0B2D47', border: '1px solid #0D3352', borderRadius: 10, color: '#F6F3EB' }}
            />
          </div>

          {/* Visibilidad web */}
          <label className="flex items-start gap-3 p-3 rounded-xl cursor-pointer"
            style={{
              background: liveVisibleWeb ? 'rgba(118,171,174,0.08)' : '#0B2D47',
              border: `1px solid ${liveVisibleWeb ? 'rgba(118,171,174,0.30)' : '#0D3352'}`,
            }}>
            <input
              type="checkbox"
              name="live_visible_web"
              defaultChecked={liveVisibleWeb}
              className="mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>
                Publicar en el sitio web
              </p>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'rgba(246,243,235,0.40)' }}>
                Sin marcar: solo lo ven los miembros en la app.
              </p>
            </div>
          </label>

          <button type="submit" disabled={!tableExists}
            className="w-full py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            Guardar configuración
          </button>
        </form>

      </div>
    </div>
  )
}
