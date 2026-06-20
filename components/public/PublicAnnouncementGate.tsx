'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AnnouncementGate from '@/components/app/AnnouncementEngine/AnnouncementGate'

export default function PublicAnnouncementGate() {
  const [ready, setReady]                       = useState(false)
  const [userId, setUserId]                     = useState<string | null>(null)
  const [userRole, setUserRole]                 = useState('visitante')
  const [onboardingCompleted, setOnboarding]    = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, onboarding_completed')
          .eq('id', user.id)
          .single()
        setUserId(user.id)
        setUserRole(profile?.role ?? 'visitante')
        setOnboarding(profile?.onboarding_completed ?? false)
      }
      setReady(true)
    })
  }, [])

  if (!ready) return null

  return (
    <AnnouncementGate
      onboardingCompleted={userId ? onboardingCompleted : true}
      userId={userId}
      userRole={userRole}
    />
  )
}
