const CMS   = process.env.STRAPI_URL   // reusing same env var name
const TOKEN = process.env.STRAPI_API_TOKEN

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
