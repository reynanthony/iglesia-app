'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
  revalidatePath('/admin/predicas')
  revalidatePath('/ministerios', 'layout')
  revalidatePath('/predicas')
  revalidatePath('/')
  return { success: true }
}

export async function deleteContent(contentId: string) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  await ctx.supabase.from('ministry_content').delete().eq('id', contentId)
  revalidatePath('/admin/contenido')
  revalidatePath('/admin/predicas')
  revalidatePath('/ministerios', 'layout')
  revalidatePath('/predicas')
  revalidatePath('/')
  return { success: true }
}

// ── Rooms (prayer) ───────────────────────────────────────────
export async function deleteRoom(roomId: string) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  // Service client bypasses RLS so admin can delete any room regardless of creator
  try {
    const svc = createServiceClient()
    await svc.from('rooms').delete().eq('id', roomId)
  } catch {
    await ctx.supabase.from('rooms').delete().eq('id', roomId)
  }
  revalidatePath('/admin/oracion')
  revalidatePath('/app/oracion')
  return { success: true }
}

export async function toggleRoom(roomId: string, isActive: boolean) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  try {
    const svc = createServiceClient()
    await svc.from('rooms').update({ is_active: isActive }).eq('id', roomId)
  } catch {
    await ctx.supabase.from('rooms').update({ is_active: isActive }).eq('id', roomId)
  }
  revalidatePath('/admin/oracion')
  revalidatePath('/app/oracion')
  return { success: true }
}

// ── Ministry content (admin full access) ────────────────────
async function uploadToStorage(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>,
  file: File,
  bucket: string
) {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type })
  if (error) return null
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

export async function createAdminContent(formData: FormData) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }

  const image = formData.get('image') as File
  let image_url: string | null = null
  if (image && image.size > 0) image_url = await uploadToStorage(ctx.supabase, image, 'posts')

  const ministry_id = (formData.get('ministry_id') as string) || null
  const { error } = await ctx.supabase.from('ministry_content').insert({
    title:      (formData.get('title') as string).trim(),
    body:       (formData.get('body') as string ?? '').trim(),
    type:       (formData.get('type') as string) || 'articulo',
    video_url:  (formData.get('video_url') as string ?? '').trim() || null,
    image_url,
    ministry_id,
    user_id:    ctx.userId,
    pinned:     formData.get('pinned') === 'on',
  })
  if (error) return { error: 'No se pudo crear' }
  revalidatePath('/admin/contenido')
  revalidatePath('/admin/predicas')
  revalidatePath('/ministerios', 'layout')
  revalidatePath('/predicas')
  revalidatePath('/')
  return { success: true }
}

export async function updateAdminContent(id: string, formData: FormData) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }

  const image = formData.get('image') as File
  const updates: Record<string, unknown> = {
    title:      (formData.get('title') as string).trim(),
    body:       (formData.get('body') as string ?? '').trim(),
    type:       formData.get('type') as string,
    video_url:  (formData.get('video_url') as string ?? '').trim() || null,
    ministry_id: (formData.get('ministry_id') as string) || null,
    pinned:     formData.get('pinned') === 'on',
  }
  if (image && image.size > 0) {
    const url = await uploadToStorage(ctx.supabase, image, 'posts')
    if (url) updates.image_url = url
  }
  await ctx.supabase.from('ministry_content').update(updates).eq('id', id)
  revalidatePath('/admin/contenido')
  revalidatePath('/admin/predicas')
  revalidatePath('/ministerios', 'layout')
  revalidatePath('/predicas')
  revalidatePath('/')
  return { success: true }
}

// ── Posts (admin full access) ────────────────────────────────
export async function createAdminPost(formData: FormData) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }

  const image = formData.get('image') as File
  let image_url: string | null = null
  if (image && image.size > 0) image_url = await uploadToStorage(ctx.supabase, image, 'posts')

  const { error } = await ctx.supabase.from('posts').insert({
    content:  (formData.get('content') as string ?? '').trim() || null,
    image_url,
    user_id:  ctx.userId,
    pinned:   formData.get('pinned') === 'on',
  })
  if (error) return { error: 'No se pudo publicar' }
  revalidatePath('/admin/posts')
  revalidatePath('/app/feed')
  return { success: true }
}

export async function updateAdminPost(postId: string, formData: FormData) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }

  const image = formData.get('image') as File
  const updates: Record<string, unknown> = {
    content: (formData.get('content') as string ?? '').trim() || null,
    pinned:  formData.get('pinned') === 'on',
  }
  if (image && image.size > 0) {
    const url = await uploadToStorage(ctx.supabase, image, 'posts')
    if (url) updates.image_url = url
  }
  await ctx.supabase.from('posts').update(updates).eq('id', postId)
  revalidatePath('/admin/posts')
  revalidatePath('/app/feed')
  return { success: true }
}

// ── Rooms (admin create/edit) ────────────────────────────────
export async function createAdminRoom(formData: FormData) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  const { error } = await ctx.supabase.from('rooms').insert({
    name:             (formData.get('name') as string).trim(),
    description:      (formData.get('description') as string ?? '').trim() || null,
    max_participants: parseInt(formData.get('max_participants') as string) || 20,
    created_by:       ctx.userId,
    is_active:        true,
  })
  if (error) return { error: 'No se pudo crear la sala' }
  revalidatePath('/admin/oracion')
  revalidatePath('/app/oracion')
  redirect('/admin/oracion')
}

