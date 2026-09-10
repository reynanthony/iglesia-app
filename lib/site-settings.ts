import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'

// Cliente sin cookies (no @/lib/supabase/server) — el nombre de marca es
// público y no depende de la sesión del usuario, así que no conviene que
// leerlo fuerce renderizado dinámico en páginas que hoy son estáticas
// (usar cookies() en Next.js opta la ruta entera a dynamic rendering).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// cache() deduplicates calls within a single React render tree (one request) —
// mismo patrón que lib/supabase/cached-user.ts.
export const getSiteSettings = cache(async () => {
  const { data } = await supabase.from('page_content').select('content').eq('page', 'site_settings').single()
  const c = (data?.content ?? {}) as Record<string, string>
  return {
    siteName: c.site_name || 'El Manantial',
  }
})
