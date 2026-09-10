import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

// Cliente sin cookies (no @/lib/supabase/server) — el nombre de marca es
// público y no depende de la sesión del usuario, así que no conviene que
// leerlo fuerce renderizado dinámico en páginas que hoy son estáticas
// (usar cookies() en Next.js opta la ruta entera a dynamic rendering).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// getSiteSettings() se llama desde árboles de rutas totalmente distintos
// (layout raíz, sitio público, admin, app de miembros, /login, /registro,
// rutas de API) que no comparten un mismo padre — revalidatePath por cada
// ruta es frágil y fácil de olvidar. unstable_cache + tag permite invalidar
// TODAS esas páginas de una sola vez con updateTag('site-settings')
// (ver app/actions/admin.ts:savePageFields) cuando se guarda el nombre.
export const getSiteSettings = unstable_cache(
  async () => {
    const { data } = await supabase.from('page_content').select('content').eq('page', 'site_settings').single()
    const c = (data?.content ?? {}) as Record<string, string>
    return {
      siteName: c.site_name || 'El Manantial',
    }
  },
  ['site-settings'],
  { tags: ['site-settings'] },
)
