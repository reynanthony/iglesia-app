const CMS   = process.env.STRAPI_URL
const TOKEN = process.env.STRAPI_API_TOKEN ?? ''

// ── Directus collection types ──────────────────────────

export type DHomepage = {
  hero_eyebrow: string | null
  hero_title_main: string | null
  hero_title_accent: string | null
  hero_subtitle: string | null
  hero_image: string | null       // uuid → cmsImageUrl()
  hero_image_url: string | null   // external URL (takes priority over hero_image)
  hero_video_url: string | null   // YouTube / Vimeo / direct URL
  hero_video: string | null       // uuid → cmsImageUrl() for internal files
  hero_cta1_label: string | null
  hero_cta1_url: string | null
  hero_cta2_label: string | null
  hero_cta2_url: string | null
  verse: string | null
  verse_ref: string | null
  featured_event_title: string | null
  featured_event_desc: string | null
  event_eyebrow: string | null
  event_image: string | null      // uuid → cmsImageUrl()
  event_cta_label: string | null
  event_cta_url: string | null
  ministry1_label: string | null
  ministry1_title: string | null
  ministry1_desc: string | null
  ministry1_url: string | null
  ministry1_cta: string | null
  ministry1_image: string | null   // uuid → cmsImageUrl()
  ministry2_label: string | null
  ministry2_title: string | null
  ministry2_desc: string | null
  ministry2_url: string | null
  ministry2_image: string | null   // uuid → cmsImageUrl()
  sermons_eyebrow: string | null
  sermons_title: string | null
  sermons_cta_label: string | null
  sermons_cta_url: string | null
  sermons_badge: string | null
  ministries_eyebrow: string | null
  ministries_title: string | null
  ministries_cta: string | null
  ministries_url: string | null
  mini1_name: string | null; mini1_desc: string | null; mini1_url: string | null; mini1_image: string | null
  mini2_name: string | null; mini2_desc: string | null; mini2_url: string | null; mini2_image: string | null
  mini3_name: string | null; mini3_desc: string | null; mini3_url: string | null; mini3_image: string | null
  mini4_name: string | null; mini4_desc: string | null; mini4_url: string | null; mini4_image: string | null
  svc1_day: string | null; svc1_time: string | null; svc1_ampm: string | null; svc1_type: string | null
  svc2_day: string | null; svc2_time: string | null; svc2_ampm: string | null; svc2_type: string | null
  svc3_day: string | null; svc3_time: string | null; svc3_ampm: string | null; svc3_type: string | null
  hero_watermark: string | null
  hero_show_grid: boolean | null      // default true
  hero_grid_opacity: number | null    // 0–0.2, default 0.04
  hero_overlay_opacity: number | null // 0–1, default 0.60
  hero_text_color: string | null      // 'light' | 'dark', default 'light'
  hero_bg_color: string | null        // hex, default '#051828'
  hero_title_size: string | null      // 'sm'|'md'|'lg'|'xl', default 'xl'
  hero_title_color: string | null     // hex override for title text
  hero_accent_color: string | null    // hex override for accent text
  hero_subtitle_color: string | null  // hex override for subtitle text
  hero_eyebrow_color: string | null   // hex override for eyebrow text/line
  hero_title_animation: string | null // 'none'|'fade-up'|'reveal'|'split'|'gradient'
  hero_layout: string | null          // 'default'|'centered'
  cta_eyebrow: string | null
  cta_title_main: string | null
  cta_title_accent: string | null
  cta_body: string | null
  cta1_label: string | null; cta1_url: string | null
  cta2_label: string | null; cta2_url: string | null
  cta_watermark: string | null
}

export type DNosotros = {
  title: string | null
  subtitle: string | null
  body: string | null
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_body: string | null
  hero_image: string | null       // uuid → file picker in Directus → cmsImageUrl()
  hero_image_url: string | null   // external URL, takes priority over hero_image
  hero_video_url: string | null   // YouTube / Vimeo / direct URL
  hero_video: string | null       // uuid → file picker for internal video → cmsImageUrl()
  hero_overlay_opacity: number | null // 0–1, default 0.55
  hero_show_grid: boolean | null      // default true
  hero_text_color: string | null      // 'light' | 'dark', default 'light'
  hero_bg_color: string | null        // hex, default '#051828'
  hero_title_size: string | null      // 'sm'|'md'|'lg'|'xl', default 'lg'
  hero_title_color: string | null     // hex override for title text
  hero_accent_color: string | null    // hex override for accent text
  hero_subtitle_color: string | null  // hex override for subtitle text
  hero_eyebrow_color: string | null   // hex override for eyebrow text/line
  hero_title_animation: string | null // 'none'|'fade-up'|'reveal'|'split'|'gradient'
  hero_layout: string | null          // 'default'|'centered'
  stat_year: string | null
  stat_families: string | null
  stat_generations: string | null
  stat_ministries: string | null
  beliefs_eyebrow: string | null
  beliefs_title: string | null
}

