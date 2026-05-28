'use client'

import { useEffect, useState } from 'react'
import {
  LiveKitRoom,
  useParticipants,
  useTrackToggle,
  useConnectionState,
  RoomAudioRenderer,
} from '@livekit/components-react'
import { Track, ConnectionState } from 'livekit-client'
import '@livekit/components-styles'
import { Mic, MicOff, PhoneOff, Users, Loader2, WifiOff } from 'lucide-react'
import { hapticMedium } from '@/lib/haptics'

function RoomControls({ onLeave }: { onLeave: () => void }) {
  const participants = useParticipants()
  const connectionState = useConnectionState()
  const isConnected = connectionState === ConnectionState.Connected
  const isConnecting = connectionState === ConnectionState.Connecting || connectionState === ConnectionState.Reconnecting

  // buttonProps.onClick mantiene el gesto de usuario sin wrappers async adicionales,
  // lo cual es necesario en iOS Safari para que el prompt de permisos funcione.
  const { buttonProps, enabled: micEnabled } = useTrackToggle({
    source: Track.Source.Microphone,
  })

  return (
    <div className="flex flex-col h-full">

      {/* Estado de conexión */}
      <div className="px-4 pt-3 flex-shrink-0">
        {isConnecting && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: '#0B2D47', color: 'rgba(246,243,235,0.40)' }}>
            <Loader2 size={12} className="animate-spin" />
            Conectando a la sala…
          </div>
        )}
        {!isConnected && !isConnecting && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#F87171', border: '1px solid rgba(239,68,68,0.15)' }}>
            <WifiOff size={12} />
            Sin conexión con la sala. Recarga la página.
          </div>
        )}
      </div>

      {/* Participantes */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4" style={{ color: 'rgba(246,243,235,0.40)' }}>
          <Users size={14} />
          <span className="text-sm">{participants.length} participante{participants.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {participants.map((participant) => {
            const isSpeaking = participant.isSpeaking
            const hasMic = participant.isMicrophoneEnabled
            return (
              <div
                key={participant.identity}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 transition"
                style={{
                  background: isSpeaking ? '#0D3352' : '#0B2D47',
                  border: `1px solid ${isSpeaking ? 'rgba(118,171,174,0.40)' : '#0D3352'}`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition"
                  style={{
                    background: isSpeaking ? 'rgba(118,171,174,0.15)' : '#0D3352',
                    color: isSpeaking ? '#76ABAE' : 'rgba(246,243,235,0.40)',
                    boxShadow: isSpeaking ? '0 0 0 2px #76ABAE' : 'none',
                  }}
                >
                  {participant.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <p className="text-xs font-medium text-center truncate w-full" style={{ color: '#F6F3EB' }}>
                  {participant.name ?? 'Usuario'}
                </p>
                <div className="text-xs flex items-center gap-1"
                  style={{ color: hasMic ? '#76ABAE' : 'rgba(246,243,235,0.30)' }}>
                  {hasMic ? <Mic size={11} /> : <MicOff size={11} />}
                  <span>{hasMic ? 'Activo' : 'Silenciado'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controles */}
      <div className="flex-shrink-0 p-6 flex items-center justify-center gap-4"
        style={{ borderTop: '1px solid #0D3352' }}>

        {/*
          Spread buttonProps directamente — incluye el onClick de LiveKit que
          gestiona permisos y el AudioContext de forma compatible con iOS Safari.
          Sólo sobreescribimos disabled, className y style.
        */}
        <button
          {...buttonProps}
          disabled={buttonProps.disabled || !isConnected}
          className="w-16 h-16 rounded-full flex items-center justify-center transition disabled:opacity-40"
          style={{
            background: micEnabled ? '#0D3352' : 'rgba(239,68,68,0.15)',
            border: `2px solid ${micEnabled ? 'rgba(118,171,174,0.30)' : 'rgba(239,68,68,0.3)'}`,
          }}
        >
          {buttonProps.disabled
            ? <Loader2 size={22} className="animate-spin" style={{ color: 'rgba(246,243,235,0.40)' }} />
            : micEnabled
              ? <Mic size={22} style={{ color: '#F6F3EB' }} />
              : <MicOff size={22} style={{ color: '#F87171' }} />
          }
        </button>

        <button
          onClick={onLeave}
          className="w-16 h-16 rounded-full flex items-center justify-center transition"
          style={{ background: '#EF4444' }}
        >
          <PhoneOff size={22} style={{ color: '#fff' }} />
        </button>
      </div>
    </div>
  )
}

export default function AudioRoom({ roomId, roomName }: { roomId: string; roomName: string }) {
  const [token, setToken] = useState('')
  const [tokenError, setTokenError] = useState('')
  const [roomError, setRoomError] = useState('')
  const [left, setLeft] = useState(false)

  useEffect(() => {
    fetch(`/api/livekit/token?room=${roomId}`)
      .then(r => r.json())
      .then(data => {
        if (data.token) setToken(data.token)
        else setTokenError('No se pudo obtener acceso a la sala.')
      })
      .catch(() => setTokenError('Error de conexión. Intenta recargar.'))
  }, [roomId])


  if (left) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: '#0B2D47', border: '1px solid #0D3352' }}
        >
          <PhoneOff size={22} style={{ color: 'rgba(246,243,235,0.30)' }} />
        </div>
        <div className="text-center">
          <p className="font-black text-base tracking-tight" style={{ color: '#F6F3EB' }}>
            Saliste de la sala
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(246,243,235,0.40)' }}>
            Tu micrófono ha sido desconectado
          </p>
        </div>
        <a
          href="/app/oracion"
          className="text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition"
          style={{ background: '#0B2D47', color: '#F6F3EB', border: '1px solid #0D3352' }}
        >
          Volver a salas
        </a>
      </div>
    )
  }

  if (tokenError || roomError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <WifiOff size={24} style={{ color: '#F87171' }} />
        </div>
        <div>
          <p className="font-bold text-sm mb-1" style={{ color: '#F6F3EB' }}>
            {roomError ? 'Servidor de voz no disponible' : 'Error de acceso'}
          </p>
          <p className="text-xs" style={{ color: 'rgba(246,243,235,0.40)' }}>
            {roomError || tokenError}
          </p>
        </div>
        <button onClick={() => window.location.reload()}
          className="text-sm px-5 py-2.5 rounded-xl font-bold transition"
          style={{ background: '#0B2D47', color: '#F6F3EB', border: '1px solid #0D3352' }}>
          Reintentar
        </button>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full gap-3" style={{ color: 'rgba(246,243,235,0.40)' }}>
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Conectando a la sala…</span>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      audio={false}
      video={false}
      onConnected={() => { setRoomError(''); hapticMedium() }}
      onError={(e) => setRoomError(`Error: ${e.message}`)}
      style={{ height: '100%', background: 'transparent' }}
    >
      <RoomAudioRenderer />
      <RoomControls onLeave={() => setLeft(true)} />
    </LiveKitRoom>
  )
}
