'use client'

import { useState, useTransition } from 'react'
import { Flame, MessageSquarePlus, Send, X } from 'lucide-react'
import { togglePublicPrayer, createPrayerResponse } from '@/app/actions/prayer'

const TEAL = '#76ABAE'
const NAVY = '#093C5D'
const CREAM = '#F6F3EB'

interface PrayerCardProps {
  requestId: string
  body: string
  title: string | null
  authorName: string
  timeAgoStr: string
  prayCount: number
  responseCount: number
  initialPrayed: boolean
  isAuthenticated: boolean
}

export function PrayerCard({
  requestId, body, title, authorName, timeAgoStr,
  prayCount, responseCount, initialPrayed, isAuthenticated,
}: PrayerCardProps) {
  const [prayed, setPrayed]           = useState(initialPrayed)
  const [count, setCount]             = useState(prayCount)
  const [resCount, setResCount]       = useState(responseCount)
  const [open, setOpen]               = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [prayPending, startPray]      = useTransition()
  const [resPending, startRes]        = useTransition()

  function handlePray() {
    if (!isAuthenticated) { window.location.href = '/login?next=/oracion'; return }
    const next = !prayed
    setPrayed(next)
    setCount(c => next ? c + 1 : Math.max(0, c - 1))
    startPray(async () => { await togglePublicPrayer(requestId) })
  }

  function handleOpenResponse() {
    if (!isAuthenticated) { window.location.href = '/login?next=/oracion'; return }
    setOpen(o => !o)
  }

  async function handleSubmitResponse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startRes(async () => {
      const result = await createPrayerResponse(requestId, fd)
      if (result.success) {
        setResCount(c => c + 1)
        setSubmitted(true)
        setOpen(false)
      }
    })
  }

  return (
    <div className="rounded-2xl border border-edge hover:border-edge-2 bg-card transition overflow-hidden">
      <div className="p-5">
        {/* Prayer text */}
        <p className="text-sm text-ink leading-relaxed mb-3 italic" style={{ lineHeight: 1.75 }}>
          &ldquo;{body}&rdquo;
        </p>

        {/* Motivo tag */}
        {title && (
          <p className="text-[11px] font-bold text-ink-3 mb-3 uppercase tracking-[0.15em]">
            {title}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-ink-3">{authorName}</span>
            <span className="text-ink-3 opacity-40">·</span>
            <span className="text-[11px] text-ink-3">{timeAgoStr}</span>
            {count > 0 && (
              <>
                <span className="text-ink-3 opacity-40">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: TEAL }}>
                  <Flame size={10} /> {count} orando
                </span>
              </>
            )}
            {resCount > 0 && (
              <>
                <span className="text-ink-3 opacity-40">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: TEAL }}>
                  <MessageSquarePlus size={10} /> {resCount} {resCount === 1 ? 'oración unida' : 'oraciones unidas'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Attach prayer button */}
            {!submitted ? (
              <button
                onClick={handleOpenResponse}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-2 rounded-lg transition-all cursor-pointer flex-shrink-0"
                style={open
                  ? { background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}35` }
                  : { background: 'transparent', color: '#869B7E', border: '1px solid rgba(9,60,93,0.12)' }
                }
              >
                <MessageSquarePlus size={12} />
                Orar
              </button>
            ) : (
              <span className="text-[11px] font-bold px-3 py-2 rounded-lg" style={{ color: TEAL, background: `${TEAL}10` }}>
                ¡Oración unida!
              </span>
            )}

            {/* Pray count button */}
            <button
              onClick={handlePray}
              disabled={prayPending}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-2 rounded-lg transition-all disabled:opacity-60 cursor-pointer flex-shrink-0"
              style={prayed
                ? { background: 'rgba(118,171,174,0.12)', color: TEAL, border: '1px solid rgba(118,171,174,0.30)' }
                : { background: 'transparent', color: '#869B7E', border: '1px solid rgba(9,60,93,0.15)' }
              }
            >
              <Flame size={12} style={{ color: prayed ? TEAL : '#869B7E' }} />
              {count > 0 ? count : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable response form */}
      {open && (
        <div className="border-t border-edge px-5 py-4" style={{ background: 'rgba(118,171,174,0.04)' }}>
          <form onSubmit={handleSubmitResponse} className="space-y-3">
            <textarea
              name="body"
              rows={3}
              required
              autoFocus
              placeholder="Señor, me uno en oración por..."
              className="w-full rounded-xl px-4 py-3 text-sm bg-card border border-edge focus:outline-none focus:border-edge-2 transition resize-none text-ink placeholder:text-ink-3"
            />
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="is_anonymous" type="checkbox" className="w-3.5 h-3.5 rounded" style={{ accentColor: TEAL }} />
                <span className="text-[11px] text-ink-3">Anónimo</span>
              </label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] font-bold text-ink-3 border border-edge transition hover:border-edge-2">
                  <X size={11} /> Cancelar
                </button>
                <button type="submit" disabled={resPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-[0.15em] transition disabled:opacity-50"
                  style={{ background: NAVY, color: CREAM }}>
                  <Send size={11} style={{ color: TEAL }} />
                  {resPending ? 'Enviando...' : 'Unir oración'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