export type DContacto = {
  address: string | null
  phone: string | null
  email: string | null
  schedule: string | null
  map_url: string | null
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null       // uuid → file picker → cmsImageUrl()
  hero_image_url: string | null   // external URL, takes priority over hero_image
  hero_video_url: string | null   // YouTube / Vimeo / direct URL
  hero_video: string | null       // uuid → file picker for internal video → cmsImageUrl()
  hero_overlay_opacity: number | null // 0–1, default 0.65
  hero_show_grid: boolean | null      // default true
  hero_text_color: string | null      // 'light' | 'dark', default 'light'
  hero_bg_color: string | null        // hex, default '#051828'
  hero_title_size: string | null      // 'sm'|'md'|'lg'|'xl', default 'lg'
  hero_title_color: string | null     // hex override for title text
  hero_accent_color: string | null    // hex override for accent text
  hero_subtitle_color: string | null  // hex override for subtitle text
  hero_eyebrow_color: string | null   // hex override for eyebrow text/line
  hero_title_animation: string | null // 'none'|'fade-up'|'reveal'|'split'|'gradient'
  hero_layout: string | null          // 'default'|'centered'
  info_eyebrow: string | null
  form_eyebrow: string | null
  first_visit_title: string | null
  first_visit_subtitle: string | null
  first_visit_body: string | null
}

export type DMinisteriosPage = {
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null       // uuid → file picker → cmsImageUrl()
  hero_image_url: string | null   // external URL, takes priority over hero_image
  hero_video_url: string | null   // YouTube / Vimeo / direct URL
  hero_video: string | null       // uuid → file picker for internal video → cmsImageUrl()
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_text_color: string | null
  hero_bg_color: string | null
  hero_title_size: string | null
  hero_title_color: string | null
  hero_accent_color: string | null
  hero_subtitle_color: string | null
  hero_eyebrow_color: string | null
  hero_title_animation: string | null
  hero_layout: string | null
  hero_watermark: string | null
  cta_eyebrow: string | null
  cta_title: string | null
  cta_link_label: string | null
  cta_link_url: string | null
}

export type DEducacion = {
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null       // uuid → file picker → cmsImageUrl()
  hero_image_url: string | null   // external URL, takes priority over hero_image
  hero_video_url: string | null   // YouTube / Vimeo / direct URL
  hero_video: string | null       // uuid → file picker for internal video → cmsImageUrl()
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_text_color: string | null
  hero_bg_color: string | null
  hero_title_size: string | null
  hero_title_color: string | null
  hero_accent_color: string | null
  hero_subtitle_color: string | null
  hero_eyebrow_color: string | null
  hero_title_animation: string | null
  hero_layout: string | null
  hero_watermark: string | null
  path1_label: string | null; path1_headline: string | null; path1_desc: string | null
  path1_tag1: string | null; path1_tag2: string | null; path1_tag3: string | null
  path2_label: string | null; path2_headline: string | null; path2_desc: string | null
  path2_tag1: string | null; path2_tag2: string | null; path2_tag3: string | null
  why_eyebrow: string | null; why_title: string | null
  why_body1: string | null; why_body2: string | null
  verse: string | null; verse_ref: string | null
  app_title: string | null; app_body: string | null
  cta_label: string | null
}

export type DDonaciones = {
  hero_eyebrow: string | null
  hero_title: string | null
  hero_verse: string | null
  hero_verse_ref: string | null
  hero_image: string | null       // uuid → file picker → cmsImageUrl()
  hero_image_url: string | null   // external URL, takes priority over hero_image
  hero_video_url: string | null   // YouTube / Vimeo / direct URL
  hero_video: string | null       // uuid → file picker for internal video → cmsImageUrl()
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_text_color: string | null
  hero_bg_color: string | null
  hero_title_size: string | null
  hero_title_color: string | null
  hero_accent_color: string | null
  hero_eyebrow_color: string | null
  hero_title_animation: string | null
  hero_layout: string | null
  bank_name: string | null; bank_account: string | null
  bank_titular: string | null; bank_rnc: string | null; bank_note: string | null
  zelle_email: string | null; zelle_name: string | null; zelle_note: string | null
  schedule_1_day: string | null; schedule_1_time: string | null; schedule_1_type: string | null
  schedule_2_day: string | null; schedule_2_time: string | null; schedule_2_type: string | null
  stat1_value: string | null; stat1_label: string | null; stat1_desc: string | null
  stat2_value: string | null; stat2_label: string | null; stat2_desc: string | null
  stat3_value: string | null; stat3_label: string | null; stat3_desc: string | null
  stat4_value: string | null; stat4_label: string | null; stat4_desc: string | null
  cta_verse: string | null; cta_verse_ref: string | null; cta_body: string | null
}

