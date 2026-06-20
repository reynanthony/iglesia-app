'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { hasRole, requireAuth, requireRole } from '@/lib/auth-utils'
import { isUUID } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function joinGroup(groupId: string): Promise<void> {
  if (!isUUID(groupId)) return
  const ctx = await requireAuth()
  await ctx.supabase.from('group_members').insert({ group_id: groupId, user_id: ctx.userId })
  revalidatePath('/app/grupos')
  revalidatePath(`/app/grupos/${groupId}`)
}

export async function leaveGroup(groupId: string): Promise<void> {
  if (!isUUID(groupId)) return
  const ctx = await requireAuth()
  await ctx.supabase.from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', ctx.userId)
  revalidatePath('/app/grupos')
  revalidatePath(`/app/grupos/${groupId}`)
}

export async function createGroup(formData: FormData): Promise<void> {
  const ctx = await requireRole(['admin', 'pastor', 'lider'])
  if (!ctx) redirect('/login')

  const name        = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const type        = (formData.get('type') as string) || 'general'
  const is_private  = formData.get('is_private') === 'on'

  if (!name) return

  await ctx.supabase.from('groups').insert({ name, description, type, is_private, created_by: ctx.userId })
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
  redirect('/admin/grupos')
}

export async function updateGroup(id: string, formData: FormData): Promise<void> {
  if (!isUUID(id)) return
  const ctx = await requireRole(['admin', 'pastor'])
  if (!ctx) redirect('/login')

  const name        = (formData.get('name') as string).trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const type        = (formData.get('type') as string) || 'general'
  const is_private  = formData.get('is_private') === 'on'

  await ctx.supabase.from('groups').update({ name, description, type, is_private }).eq('id', id)
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
  redirect('/admin/grupos')
}

export async function deleteGroup(id: string): Promise<void> {
  if (!isUUID(id)) return
  const ctx = await requireRole(['admin', 'pastor'])
  if (!ctx) return

  try {
    const svc = createServiceClient()
    await svc.from('group_members').delete().eq('group_id', id)
    await svc.from('group_messages').delete().eq('group_id', id)
    await svc.from('groups').delete().eq('id', id)
  } catch {
    await ctx.supabase.from('group_members').delete().eq('group_id', id)
    await ctx.supabase.from('group_messages').delete().eq('group_id', id)
    await ctx.supabase.from('groups').delete().eq('id', id)
  }
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
}

export async function toggleGroupActive(id: string, is_active: boolean): Promise<void> {
  if (!isUUID(id)) return
  const ctx = await requireRole(['admin', 'pastor'])
  if (!ctx) return
  await ctx.supabase.from('groups').update({ is_active }).eq('id', id)
  revalidatePath('/admin/grupos')
  revalidatePath('/app/grupos')
}

// ── Invitaciones ──────────────────────────────────────────────

export async function inviteUserToGroup(groupId: string, userId: string): Promise<void> {
  if (!isUUID(groupId) || !isUUID(userId)) return
  const ctx = await requireRole(['admin', 'pastor', 'lider'])
  if (!ctx) return

  // Skip if already a member
  const { data: existing } = await ctx.supabase
    .from('group_members').select('group_id')
    .eq('group_id', groupId).eq('user_id', userId).maybeSingle()
  if (existing) return

  await ctx.supabase.from('group_invitations').upsert(
    { group_id: groupId, invited_user_id: userId, invited_by: ctx.userId, status: 'pending' },
    { onConflict: 'group_id,invited_user_id', ignoreDuplicates: true }
  )

  revalidatePath(`/admin/grupos/${groupId}/miembros`)
  revalidatePath('/app/grupos')
}

export async function acceptGroupInvite(inviteId: string): Promise<void> {
  if (!isUUID(inviteId)) return
  const ctx = await requireAuth()

  const { data: invite } = await ctx.supabase
    .from('group_invitations')
    .select('group_id, invited_user_id')
    .eq('id', inviteId)
    .eq('invited_user_id', ctx.userId)
    .eq('status', 'pending')
    .single()

  if (!invite) return

  await Promise.all([
    ctx.supabase.from('group_invitations').update({ status: 'accepted' }).eq('id', inviteId),
    ctx.supabase.from('group_members').upsert(
      { group_id: invite.group_id, user_id: ctx.userId },
      { onConflict: 'group_id,user_id', ignoreDuplicates: true }
    ),
  ])

  revalidatePath('/app/grupos')
  revalidatePath(`/app/grupos/${invite.group_id}`)
}

export async function declineGroupInvite(inviteId: string): Promise<void> {
  if (!isUUID(inviteId)) return
  const ctx = await requireAuth()
  await ctx.supabase
    .from('group_invitations')
    .update({ status: 'declined' })
    .eq('id', inviteId)
    .eq('invited_user_id', ctx.userId)
  revalidatePath('/app/grupos')
}

export async function cancelGroupInvite(inviteId: string, groupId: string): Promise<void> {
  if (!isUUID(inviteId) || !isUUID(groupId)) return
  const ctx = await requireRole(['admin', 'pastor', 'lider'])
  if (!ctx) return
  await ctx.supabase.from('group_invitations').delete().eq('id', inviteId)
  revalidatePath(`/admin/grupos/${groupId}/miembros`)
}

export async function removeGroupMember(groupId: string, userId: string): Promise<void> {
  if (!isUUID(groupId) || !isUUID(userId)) return
  const ctx = await requireRole(['admin', 'pastor', 'lider'])
  if (!ctx) return
  await ctx.supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId)
  revalidatePath(`/admin/grupos/${groupId}/miembros`)
  revalidatePath('/app/grupos')
  revalidatePath(`/app/grupos/${groupId}`)
}
