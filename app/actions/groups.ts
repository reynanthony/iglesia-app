'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function joinGroup(groupId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('group_members').insert({ group_id: groupId, user_id: user.id })
  revalidatePath('/app/grupos')
  revalidatePath(`/app/grupos/${groupId}`)
}

export async function leaveGroup(groupId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', user.id)
  revalidatePath('/app/grupos')
  revalidatePath(`/app/grupos/${groupId}`)
}

export async function createGroup(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor', 'lider'].includes(profile?.role ?? '')) redirect('/admin')

  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const type = (formData.get('type') as string) || 'general'
  const is_private = formData.get('is_private') === 'on'

  if (!name) return

  await supabase.from('groups').insert({ name, description, type, is_private, created_by: user.id })
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
  redirect('/admin/grupos')
}

export async function updateGroup(id: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor'].includes(profile?.role ?? '')) redirect('/admin')

  const name = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const type = (formData.get('type') as string) || 'general'
  const is_private = formData.get('is_private') === 'on'

  await supabase.from('groups').update({ name, description, type, is_private }).eq('id', id)
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
  redirect('/admin/grupos')
}

export async function toggleGroupActive(id: string, is_active: boolean): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('groups').update({ is_active }).eq('id', id)
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
}
