'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createRoom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name?.trim()) return { error: 'El nombre es requerido' }

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      name: name.trim(),
      description: description?.trim() ?? '',
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: 'No se pudo crear la sala' }

  revalidatePath('/app/oracion')
  redirect(`/app/oracion/${data.id}`)
}

export async function closeRoom(roomId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('rooms')
    .update({ is_active: false })
    .eq('id', roomId)
    .eq('created_by', user.id)

  revalidatePath('/app/oracion')
  redirect('/app/oracion')
}