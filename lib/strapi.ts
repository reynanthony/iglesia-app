const STRAPI = process.env.STRAPI_URL
const TOKEN  = process.env.STRAPI_API_TOKEN

export async function strapiGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T | null> {
  if (!STRAPI || !TOKEN) return null
  try {
    const url = new URL(`/api${path}`, STRAPI)
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
