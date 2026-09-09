import { createClient } from '@/lib/supabase/server'
import { setLiveUrl, toggleLive } from '@/app/actions/liveconfig'
import { Radio, AlertCircle } from 'lucide-react'
import { CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

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
            style={{ background: BORDER }}>
            <Radio size={15} style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">En Vivo</h1>
            <p className="text-[11px]" style={{ color: MUTED }}>
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
                <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>
                  Ejecuta el SQL en <strong>Supabase → SQL Editor</strong> para activar esta sección.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status card */}
        <div className="p-4 rounded-xl"
          style={{ background: CARD, border: `1px solid ${isLive ? 'rgba(248,113,113,0.40)' : BORDER}` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
              <p className="font-black text-sm" style={{ color: isLive ? '#F87171' : INK }}>
                {isLive ? 'Transmisión activa' : 'Sin transmisión'}
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: isLive ? 'rgba(248,113,113,0.15)' : BORDER,
                color: isLive ? '#F87171' : MUTED,
              }}>
              {isLive ? 'EN VIVO' : 'OFFLINE'}
            </span>
          </div>
          {liveUrl && (
            <p className="text-[11px] mt-1.5 truncate" style={{ color: MUTED }}>
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
              background: isLive ? 'rgba(248,113,113,0.15)' : `${GOLD}26`,
              color:      isLive ? '#F87171' : GOLD,
              border: `1px solid ${isLive ? 'rgba(248,113,113,0.30)' : `${GOLD}4C`}`,
            }}>
            {isLive ? 'Detener transmisión' : 'Iniciar transmisión'}
          </button>
        </form>

        {/* URL & title */}
        <form action={setLiveUrl} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: MUTED }}>
              URL del stream (YouTube)
            </label>
            <input
              name="live_url"
              type="url"
              defaultValue={liveUrl}
              placeholder="https://www.youtube.com/watch?v=…"
              className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, color: INK }}
            />
            <p className="text-[10px] mt-1" style={{ color: MUTED }}>
              URL pública del video (youtube.com/watch?v=... o youtu.be/...)
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: MUTED }}>
              Título de la transmisión
            </label>
            <input
              name="live_title"
              type="text"
              defaultValue={liveTitle}
              placeholder="Culto en vivo"
              className="w-full px-3.5 py-2.5 text-sm bg-transparent focus:outline-none"
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, color: INK }}
            />
          </div>

          {/* Visibilidad web */}
          <label className="flex items-start gap-3 p-3 rounded-xl cursor-pointer"
            style={{
              background: liveVisibleWeb ? `${GOLD}14` : CARD,
              border: `1px solid ${liveVisibleWeb ? `${GOLD}4C` : BORDER}`,
            }}>
            <input
              type="checkbox"
              name="live_visible_web"
              defaultChecked={liveVisibleWeb}
              className="mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-bold" style={{ color: INK }}>
                Publicar en el sitio web
              </p>
              <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: MUTED }}>
                Sin marcar: solo lo ven los miembros en la app.
              </p>
            </div>
          </label>

          <button type="submit" disabled={!tableExists}
            className="w-full py-2.5 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: GOLD, color: GOLD_INK }}>
            Guardar configuración
          </button>
        </form>

      </div>
    </div>
  )
}
