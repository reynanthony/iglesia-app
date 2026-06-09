'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import OnboardingFlow from './OnboardingFlow'
import AnnouncementScreen, { type AnnouncementData } from './AnnouncementScreen'
import AnnouncementFloat from './AnnouncementFloat'
import { completeOnboarding, markAnnouncementSeen } from '@/app/actions/announcements'

type Phase = 'checking' | 'onboarding' | 'announcement' | 'done'

interface Props {
  onboardingCompleted: boolean
  userId: string | null
  userRole: string
  hasBottomNav?: boolean
}

const ONBOARDING_KEY = 'elm_onboarding_v1'

function audienceMatches(audience: string[] | null | undefined, role: string): boolean {
  if (!audience?.length) return true
  if (audience.includes('all')) return true
  if (audience.includes('liderazgo') && ['admin', 'pastor', 'moderador', 'lider'].includes(role)) return true
  if (audience.includes('miembro')   && ['admin', 'pastor', 'moderador', 'lider', 'miembro'].includes(role)) return true
  if (audience.includes('visitante') && role === 'visitante') return true
  return audience.some(a => a === role)
}

const PRIORITY_ORDER: Record<string, number> = { critical: 3, high: 2, normal: 1 }
const SELECT_FIELDS = 'id, title, description, content_type, priority, image_url, video_url, cta_label, cta_destination, show_frequency, audience, end_date'

function shouldShowByFrequency(ann: AnnouncementData, seenIds: Set<string>): boolean {
  if (sessionStorage.getItem(`elm_ann_session_${ann.id}`)) return false
  if (ann.priority === 'critical') return true
  switch (ann.show_frequency) {
    case 'always':
      return true
    case 'once':
      if (seenIds.has(ann.id)) return false
      return !localStorage.getItem(`elm_ann_once_${ann.id}`)
    case 'daily': {
      const last = localStorage.getItem(`elm_ann_daily_${ann.id}`)
      if (!last) return true
      return new Date(last).toDateString() !== new Date().toDateString()
    }
    case 'session':
      return true
    default:
      return false
  }
}

function recordLocal(ann: AnnouncementData) {
  localStorage.setItem(`elm_ann_once_${ann.id}`, '1')
  localStorage.setItem(`elm_ann_daily_${ann.id}`, new Date().toISOString())
  sessionStorage.setItem(`elm_ann_session_${ann.id}`, '1')
}