export type DEnVivo = {
  hero_image: string | null          // uuid → file picker → cmsImageUrl()
  hero_image_url: string | null      // external URL, takes priority over hero_image
  hero_video_url: string | null      // YouTube / Vimeo / direct URL
  hero_video: string | null          // uuid → file picker for internal video → cmsImageUrl()
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_bg_color: string | null
  offline_title: string | null
  offline_subtitle: string | null
  offline_next_text: string | null
  schedule_eyebrow: string | null
  schedule_title: string | null
  schedule_1_day: string | null; schedule_1_time: string | null; schedule_1_type: string | null; schedule_1_live: boolean | null
  schedule_2_day: string | null; schedule_2_time: string | null; schedule_2_type: string | null; schedule_2_live: boolean | null
  schedule_3_day: string | null; schedule_3_time: string | null; schedule_3_type: string | null; schedule_3_live: boolean | null
  cta_eyebrow: string | null; cta_title: string | null; cta_body: string | null
}

export type DOracion = {
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null          // uuid → file picker → cmsImageUrl()
  hero_image_url: string | null      // external URL, takes priority over hero_image
  hero_video_url: string | null      // YouTube / Vimeo / direct URL
  hero_video: string | null          // uuid → file picker for internal video → cmsImageUrl()
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_bg_color: string | null
  cta_eyebrow: string | null
  cta_title: string | null
  cta_body: string | null
}

export type DMinisterio = {
  id: number
  status: 'published' | 'draft' | null
  order: string | null
  name: string
  slug: string | null
  description: string | null
  long_description: string | null
  imagen: string | null     // file UUID → cmsImageUrl() (file picker in Directus)
  video_url: string | null  // YouTube / Vimeo / direct URL
  video_file: string | null // uuid for internal video files → cmsImageUrl()
  hero_watermark: string | null
  hero_overlay_opacity: number | null  // 0–1, default 0.80
  hero_show_grid: boolean | null       // default true
  hero_text_color: string | null       // 'light' | 'dark', default 'light'
  hero_bg_color: string | null         // hex, default '#051828'
  hero_title_size: string | null       // 'sm'|'md'|'lg'|'xl', default 'md'
  hero_title_color: string | null      // hex override for title text
  hero_accent_color: string | null     // hex override for accent text
  hero_subtitle_color: string | null   // hex override for subtitle text
  hero_eyebrow_color: string | null    // hex override for eyebrow text/line
  hero_title_animation: string | null  // 'none'|'fade-up'|'reveal'|'split'|'gradient'
  hero_layout: string | null           // 'default'|'centered'
  color: string | null
  icon: string | null
  leader_name: string | null
  leader_title: string | null
  leader_bio: string | null
  leader_photo: string | null
}

export type DMinisterioContenido = {
  id: number
  status: 'published' | 'draft'
  ministerio: number
  type: 'articulo' | 'video' | 'devocional' | 'anuncio'
  title: string
  body: string | null
  video_url: string | null
  image: string | null
  author: string | null
  pinned: boolean
  date_published: string | null
  date_created: string
}

export type DDevocional = {
  id: number
  status: 'published' | 'draft'
  title: string
  content: string
  verse: string | null
  verse_ref: string | null
  author: string | null
  image: string | null
  date_published: string | null
  date_created: string
}

export type DEvento = {
  id: number
  status: 'published' | 'draft'
  titulo: string
  descripcion: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  lugar: string | null
  categoria: string | null
  badge: string | null
  imagen: string | null
  visible: boolean
}

export type DPredica = {
  id: number
  title: string
  description: string | null
  video_url: string | null
  thumbnail: string | null
  series: string | null
  speaker: string | null
  date: string | null
}

export type DPredicasPage = {
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  hero_image_url: string | null
  hero_video: string | null
  hero_video_url: string | null
  hero_bg_color: string | null
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_watermark: string | null
}

export type DEventosPage = {
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  hero_image_url: string | null
  hero_video: string | null
  hero_video_url: string | null
  hero_bg_color: string | null
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_watermark: string | null
}

export type DDevoccionalesPage = {
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  hero_image_url: string | null
  hero_video: string | null
  hero_video_url: string | null
  hero_bg_color: string | null
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_watermark: string | null
}

