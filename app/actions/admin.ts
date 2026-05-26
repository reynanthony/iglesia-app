'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return supabase
}

async function checkAdminOrPastor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'pastor'].includes(profile?.role ?? '')) return null
  return { supabase, userId: user.id }
}

// ── Users ────────────────────────────────────────────────────
export async function updateUserRole(userId: string, role: string) {
  const supabase = await checkAdmin()
  if (!supabase) return { error: 'No autorizado' }
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) return { error: 'No se pudo actualizar' }
  revalidatePath('/admin/usuarios')
  return { success: true }
}

// ── Ministry assignments ─────────────────────────────────────
export async function assignUserToMinistry(userId: string, ministryId: string) {
  const supabase = await checkAdmin()
  if (!supabase) return { error: 'No autorizado' }
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('ministry_assignments')
    .insert({ user_id: userId, ministry_id: ministryId, assigned_by: user!.id })
  if (error) return { error: 'No se pudo asignar' }
  revalidatePath('/admin/usuarios')
  return { success: true }
}

export async function removeUserFromMinistry(userId: string, ministryId: string) {
  const supabase = await checkAdmin()
  if (!supabase) return { error: 'No autorizado' }
  await supabase
    .from('ministry_assignments')
    .delete()
    .eq('user_id', userId)
    .eq('ministry_id', ministryId)
  revalidatePath('/admin/usuarios')
  return { success: true }
}

// ── Posts ────────────────────────────────────────────────────
export async function deletePost(postId: string) {
  const supabase = await checkAdmin()
  if (!supabase) return { error: 'No autorizado' }
  await supabase.from('posts').delete().eq('id', postId)
  revalidatePath('/admin/posts')
  return { success: true }
}

export async function pinPost(postId: string, pinned: boolean) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  await ctx.supabase.from('posts').update({ pinned }).eq('id', postId)
  revalidatePath('/admin/posts')
  revalidatePath('/app/feed')
  return { success: true }
}

// ── Ministry content ─────────────────────────────────────────
export async function pinContent(contentId: string, pinned: boolean) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  await ctx.supabase.from('ministry_content').update({ pinned }).eq('id', contentId)
  revalidatePath('/admin/contenido')
  return { success: true }
}

export async function deleteContent(contentId: string) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  await ctx.supabase.from('ministry_content').delete().eq('id', contentId)
  revalidatePath('/admin/contenido')
  return { success: true }
}

// ── Rooms (prayer) ───────────────────────────────────────────
export async function deleteRoom(roomId: string) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  await ctx.supabase.from('rooms').delete().eq('id', roomId)
  revalidatePath('/admin/oracion')
  revalidatePath('/app/oracion')
  return { success: true }
}

export async function toggleRoom(roomId: string, isActive: boolean) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  await ctx.supabase.from('rooms').update({ is_active: isActive }).eq('id', roomId)
  revalidatePath('/admin/oracion')
  revalidatePath('/app/oracion')
  return { success: true }
}

// ── Page content ─────────────────────────────────────────────
export async function updatePageContent(page: string, content: Record<string, unknown>) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  const { error } = await ctx.supabase
    .from('page_content')
    .upsert({ page, content, updated_by: ctx.userId, updated_at: new Date().toISOString() },
      { onConflict: 'page' })
  if (error) return { error: 'No se pudo guardar' }
  revalidatePath('/')
  revalidatePath('/nosotros')
  revalidatePath('/contacto')
  return { success: true }
}
