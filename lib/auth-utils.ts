import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AppRole =
  | 'admin' | 'pastor' | 'moderador'
  | 'lider' | 'colaborador' | 'miembro' | 'visitante'

export interface AuthContext {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  role: AppRole
}

/** Returns auth context (user + role) or null — no redirect */
export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  return {
    supabase,
    userId: user.id,
    role: (profile?.role ?? 'visitante') as AppRole,
  }
}

/** True if the given role is in the allowed list */
export function hasRole(
  role: AppRole | string | null | undefined,
  allowed: AppRole[],
): boolean {
  return allowed.includes((role ?? 'visitante') as AppRole)
}

/** Returns auth context or redirects to /login */
export async function requireAuth(): Promise<AuthContext> {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')
  return ctx
}

/** Returns auth context when role is allowed, null otherwise (no redirect) */
export async function requireRole(allowed: AppRole[]): Promise<AuthContext | null> {
  const ctx = await getAuthContext()
  if (!ctx) return null
  if (!hasRole(ctx.role, allowed)) return null
  return ctx
}
