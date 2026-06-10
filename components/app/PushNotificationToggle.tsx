'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { requestAndSubscribe } from '@/components/app/PWARegister'

export default function PushNotificationToggle() {
  const [status, setStatus] = useState<'loading' | 'unsupported' | 'denied' | 'granted' | 'default'>('loading')

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    setStatus(Notification.permission as 'denied' | 'granted' | 'default')
  }, [])

  async function handleEnable() {
    const ok = await requestAndSubscribe()
    setStatus(ok ? 'granted' : (Notification.permission as 'denied' | 'granted' | 'default'))
  }

  if (status === 'loading' || status === 'unsupported') return null

  return (
    <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
      style={{ background: '#0B2D47', border: '1px solid #0D3352' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: status === 'granted' ? 'rgba(118,171,174,0.12)' : '#0D3352' }}>
          {status === 'granted'
            ? <BellRing size={16} style={{ color: '#76ABAE' }} />
            : status === 'denied'
              ? <BellOff size={16} style={{ color: 'rgba(248,113,113,0.60)' }} />
              : <Bell size={16} style={{ color: 'rgba(246,243,235,0.68)' }} />
          }
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: '#F6F3EB' }}>Notificaciones push</p>
          <p className="text-[11px]" style={{ color: 'rgba(246,243,235,0.68)' }}>
            {status === 'granted' && 'Activas — recibirás alertas del pastor y anuncios'}
            {status === 'denied' && 'Bloqueadas — actívalas desde la configuración del navegador'}
            {status === 'default' && 'Recibe alertas de mensajes y anuncios importantes'}
          </p>
        </div>
      </div>
      {status === 'default' && (
        <button
          onClick={handleEnable}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg flex-shrink-0 ml-3"
          style={{ background: '#76ABAE', color: '#061E30' }}>
          Activar
        </button>
      )}
      {status === 'granted' && (
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0"
          style={{ background: 'rgba(118,171,174,0.12)', color: '#76ABAE' }}>
          Activo
        </span>
      )}
    </div>
  )
}
