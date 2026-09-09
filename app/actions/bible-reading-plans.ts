'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, userId: user.id }
}

export async function enrollInReadingPlan(planId: string, slug: string): Promise<void> {
  const { supabase, userId } = await requireAuth()

  await supabase.from('user_reading_plan_enrollments')
    .upsert({ user_id: userId, plan_id: planId }, { onConflict: 'user_id,plan_id', ignoreDuplicates: true })

  revalidatePath('/biblia/planes')
  redirect(`/biblia/planes/${slug}/dia/1`)
}

export async function markPlanDayComplete(planId: string, planDayId: string, dayNumber: number): Promise<void> {
  const { supabase, userId } = await requireAuth()

  // Auto-inscribe si aún no está inscripto (marcar un día implica participar del plan)
  await supabase.from('user_reading_plan_enrollments')
    .upsert({ user_id: userId, plan_id: planId }, { onConflict: 'user_id,plan_id', ignoreDuplicates: true })

  await supabase.from('user_reading_plan_day_completions')
    .upsert({ user_id: userId, plan_day_id: planDayId }, { onConflict: 'user_id,plan_day_id', ignoreDuplicates: true })

  const [{ data: plan }, { data: enrollment }] = await Promise.all([
    supabase.from('bible_reading_plans').select('duration_days').eq('id', planId).single(),
    supabase.from('user_reading_plan_enrollments').select('current_day').eq('user_id', userId).eq('plan_id', planId).single(),
  ])

  const isLastDay = plan ? dayNumber >= plan.duration_days : false
  const advancedDay = isLastDay ? dayNumber : dayNumber + 1
  const newCurrentDay = Math.max(enrollment?.current_day ?? 1, advancedDay)

  await supabase.from('user_reading_plan_enrollments').update({
    current_day: newCurrentDay,
    completed_at: isLastDay ? new Date().toISOString() : null,
  }).eq('user_id', userId).eq('plan_id', planId)

  revalidatePath('/biblia/planes')
}
