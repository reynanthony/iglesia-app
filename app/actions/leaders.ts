'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor'].includes(p?.role ?? '')) return null
  return supabase
}

export async function createLeader(formData: FormData) {
  const supabase = await assertAdmin()
  if (!supabase) return
  await supabase.from('church_leaders').insert({
    name:        (formData.get('name') as string).trim(),
    title:       (formData.get('title') as string).trim(),
    bio:         (formData.get('bio') as string)?.trim() || null,
    avatar_url:  (formData.get('avatar_url') as string)?.trim() || null,
    category:    (formData.get('category') as string) || 'pastoral',
    order_index: parseInt(formData.get('order_index') as string) || 0,
    is_public:   formData.get('is_public') === 'on',
  })
  revalidatePath('/nosotros')
  revalidatePath('/admin/lideres')
  redirect('/admin/lideres')
}

export async function updateLeader(id: string, formData: FormData) {
  const supabase = await assertAdmin()
  if (!supabase) return
  await supabase.from('church_leaders').update({
    name:        (formData.get('name') as string).trim(),
    title:       (formData.get('title') as string).trim(),
    bio:         (formData.get('bio') as string)?.trim() || null,
    avatar_url:  (formData.get('avatar_url') as string)?.trim() || null,
    category:    (formData.get('category') as string) || 'pastoral',
    order_index: parseInt(formData.get('order_index') as string) || 0,
    is_public:   formData.get('is_public') === 'on',
  }).eq('id', id)
  revalidatePath('/nosotros')
  revalidatePath('/admin/lideres')
  redirect('/admin/lideres')
}

export async function deleteLeader(id: string) {
  const supabase = await assertAdmin()
  if (!supabase) return
  await supabase.from('church_leaders').delete().eq('id', id)
  revalidatePath('/nosotros')
  revalidatePath('/admin/lideres')
}

export async function updateMinistryLeader(ministryId: string, formData: FormData) {
  const supabase = await assertAdmin()
  if (!supabase) return
  await supabase.from('ministries').update({
    leader_name:       (formData.get('leader_name') as string)?.trim() || null,
    leader_title:      (formData.get('leader_title') as string)?.trim() || null,
    leader_bio:        (formData.get('leader_bio') as string)?.trim() || null,
    leader_avatar_url: (formData.get('leader_avatar_url') as string)?.trim() || null,
  }).eq('id', ministryId)
  revalidatePath('/ministerios')
  revalidatePath('/admin/ministerios')
}
