import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url   = process.env.STRAPI_URL
  const token = process.env.STRAPI_API_TOKEN

  if (!url || !token) {
    return NextResponse.json({
      ok: false,
      error: 'Variables no encontradas',
      STRAPI_URL: url ? '✓ existe' : '✗ falta',
      STRAPI_API_TOKEN: token ? '✓ existe' : '✗ falta',
    })
  }

  try {
    const res = await fetch(`${url}/items/predicas?limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    })
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      CMS: '✓ ' + url,
      token: '✓ configurado',
      mensaje: res.ok ? 'Conexión exitosa con Directus' : 'Error al conectar',
    })
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      CMS: '✓ ' + url,
      token: '✓ configurado',
      error: 'No se pudo conectar: ' + e.message,
    })
  }
}
