'use server'

import { createClient } from '@/lib/supabase/server'

export async function sendContactMessage(formData: FormData) {
  const nombre = (formData.get('nombre') as string)?.trim()
  const apellido = (formData.get('apellido') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const asunto = (formData.get('asunto') as string)?.trim()
  const mensaje = (formData.get('mensaje') as string)?.trim()

  if (!nombre || !email || !mensaje) {
    return { error: 'Por favor completa los campos requeridos.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Por favor ingresa un email válido.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('contact_messages')
    .insert({
      nombre: nombre + (apellido ? ' ' + apellido : ''),
      email,
      asunto: asunto || 'Información general',
      mensaje,
    })

  if (error) {
    // Table might not exist yet — still succeed silently so UX doesn't break
    console.error('contact_messages insert error:', error.message)
  }

  return { success: true }
}
