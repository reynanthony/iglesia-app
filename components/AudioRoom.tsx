'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  LiveKitRoom,
  useParticipants,
  useLocalParticipant,
  RoomAudioRenderer,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { Mic, MicOff, PhoneOff, Users, Loader2 } from 'lucide-react'

function RoomControls({ onLeave }: { onLeave: () => void }) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
  const participants = useParticipants()
  const [micError, setMicError] = useState('')
  const [micPending, setMicPending] = useState(false)

  const toggleMic = useCallback(async () => {
    setMicError('')
    setMicPending(true)
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
    } catch (e: any) {
      const msg = e?.message ?? ''
      if (msg.includes('Permission') || msg.includes('denied') || msg.includes('NotAllowed')) {
        setMicError('Permiso de micrófono denegado. Actívalo en la configuración del navegador.')
      } else {
        setMicError('No se pudo acceder al micrófono.')
      }
    } finally {
      setMicPending(false)
    }
  }, [localParticipant, isMicrophoneEnabled])

  return (
    <div className="flex flex-col h-full">

      {/* Participantes */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4" style={{ color: '#5A5A5A' }}>
          <Users size={14} />
          <span className="text-sm">{participants.length} participante{participants.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {participants.map((participant) => {
            const isSpeaking = participant.isSpeaking
            const micEnabled = participant.isMicrophoneEnabled
            return (
              <div
                key={participant.identity}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 transition"
                style={{
                  background: isSpeaking ? '#1A2A1A' : '#141414',
                  border: `1px solid ${isSpeaking ? '#2A4A2A' : '#1F1F1F'}`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition"
                  style={{
                    background: isSpeaking ? 'rgba(107,203,107,0.15)' : '#1F1F1F',
                    color: isSpeaking ? '#6BCB6B' : '#8A8A8A',
                    boxShadow: isSpeaking ? '0 0 0 2px #6BCB6B' : 'none',
                  }}
                >
                  {participant.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <p className="text-xs font-medium text-center truncate w-full" style={{ color: '#F5F5F5' }}>
                  {participant.name ?? 'Usuario'}
                </p>
                <div className={`text-xs flex items-center gap-1`}
                  style={{ color: micEnabled ? '#6BCB6B' : '#4D4D4D' }}>
                  {micEnabled ? <Mic size={11} /> : <MicOff size={11} />}
                  <span>{micEnabled ? 'Activo' : 'Silenciado'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Error de permisos */}
      {micError && (
        <div className="mx-4 mb-2 px-4 py-3 rounded-xl text-sm text-red-400"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          {micError}
        </div>
      )}

      {/* Controles — extra bottom padding so they clear the mobile nav */}
      <div className="flex-shrink-0 p-4 md:p-6 flex items-center justify-center gap-4"
        style={{ borderTop: '1px solid #1F1F1F', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>

        <button
          onClick={toggleMic}
          disabled={micPending}
          className="w-16 h-16 rounded-full flex items-center justify-center transition disabled:opacity-50"
          style={{
            background: isMicrophoneEnabled ? '#1F1F1F' : 'rgba(239,68,68,0.15)',
            border: `2px solid ${isMicrophoneEnabled ? '#2A2A2A' : 'rgba(239,68,68,0.3)'}`,
          }}
        >
          {micPending
            ? <Loader2 size={22} className="animate-spin" style={{ color: '#8A8A8A' }} />
            : isMicrophoneEnabled
              ? <Mic size={22} style={{ color: '#F5F5F5' }} />
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
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ color: '#5A5A5A' }}>
        <p className="text-3xl">🙏</p>
        <p className="font-bold" style={{ color: '#F5F5F5' }}>Saliste de la sala</p>
        <a href="/app/oracion"
          className="text-sm px-5 py-2.5 rounded-xl font-bold"
          style={{ background: '#1A1A1A', color: '#8A8A8A', border: '1px solid #2A2A2A' }}>
          Volver a salas
        </a>
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
        <p className="text-sm" style={{ color: '#F87171' }}>{tokenError}</p>
        <button onClick={() => window.location.reload()}
          className="text-sm px-4 py-2 rounded-xl" style={{ background: '#1A1A1A', color: '#8A8A8A' }}>
          Reintentar
        </button>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full gap-3" style={{ color: '#5A5A5A' }}>
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
      onDisconnected={() => setLeft(true)}
      style={{ height: '100%', background: 'transparent' }}
    >
      <RoomAudioRenderer />
      <RoomControls onLeave={() => setLeft(true)} />
    </LiveKitRoom>
  )
}
