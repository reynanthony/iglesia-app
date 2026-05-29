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
    const res = await fetch(`${url}/api/upload/files?pagination[limit]=1`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    })
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      STRAPI_URL: '✓ ' + url,
      STRAPI_API_TOKEN: '✓ configurado',
      mensaje: res.ok ? 'Conexión exitosa con Strapi' : 'Strapi respondió con error',
    })
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      STRAPI_URL: '✓ ' + url,
      STRAPI_API_TOKEN: '✓ configurado',
      error: 'No se pudo conectar: ' + e.message,
    })
  }
}