export type DPublicacionesPage = {
  hero_eyebrow: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  hero_image_url: string | null
  hero_video: string | null
  hero_video_url: string | null
  hero_bg_color: string | null
  hero_overlay_opacity: number | null
  hero_show_grid: boolean | null
  hero_watermark: string | null
}

// ── API helpers ────────────────────────────────────────

export async function cmsGet<T>(
  collection: string,
  params?: Record<string, string>,
): Promise<T[]> {
  if (!CMS) return []
  try {
    const url = new URL(`/items/${collection}`, CMS)
    url.searchParams.set('limit', '100')
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const headers: Record<string, string> = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
    const res = await fetch(url.toString(), { headers, cache: 'no-store' })
    if (!res.ok) { console.error(`[CMS] ${collection} → HTTP ${res.status}`); return [] }
    const { data } = await res.json()
    return (data ?? []) as T[]
  } catch (e) {
    console.error(`[CMS] ${collection} fetch error:`, e)
    return []
  }
}

export async function cmsById<T>(
  collection: string,
  id: string | number,
  params?: Record<string, string>,
): Promise<T | null> {
  if (!CMS) return null
  try {
    const url = new URL(`/items/${collection}/${id}`, CMS)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const headers: Record<string, string> = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
    const res = await fetch(url.toString(), { headers, cache: 'no-store' })
    if (!res.ok) return null
    const { data } = await res.json()
    return data as T
  } catch {
    return null
  }
}

export async function cmsSingle<T>(
  collection: string,
  params?: Record<string, string>,
): Promise<T | null> {
  if (!CMS) return null
  try {
    const url = new URL(`/items/${collection}`, CMS)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const headers: Record<string, string> = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
    const res = await fetch(url.toString(), { headers, cache: 'no-store' })
    if (!res.ok) return null
    const { data } = await res.json()
    return data as T
  } catch {
    return null
  }
}

export async function cmsSingleton<T>(collection: string): Promise<T | null> {
  if (!CMS) { console.error('[CMS] STRAPI_URL not set'); return null }
  try {
    const url = new URL(`/items/${collection}`, CMS)
    const headers: Record<string, string> = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
    const res = await fetch(url.toString(), { headers, cache: 'no-store' })
    if (!res.ok) {
      console.error(`[CMS] ${collection} → HTTP ${res.status}`)
      return null
    }
    const { data } = await res.json()
    return data as T
  } catch (e) {
    console.error(`[CMS] ${collection} fetch error:`, e)
    return null
  }
}

export function cmsImageUrl(fileIdOrUrl: string | null | undefined): string | null {
  if (!fileIdOrUrl) return null
  // Already a full URL — use directly
  if (fileIdOrUrl.startsWith('http://') || fileIdOrUrl.startsWith('https://') || fileIdOrUrl.startsWith('/')) {
    return fileIdOrUrl
  }
  // Directus file UUID
  if (!CMS) return null
  return `${CMS}/assets/${fileIdOrUrl}`
}

// ── Write helpers ──────────────────────────────────────

export async function cmsCreate<T>(
  collection: string,
  data: Record<string, unknown>,
): Promise<T | null> {
  if (!CMS) return null
  try {
    const res = await fetch(`${CMS}/items/${collection}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { console.error(`[CMS] create ${collection} → HTTP ${res.status}`); return null }
    const { data: result } = await res.json()
    return result as T
  } catch (e) {
    console.error(`[CMS] create ${collection} error:`, e)
    return null
  }
}

export async function cmsUpdate<T>(
  collection: string,
  id: string | number,
  data: Record<string, unknown>,
): Promise<T | null> {
  if (!CMS) return null
  try {
    const res = await fetch(`${CMS}/items/${collection}/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { console.error(`[CMS] update ${collection}/${id} → HTTP ${res.status}`); return null }
    const { data: result } = await res.json()
    return result as T
  } catch (e) {
    console.error(`[CMS] update ${collection}/${id} error:`, e)
    return null
  }
}

export async function cmsDelete(collection: string, id: string | number): Promise<boolean> {
  if (!CMS) return false
  try {
    const res = await fetch(`${CMS}/items/${collection}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
    return res.ok
  } catch {
    return false
  }
}

export async function cmsUploadFile(file: File): Promise<string | null> {
  if (!CMS) return null
  try {
    const form = new FormData()
    form.append('file', file, file.name)
    const res = await fetch(`${CMS}/files`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: form,
    })
    if (!res.ok) { console.error(`[CMS] upload file → HTTP ${res.status}`); return null }
    const { data } = await res.json()
    return (data?.id as string) ?? null
  } catch (e) {
    console.error(`[CMS] upload file error:`, e)
    return null
  }
}
