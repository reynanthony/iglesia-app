'use client'

import { useEffect, useState } from 'react'
import { Download, Smartphone, Bell, Zap, Share } from 'lucide-react'

const DARK  = '#051828'
const NAVY  = '#093C5D'
const TEAL  = '#76ABAE'
const CREAM = '#F6F3EB'
const SAGE  = '#869B7E'

const FEATURES = [
  { Icon: Bell,       text: 'Notificaciones de servicios y eventos' },
  { Icon: Zap,        text: 'Acceso rápido sin abrir el navegador'  },
  { Icon: Smartphone, text: 'Experiencia nativa en tu teléfono'     },
]

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS]                   = useState(false)
  const [hidden, setHidden]                 = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setHidden(true)
      return
    }
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(ios)

    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (hidden) return null

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setHidden(true)
    setDeferredPrompt(null)
  }

  return (
    <section style={{ background: NAVY, borderTop: '1px solid rgba(118,171,174,0.12)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6"
              style={{ color: `${TEAL}70` }}>
              — App El Manantial
            </p>
            <h2 className="font-display font-black tracking-tighter text-white leading-[0.9] mb-6"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}>
              Lleva la<br />comunidad<br />
              <em style={{ color: TEAL }}>contigo.</em>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: `${CREAM}55` }}>
              Instala la app gratuita en tu teléfono y mantente conectado con El Manantial en todo momento.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-8">
            <ul className="flex flex-col gap-4">
              {FEATURES.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${TEAL}18`, border: `1px solid ${TEAL}25` }}>
                    <Icon size={15} style={{ color: TEAL }} />
                  </div>
                  <span className="text-sm" style={{ color: `${CREAM}70` }}>{text}</span>
                </li>
              ))}
            </ul>

            {/* Android */}
            {deferredPrompt && (
              <button
                onClick={install}
                className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] px-7 py-4 rounded-xl transition group max-w-xs"
                style={{ background: CREAM, color: NAVY }}>
                <span className="flex items-center gap-2.5">
                  <Download size={13} /> Instalar app gratis
                </span>
              </button>
            )}

            {/* iOS */}
            {isIOS && !deferredPrompt && (
              <div className="rounded-2xl p-5 max-w-xs"
                style={{ background: 'rgba(118,171,174,0.08)', border: '1px solid rgba(118,171,174,0.18)' }}>
                <p className="text-[11px] font-bold mb-3" style={{ color: CREAM }}>
                  Cómo instalar en iPhone:
                </p>
                <ol className="flex flex-col gap-2">
                  {[
                    <>Toca el ícono <Share size={11} className="inline mb-0.5" style={{ color: TEAL }} /> (Compartir) en Safari</>,
                    <>Selecciona <strong style={{ color: CREAM }}>"Agregar a inicio"</strong></>,
                    <>Toca <strong style={{ color: CREAM }}>"Agregar"</strong> y listo</>,
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[11px]" style={{ color: `${CREAM}60` }}>
                      <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black mt-0.5"
                        style={{ background: `${TEAL}25`, color: TEAL }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Desktop / no prompt */}
            {!deferredPrompt && !isIOS && (
              <p className="text-[11px] max-w-xs" style={{ color: `${CREAM}40` }}>
                Disponible para Android e iOS. Abre esta página desde tu teléfono para instalarla.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
