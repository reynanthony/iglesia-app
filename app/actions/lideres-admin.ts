'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'pastor'].includes(profile.role ?? '')) redirect('/app/comunidad')
  return supabase
}

async function uploadAvatar(file: File, oldUrl?: string | null): Promise<string | null> {
  const svc = createServiceClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `lideres/${Date.now()}.${ext}`
  const { error } = await svc.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
  if (error) return oldUrl ?? null
  const { data } = svc.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

export async function createLider(formData: FormData) {
  const supabase = await requireAdmin()

  const file = formData.get('avatar') as File | null
  let avatar_url: string | null = null
  if (file && file.size > 0) avatar_url = await uploadAvatar(file)

  await supabase.from('church_leaders').insert({
    name:        formData.get('name') as string,
    title:       formData.get('title') as string,
    bio:         (formData.get('bio') as string) || null,
    category:    formData.get('category') as string,
    order_index: parseInt((formData.get('order_index') as string) || '0'),
    is_public:   formData.get('is_public') === 'true',
    avatar_url,
  })

  revalidatePath('/nosotros')
  revalidatePath('/admin/lideres')
  redirect('/admin/lideres')
}

export async function updateLider(id: string, formData: FormData) {
  const supabase = await requireAdmin()

  const file = formData.get('avatar') as File | null
  const { data: current } = await supabase.from('church_leaders').select('avatar_url').eq('id', id).single()

  let avatar_url = current?.avatar_url ?? null
  if (file && file.size > 0) avatar_url = await uploadAvatar(file, current?.avatar_url)

  const rawUserId = (formData.get('user_id') as string) || null

  await supabase.from('church_leaders').update({
    name:        formData.get('name') as string,
    title:       formData.get('title') as string,
    bio:         (formData.get('bio') as string) || null,
    category:    formData.get('category') as string,
    order_index: parseInt((formData.get('order_index') as string) || '0'),
    is_public:   formData.get('is_public') === 'true',
    avatar_url,
    user_id:     rawUserId,
  }).eq('id', id)

  revalidatePath('/nosotros')
  revalidatePath('/admin/lideres')
  redirect('/admin/lideres')
}

export async function deleteLider(id: string) {
  const supabase = await requireAdmin()
  await supabase.from('church_leaders').delete().eq('id', id)
  revalidatePath('/nosotros')
  revalidatePath('/admin/lideres')
}

export async function togglePublico(id: string, current: boolean) {
  const supabase = await requireAdmin()
  await supabase.from('church_leaders').update({ is_public: !current }).eq('id', id)
  revalidatePath('/nosotros')
  revalidatePath('/admin/lideres')
}
