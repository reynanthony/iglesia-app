'use server'

import { createClient } from '@/lib/supabase/server'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const content = formData.get('content') as string
  if (!content?.trim()) return { error: 'Mensaje vacío' }

  const { error } = await supabase
    .from('messages')
    .insert({ user_id: user.id, content: content.trim() })

  if (error) return { error: 'No se pudo enviar' }
  return { success: true }
}
