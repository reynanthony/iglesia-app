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

  const name        = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const type        = (formData.get('type') as string) || 'general'
  const is_private  = formData.get('is_private') === 'on'

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

  const name        = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const type        = (formData.get('type') as string) || 'general'
  const is_private  = formData.get('is_private') === 'on'

  await supabase.from('groups').update({ name, description, type, is_private }).eq('id', id)
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
  redirect('/admin/grupos')
}

export async function deleteGroup(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor'].includes(profile?.role ?? '')) return

  // Remove members and messages first (FK constraints)
  await supabase.from('group_members').delete().eq('group_id', id)
  await supabase.from('group_messages').delete().eq('group_id', id)
  await supabase.from('groups').delete().eq('id', id)
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
}

export async function toggleGroupActive(id: string, is_active: boolean): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('groups').update({ is_active }).eq('id', id)
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
}

// ── Invitaciones ──────────────────────────────────────────────

export async function inviteUserToGroup(groupId: string, userId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor', 'lider'].includes(profile?.role ?? '')) return

  // Skip if already a member
  const { data: existing } = await supabase
    .from('group_members').select('group_id')
    .eq('group_id', groupId).eq('user_id', userId).maybeSingle()
  if (existing) return

  await supabase.from('group_invitations').upsert(
    { group_id: groupId, invited_user_id: userId, invited_by: user.id, status: 'pending' },
    { onConflict: 'group_id,invited_user_id', ignoreDuplicates: true }
  )

  revalidatePath(`/admin/grupos/${groupId}/miembros`)
  revalidatePath('/app/grupos')
}

export async function acceptGroupInvite(inviteId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: invite } = await supabase
    .from('group_invitations')
    .select('group_id, invited_user_id')
    .eq('id', inviteId)
    .eq('invited_user_id', user.id)
    .eq('status', 'pending')
    .single()

  if (!invite) return

  await Promise.all([
    supabase.from('group_invitations').update({ status: 'accepted' }).eq('id', inviteId),
    supabase.from('group_members').upsert(
      { group_id: invite.group_id, user_id: user.id },
      { onConflict: 'group_id,user_id', ignoreDuplicates: true }
    ),
  ])

  revalidatePath('/app/grupos')
  revalidatePath(`/app/grupos/${invite.group_id}`)
}

export async function declineGroupInvite(inviteId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('group_invitations')
    .update({ status: 'declined' })
    .eq('id', inviteId)
    .eq('invited_user_id', user.id)

  revalidatePath('/app/grupos')
}

export async function cancelGroupInvite(inviteId: string, groupId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor', 'lider'].includes(profile?.role ?? '')) return

  await supabase.from('group_invitations').delete().eq('id', inviteId)
  revalidatePath(`/admin/grupos/${groupId}/miembros`)
}

export async function removeGroupMember(groupId: string, userId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor', 'lider'].includes(profile?.role ?? '')) return

  await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId)
  revalidatePath(`/admin/grupos/${groupId}/miembros`)
  revalidatePath('/app/grupos')
  revalidatePath(`/app/grupos/${groupId}`)
}
