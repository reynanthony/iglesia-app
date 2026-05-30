const CMS   = process.env.STRAPI_URL
const TOKEN = process.env.STRAPI_API_TOKEN

// ── Directus collection types ──────────────────────────

export type DMinisterio = {
  id: number
  status: 'published' | 'draft'
  sort: number | null
  name: string
  slug: string
  description: string | null
  long_description: string | null
  image: string | null
  color: string | null
  icon: string | null
  leader_name: string | null
  leader_title: string | null
  leader_bio: string | null
  leader_photo: string | null
  date_created: string
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

// ── API helpers ────────────────────────────────────────

export async function cmsGet<T>(
  collection: string,
  params?: Record<string, string>,
): Promise<T[]> {
  if (!CMS || !TOKEN) return []
  try {
    const url = new URL(`/items/${collection}`, CMS)
    url.searchParams.set('limit', '100')
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const { data } = await res.json()
    return (data ?? []) as T[]
  } catch {
    return []
  }
}

export async function cmsById<T>(
  collection: string,
  id: string | number,
  params?: Record<string, string>,
): Promise<T | null> {
  if (!CMS || !TOKEN) return null
  try {
    const url = new URL(`/items/${collection}/${id}`, CMS)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: 60 },
    })
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
  if (!CMS || !TOKEN) return null
  try {
    const url = new URL(`/items/${collection}`, CMS)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const { data } = await res.json()
    return data as T
  } catch {
    return null
  }
}

export function cmsImageUrl(fileId: string | null | undefined): string | null {
  if (!fileId || !CMS) return null
  return `${CMS}/assets/${fileId}`
}
