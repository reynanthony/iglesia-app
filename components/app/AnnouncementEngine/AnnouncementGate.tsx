'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import OnboardingFlow from './OnboardingFlow'
import AnnouncementScreen, { type AnnouncementData } from './AnnouncementScreen'
import { completeOnboarding, markAnnouncementSeen } from '@/app/actions/announcements'

type Phase = 'checking' | 'onboarding' | 'announcement' | 'done'

interface Props {
  onboardingCompleted: boolean
  userId: string | null
  userRole: string
}

const ONBOARDING_KEY = 'elm_onboarding_v1'

function audienceMatches(audience: string[], role: string): boolean {
  if (audience.includes('all')) return true
  if (audience.includes('liderazgo') && ['admin', 'pastor', 'moderador', 'lider'].includes(role)) return true
  if (audience.includes('miembro')   && ['admin', 'pastor', 'moderador', 'lider', 'miembro'].includes(role)) return true
  if (audience.includes('visitante') && role === 'visitante') return true
  return audience.some(a => a === role)
}

const PRIORITY_ORDER: Record<string, number> = { critical: 3, high: 2, normal: 1 }

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

export default function AnnouncementGate({ onboardingCompleted, userId, userRole }: Props) {
  const [phase, setPhase]               = useState<Phase>('checking')
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)

  const findNext = useCallback(async (): Promise<AnnouncementData | null> => {
    const supabase = createClient()
    const now      = new Date().toISOString()

    const { data: rows } = await supabase
      .from('announcements')
      .select('id, title, description, content_type, priority, image_url, video_url, cta_label, cta_destination, show_frequency, audience, end_date')
      .eq('is_active', true)
      .eq('is_banner', false)
      .lte('start_date', now)
      .order('priority', { ascending: false })
      .limit(10)

    if (!rows || rows.length === 0) return null

    rows.sort((a, b) => (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0))

    let seenIds = new Set<string>()
    if (userId) {
      const { data: views } = await supabase
        .from('announcement_views')
        .select('announcement_id')
        .eq('user_id', userId)
      seenIds = new Set<string>(views?.map(v => v.announcement_id) ?? [])
    }

    const candidate = rows.find(ann => {
      if (ann.end_date && new Date(ann.end_date) < new Date()) return false
      if (!audienceMatches(ann.audience, userRole)) return false
      return shouldShowByFrequency(ann as AnnouncementData, seenIds)
    })

    return (candidate as AnnouncementData) ?? null
  }, [userId, userRole])

  useEffect(() => {
    async function run() {
      const localOnboarded = localStorage.getItem(ONBOARDING_KEY)
      if (!onboardingCompleted && !localOnboarded) {
        setPhase('onboarding')
        return
      }
      const next = await findNext()
      if (next) {
        setAnnouncement(next)
        setPhase('announcement')
      } else {
        setPhase('done')
      }
    }
    run()
  }, [onboardingCompleted, userId, userRole, findNext])

  if (phase === 'checking') return null

  if (phase === 'onboarding') {
    return (
      <OnboardingFlow
        onComplete={() => {
          localStorage.setItem(ONBOARDING_KEY, '1')
          if (userId) completeOnboarding().catch(() => {})
          findNext().then(next => {
            if (next) { setAnnouncement(next); setPhase('announcement') }
            else setPhase('done')
          })
        }}
      />
    )
  }

  if (phase === 'announcement' && announcement) {
    return (
      <AnnouncementScreen
        key={announcement.id}
        announcement={announcement}
        onContinue={() => {
          recordLocal(announcement)
          if (userId && (announcement.show_frequency === 'once' || announcement.priority === 'critical')) {
            markAnnouncementSeen(announcement.id).catch(() => {})
          }
          // Busca la siguiente sin pasar por null — evita el flash de la página de fondo
          findNext().then(next => {
            if (next) {
              setAnnouncement(next)
              // phase se mantiene en 'announcement', swap directo
            } else {
              setAnnouncement(null)
              setPhase('done')
            }
          })
        }}
      />
    )
  }

  return null
}
