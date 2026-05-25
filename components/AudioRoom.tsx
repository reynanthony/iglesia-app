'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  LiveKitRoom,
  useParticipants,
  useLocalParticipant,
  RoomAudioRenderer,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { Mic, MicOff, PhoneOff, Users } from 'lucide-react'
import { Track } from 'livekit-client'

function RoomControls({ onLeave }: { onLeave: () => void }) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
  const participants = useParticipants()

  const toggleMic = useCallback(async () => {
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
  }, [localParticipant, isMicrophoneEnabled])

  return (
    <div className="flex flex-col h-full">

      {/* Participantes */}
      <div className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
          <Users size={15} />
          <span>{participants.length} participante{participants.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {participants.map((participant) => {
            const isSpeaking = participant.isSpeaking
            const micEnabled = participant.isMicrophoneEnabled

            return (
              <div
                key={participant.identity}
                className={`bg-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 transition ${
                  isSpeaking ? 'ring-2 ring-[#000000]' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition ${
                  isSpeaking ? 'bg-[#000000] text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  {participant.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <p className="text-xs text-slate-300 font-medium text-center truncate w-full">
                  {participant.name ?? 'Usuario'}
                </p>
                <div className={`text-xs flex items-center gap-1 ${micEnabled ? 'text-green-400' : 'text-slate-500'}`}>
                  {micEnabled ? <Mic size={11} /> : <MicOff size={11} />}
                  <span>{micEnabled ? 'Activo' : 'Silenciado'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controles */}
      <div className="border-t border-slate-800 p-6 flex items-center justify-center gap-4">
        <button
          onClick={toggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            isMicrophoneEnabled
              ? 'bg-slate-700 hover:bg-slate-600 text-white'
              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
          }`}
        >
          {isMicrophoneEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={onLeave}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition"
        >
          <PhoneOff size={20} />
        </button>
      </div>

    </div>
  )
}

export default function AudioRoom({ roomId, roomName }: { roomId: string, roomName: string }) {
  const [token, setToken] = useState('')
  const [left, setLeft] = useState(false)

  useEffect(() => {
    fetch(`/api/livekit/token?room=${roomId}`)
      .then(r => r.json())
      .then(data => setToken(data.token))
  }, [roomId])

  if (left) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
        <p className="text-3xl">🙏</p>
        <p className="font-medium">Saliste de la sala</p>
        <a href="/app/oracion" className="text-[#000000] hover:text-[#222222] text-sm">
          Volver a salas
        </a>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p className="text-sm">Conectando...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={() => setLeft(true)}
      style={{ height: '100%', background: 'transparent' }}
    >
      <RoomAudioRenderer />
      <RoomControls onLeave={() => setLeft(true)} />
    </LiveKitRoom>
  )
}