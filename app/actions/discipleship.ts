'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setUserStage(userId: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor', 'lider'].includes(me?.role ?? '')) return

  const stage_id = formData.get('stage_id') as string
  const notes    = (formData.get('notes') as string | null)?.trim() || null

  const { data: existing } = await supabase
    .from('user_discipleship')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    await supabase.from('user_discipleship')
      .update({ stage_id, notes, updated_at: new Date().toISOString(), assigned_by: user.id })
      .eq('user_id', userId)
  } else {
    await supabase.from('user_discipleship')
      .insert({ user_id: userId, stage_id, notes, assigned_by: user.id })
  }

  revalidatePath('/admin/discipulado')
  revalidatePath(`/app/perfil`)
}

export async function advanceUserStage(userId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor', 'lider'].includes(me?.role ?? '')) return

  const [{ data: current }, { data: stages }] = await Promise.all([
    supabase.from('user_discipleship')
      .select('stage_id, discipleship_stages(order_index)')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase.from('discipleship_stages').select('id, order_index').order('order_index'),
  ])

  const currentOrder = (current?.discipleship_stages as any)?.order_index ?? 0
  const nextStage = (stages ?? []).find((s: any) => s.order_index === currentOrder + 1)
  if (!nextStage) return

  const { data: existing } = await supabase
    .from('user_discipleship')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    await supabase.from('user_discipleship')
      .update({ stage_id: nextStage.id, updated_at: new Date().toISOString(), assigned_by: user.id })
      .eq('user_id', userId)
  } else {
    await supabase.from('user_discipleship')
      .insert({ user_id: userId, stage_id: nextStage.id, assigned_by: user.id })
  }

  revalidatePath('/admin/discipulado')
}