export default function AnnouncementGate({ onboardingCompleted, userId, userRole, hasBottomNav }: Props) {
  const [phase, setPhase]               = useState<Phase>('checking')
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)
  const [floatAnn, setFloatAnn]         = useState<AnnouncementData | null>(null)
  const [isReplay, setIsReplay]         = useState(false)
  const phaseRef                        = useRef<Phase>('checking')
  useEffect(() => { phaseRef.current = phase }, [phase])

  // Returns next announcement to show respecting frequency rules
  const findNext = useCallback(async (): Promise<AnnouncementData | null> => {
    try {
      const supabase = createClient()
      const now = new Date().toISOString()
      const { data: rows, error } = await supabase
        .from('announcements')
        .select(SELECT_FIELDS)
        .eq('is_active', true).eq('is_banner', false).lte('start_date', now)
        .order('priority', { ascending: false }).limit(10)
      if (error) { console.warn('[AnnouncementGate] findNext query error:', error.message); return null }
      if (!rows?.length) { console.log('[AnnouncementGate] findNext: no rows returned'); return null }
      rows.sort((a, b) => (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0))
      let seenIds = new Set<string>()
      if (userId) {
        const { data: views } = await supabase
          .from('announcement_views').select('announcement_id').eq('user_id', userId)
        seenIds = new Set(views?.map(v => v.announcement_id) ?? [])
      }
      const candidate = rows.find(ann => {
        if (ann.end_date && new Date(ann.end_date) < new Date()) return false
        if (!audienceMatches(ann.audience, userRole)) return false
        return shouldShowByFrequency(ann as AnnouncementData, seenIds)
      })
      return (candidate as AnnouncementData) ?? null
    } catch (e) {
      console.error('[AnnouncementGate] findNext error:', e)
      return null
    }
  }, [userId, userRole])

  // Returns highest-priority active announcement regardless of frequency (for float)
  const findBestActive = useCallback(async (): Promise<AnnouncementData | null> => {
    try {
      const supabase = createClient()
      const now = new Date().toISOString()
      const { data: rows, error } = await supabase
        .from('announcements')
        .select(SELECT_FIELDS)
        .eq('is_active', true).eq('is_banner', false).lte('start_date', now)
        .order('priority', { ascending: false }).limit(10)
      if (error) { console.warn('[AnnouncementGate] findBestActive query error:', error.message); return null }
      if (!rows?.length) { console.log('[AnnouncementGate] findBestActive: no rows returned'); return null }
      rows.sort((a, b) => (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0))
      const candidate = rows.find(ann => {
        if (ann.end_date && new Date(ann.end_date) < new Date()) return false
        return audienceMatches(ann.audience, userRole)
      })
      console.log('[AnnouncementGate] findBestActive candidate:', candidate?.id ?? 'none', '| userRole:', userRole)
      return (candidate as AnnouncementData) ?? null
    } catch (e) {
      console.error('[AnnouncementGate] findBestActive error:', e)
      return null
    }
  }, [userRole])

  useEffect(() => {
    async function run() {
      const localOnboarded = localStorage.getItem(ONBOARDING_KEY)
      if (!onboardingCompleted && !localOnboarded) {
        setPhase('onboarding')
        findBestActive().then(best => { if (best) setFloatAnn(best) })
        return
      }
      const [next, best] = await Promise.all([findNext(), findBestActive()])
      if (next) {
        setAnnouncement(next); setPhase('announcement'); phaseRef.current = 'announcement'
      } else {
        setPhase('done'); phaseRef.current = 'done'
      }
      if (best) setFloatAnn(best)
    }
    run()

    // Realtime: reacciona al instante cuando el admin publica o activa un anuncio.
    const supabase = createClient()
    const uid = Math.random().toString(36).slice(2, 7)
    const channel = supabase
      .channel(`announcements-live-${uid}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, async () => {
        const best = await findBestActive()
        setFloatAnn(best)
        if (phaseRef.current === 'done') {
          const next = await findNext()
          if (next) { setAnnouncement(next); setPhase('announcement'); phaseRef.current = 'announcement' }
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [onboardingCompleted, userId, userRole, findNext, findBestActive])

  function handleDismiss() {
    if (isReplay) {
      setIsReplay(false)
      setAnnouncement(null)
      setPhase('done')
      return
    }
    const current = announcement!
    recordLocal(current)
    if (userId && (current.show_frequency === 'once' || current.priority === 'critical')) {
      markAnnouncementSeen(current.id).catch(() => {})
    }
    findNext().then(next => {
      if (next) {
        setAnnouncement(next)
      } else {
        setAnnouncement(null)
        setPhase('done')
      }
    })
  }

  if (phase === 'checking') return null

  if (phase === 'onboarding') {
    return (
      <OnboardingFlow
        onComplete={(bio?: string) => {
          localStorage.setItem(ONBOARDING_KEY, '1')
          if (userId) completeOnboarding(bio).catch(() => {})
          findNext().then(next => {
            if (next) { setAnnouncement(next); setPhase('announcement') }
            else setPhase('done')
          })
        }}
      />
    )
  }

  return (
    <>
      {phase === 'announcement' && announcement && (
        <AnnouncementScreen
          key={announcement.id + (isReplay ? '-r' : '')}
          announcement={announcement}
          onContinue={handleDismiss}
        />
      )}

      {floatAnn && phase === 'done' && (
        <AnnouncementFloat
          announcement={floatAnn}
          hasBottomNav={hasBottomNav}
          onOpen={() => {
            setIsReplay(true)
            setAnnouncement(floatAnn)
            setPhase('announcement')
          }}
        />
      )}
    </>
  )
}