export async function updateAdminRoom(roomId: string, formData: FormData) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  await ctx.supabase.from('rooms').update({
    name:             (formData.get('name') as string).trim(),
    description:      (formData.get('description') as string ?? '').trim() || null,
    max_participants: parseInt(formData.get('max_participants') as string) || 20,
    is_active:        formData.get('is_active') === 'on',
  }).eq('id', roomId)
  revalidatePath('/admin/oracion')
  revalidatePath('/app/oracion')
  redirect('/admin/oracion')
}

// ── Users (service role required) ───────────────────────────
export async function createAdminUser(formData: FormData) {
  const supabase = await checkAdmin()
  if (!supabase) return { error: 'No autorizado' }

  let serviceClient
  try { serviceClient = createServiceClient() }
  catch { return { error: 'Configura SUPABASE_SERVICE_ROLE_KEY en Vercel para crear usuarios desde el admin.' } }

  const email     = (formData.get('email') as string).trim()
  const password  = (formData.get('password') as string)
  const full_name = (formData.get('full_name') as string).trim()
  const username  = (formData.get('username') as string).trim()
  const role      = (formData.get('role') as string) || 'miembro'

  const { data, error } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, username },
  })
  if (error) return { error: error.message }

  await serviceClient.from('profiles').upsert({
    id: data.user.id, full_name, username, role,
  })

  revalidatePath('/admin/usuarios')
  return { success: true }
}

export async function deleteAdminUser(userId: string) {
  const supabase = await checkAdmin()
  if (!supabase) return { error: 'No autorizado' }

  let serviceClient
  try { serviceClient = createServiceClient() }
  catch { return { error: 'Configura SUPABASE_SERVICE_ROLE_KEY en Vercel para eliminar usuarios.' } }

  const { error } = await serviceClient.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/usuarios')
  return { success: true }
}

// ── Cloudinary signed upload ─────────────────────────────────
export async function getCloudinarySignature(
  folder: string = 'iglesia'
): Promise<{ signature?: string; timestamp?: number; apiKey?: string; cloudName?: string; error?: string }> {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }

  const cloudName  = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey     = process.env.CLOUDINARY_API_KEY
  const apiSecret  = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return { error: 'missing_config' }
  }

  const timestamp = Math.round(Date.now() / 1000)
  // Params must be sorted alphabetically for Cloudinary signature
  const paramStr  = `folder=${folder}&timestamp=${timestamp}`
  const { createHash } = await import('crypto')
  const signature = createHash('sha1').update(paramStr + apiSecret).digest('hex')

  return { signature, timestamp, apiKey, cloudName }
}

// ── Page images ──────────────────────────────────────────────

// Ensures the 'paginas' bucket allows large uploads (videos can be hundreds of MB).
// Called automatically when the browser client hits a file-size limit error.
export async function fixPagesBucketLimit(): Promise<{ ok?: boolean; error?: string }> {
  const supabase = await checkAdmin()
  if (!supabase) return { error: 'No autorizado' }
  try {
    const svc = createServiceClient()
    // Read current bucket settings to preserve the public flag
    const { data: bucket } = await svc.storage.getBucket('paginas')
    const { error } = await svc.storage.updateBucket('paginas', {
      public: bucket?.public ?? true,
      fileSizeLimit: '500mb',
    })
    if (error) return { error: error.message }
    return { ok: true }
  } catch (e: any) {
    return { error: e?.message ?? 'Error desconocido' }
  }
}

export async function uploadPageImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }

  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'No se seleccionó archivo' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await ctx.supabase.storage.from('paginas').upload(path, file, { contentType: file.type })
  if (error) return { error: 'Error al subir imagen' }
  const { data } = ctx.supabase.storage.from('paginas').getPublicUrl(path)
  return { url: data.publicUrl }
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

export async function savePageBlocks(page: string, blocks: any[]) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  // Strip video blocks with empty URL — they render null and hide the rest of the page silently
  const cleanBlocks = blocks.filter(b => !(b.type === 'video' && !b.props?.url?.trim()))
  const { error } = await ctx.supabase
    .from('page_content')
    .upsert(
      { page, content: { blocks: cleanBlocks }, updated_by: ctx.userId, updated_at: new Date().toISOString() },
      { onConflict: 'page' }
    )
  if (error) return { error: error.message }
  const paths = ['/', '/nosotros', '/contacto', '/eventos', '/predicas', '/ministerios']
  paths.forEach(p => revalidatePath(p))
  revalidatePath('/admin/paginas')
  return { ok: true }
}

export async function clearPageBlocks(page: string) {
  const ctx = await checkAdminOrPastor()
  if (!ctx) return { error: 'No autorizado' }
  const { error } = await ctx.supabase
    .from('page_content')
    .upsert(
      { page, content: {}, updated_by: ctx.userId, updated_at: new Date().toISOString() },
      { onConflict: 'page' }
    )
  if (error) return { error: error.message }
  const paths = ['/', '/nosotros', '/contacto', '/eventos', '/predicas', '/ministerios']
  paths.forEach(p => revalidatePath(p))
  revalidatePath('/admin/paginas')
  return { ok: true }
}

