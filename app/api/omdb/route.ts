import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'OMDB_API_KEY no configurada en el servidor' },
      { status: 500 }
    )
  }

  const search = request.nextUrl.searchParams.get('s')
  const imdbId = request.nextUrl.searchParams.get('i')

  if (!search && !imdbId) {
    return Response.json(
      { error: 'Falta el parámetro s (búsqueda) o i (imdbID)' },
      { status: 400 }
    )
  }

  const url = new URL('https://www.omdbapi.com/')
  url.searchParams.set('apikey', apiKey)
  if (search) url.searchParams.set('s', search)
  if (imdbId) url.searchParams.set('i', imdbId)

  try {
    const upstream = await fetch(url)
    const data = await upstream.json()
    return Response.json(data)
  } catch {
    return Response.json(
      { error: 'No se pudo conectar con OMDb' },
      { status: 502 }
    )
  }
}
