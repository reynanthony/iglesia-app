import { createClient } from '@/lib/supabase/server'
import { setLiveUrl, toggleLive } from '@/app/actions/liveconfig'
import { Radio, AlertCircle } from 'lucide-react'

export default async function AdminEnVivoPage() {
  const supabase = await createClient()
  const { data: configs } = await supabase.from('site_config').select('key, value')
  const cfg = Object.fromEntries((configs ?? []).map((c: any) => [c.key, c.value]))

  const isLive    = cfg['is_live'] === 'true'
  const liveUrl   = cfg['live_url'] ?? ''
  const liveTitle = cfg['live_title'] ?? 'Culto en vivo'

  const tableExists = configs !== null

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#0D3352' }}>
            <Radio size={18} style={{ color: '#76ABAE' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">En Vivo</h1>
            <p className="text-sm" style={{ color: 'rgba(246,243,235,0.40)' }}>
              Gestión de la transmisión del culto
            </p>
          </div>
        </div>

        {!tableExists && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3"
            style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)' }}>
            <AlertCircle size={16} style={{ color: '#F87171', flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#F87171' }}>Tabla no configurada</p>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(246,243,235,0.55)' }}>
                Ejecuta <code className="font-mono">supabase/v2_live_config.sql</code> en el SQL Editor de Supabase para activar esta sección.
              </p>
            </div>
          </div>
        )}

        {/* Live status card */}
        <div className="p-6 rounded-2xl mb-4" style={{ background: '#0B2D47', border: `1px solid ${isLive ? 'rgba(248,113,113,0.40)' : '#0D3352'}` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isLive && <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />}
              <p className="font-black text-lg" style={{ color: isLive ? '#F87171' : '#F6F3EB' }}>
                {isLive ? 'Transmisión activa' : 'Sin transmisión'}
              </p>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
              style={{
                background: isLive ? 'rgba(248,113,113,0.15)' : '#0D3352',
                color: isLive ? '#F87171' : 'rgba(246,243,235,0.40)',
              }}>
              {isLive ? 'EN VIVO' : 'OFFLINE'}
            </span>
          </div>
          {liveUrl && (
            <p className="text-[12px] truncate" style={{ color: 'rgba(246,243,235,0.40)' }}>
              {liveUrl}
            </p>
          )}
        </div>

        {/* Toggle */}
        <form action={toggleLive} className="mb-4">
          <input type="hidden" name="is_live" value={isLive ? '' : 'on'} />
          <button type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-black transition"
            style={{
              background: isLive ? 'rgba(248,113,113,0.15)' : 'rgba(118,171,174,0.15)',
              color:      isLive ? '#F87171' : '#76ABAE',
              border: `1px solid ${isLive ? 'rgba(248,113,113,0.30)' : 'rgba(118,171,174,0.30)'}`,
            }}>
            {isLive ? '⏹ Detener transmisión' : '▶ Iniciar transmisión'}
          </button>
        </form>

        {/* URL & title form */}
        <form action={setLiveUrl} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: 'rgba(246,243,235,0.50)' }}>
              URL del stream (YouTube)
            </label>
            <input
              name="live_url"
              type="url"
              defaultValue={liveUrl}
              placeholder="https://www.youtube.com/watch?v=…"
              className="w-full px-4 py-3 text-sm bg-transparent focus:outline-none"
              style={{ background: '#0B2D47', border: '1px solid #0D3352', borderRadius: 12, color: '#F6F3EB' }}
            />
            <p className="text-[11px] mt-1.5" style={{ color: 'rgba(246,243,235,0.35)' }}>
              Acepta URLs de youtube.com y youtu.be
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: 'rgba(246,243,235,0.50)' }}>
              Título de la transmisión
            </label>
            <input
              name="live_title"
              type="text"
              defaultValue={liveTitle}
              placeholder="Culto en vivo"
              className="w-full px-4 py-3 text-sm bg-transparent focus:outline-none"
              style={{ background: '#0B2D47', border: '1px solid #0D3352', borderRadius: 12, color: '#F6F3EB' }}
            />
          </div>

          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: '#F6F3EB', color: '#061E30' }}>
            Guardar configuración
          </button>
        </form>

      </div>
    </div>
  )
}
