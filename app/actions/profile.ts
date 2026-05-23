'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const full_name = formData.get('full_name') as string
  const bio = formData.get('bio') as string
  const avatarFile = formData.get('avatar') as File

  let avatar_url: string | undefined

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, avatarFile, { upsert: true })

    if (!uploadError) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = `${data.publicUrl}?t=${Date.now()}`
    }
  }

  const updates: any = { full_name, bio }
  if (avatar_url) updates.avatar_url = avatar_url

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) return { error: 'No se pudo actualizar el perfil' }

  revalidatePath('/app/feed')
  revalidatePath(`/app/perfil`)
  return { success: true }
}