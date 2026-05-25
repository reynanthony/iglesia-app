'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: 'Correo o contraseña incorrectos' }
  }

  redirect('/app/feed')
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        username: formData.get('username') as string,
      }
    }
  })

  if (error) {
    return { error: 'No se pudo crear la cuenta. Intenta con otro correo.' }
  }

  // If session exists, email confirmation is disabled — go straight to feed
  if (data.session) {
    redirect('/app/feed')
  }

  // Email confirmation required — tell the user to check their inbox
  return { confirm: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}