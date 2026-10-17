import { Suspense } from 'react'
import type { Metadata } from 'next'
import { connection } from 'next/server'
import axios from 'axios'
import SearchMovies, { DetailTrigger } from './SearchMovies'
import { FilmIcon, SearchIcon, TrayIcon } from './icons'

export const metadata: Metadata = {
  title: 'Cinespoiler — Galería de películas y series',
  description:
    'Galería de películas y series combinando renderizado en servidor y búsqueda en el cliente con la API de OMDb',
}

interface MovieSearchItem {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

interface MovieSearchResponse {
  Search?: MovieSearchItem[]
  Response: string
  Error?: string
}

async function getInitialMovies(): Promise<MovieSearchItem[]> {
  await connection()
  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) {
    throw new Error('OMDB_API_KEY no configurada en el servidor')
  }
  const response = await axios.get<MovieSearchResponse>(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=marvel`
  )
  if (response.data.Response === 'False') {
    throw new Error(response.data.Error ?? 'OMDb error')
  }
  return response.data.Search ?? []
}

function typeLabel(type: string) {
  return type === 'series' ? 'Serie' : 'Película'
}

function Wave({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
    >
      <path
        d="M0,64 C120,94 240,14 360,34 C480,54 600,92 720,82 C840,72 960,24 1080,34 C1200,44 1320,86 1440,74 L1440,90 L0,90 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PosterSlot({ movie }: { movie: MovieSearchItem }) {
  if (movie.Poster && movie.Poster !== 'N/A') {
    return (
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="h-80 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
    )
  }
  return (
    <div className="flex h-80 w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-mint-soft via-cream to-mint/40 text-mint-deep">
      <FilmIcon className="h-10 w-10" />
      <span className="text-sm font-semibold">Sin póster</span>
    </div>
  )
}

function MovieCard({ movie }: { movie: MovieSearchItem }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border-2 border-mint-soft bg-snow shadow-[0_18px_40px_-20px_rgba(74,55,53,0.5)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-mint hover:shadow-[0_38px_70px_-24px_rgba(74,55,53,0.6)]">
      <div className="relative">
        <PosterSlot movie={movie} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[18px] bg-[radial-gradient(circle_at_50%_100%,#F2F2F2_9px,transparent_9.5px)] bg-[length:18px_18px] bg-repeat-x"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate-deep/85 via-chocolate-deep/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span className="absolute left-4 top-4 rounded-full bg-snow/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-chocolate shadow-md backdrop-blur-sm">
          {typeLabel(movie.Type)}
        </span>
        <span className="absolute bottom-5 right-4 rounded-full border-2 border-cream bg-chocolate px-3 py-1 text-xs font-bold text-cream opacity-0 shadow-lg transition-all duration-500 group-hover:opacity-100">
          {movie.Year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-6">
        <h3 className="font-display text-lg font-semibold leading-snug text-chocolate transition-colors duration-300 group-hover:text-mint-deep">
          {movie.Title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-sm font-semibold text-cocoa">{movie.Year}</span>
          <span className="translate-x-1 text-xs font-black uppercase tracking-wider text-mint-deep opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            Ver spoilers →
          </span>
        </div>
      </div>
    </article>
  )
}

function GallerySkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-[32px] border-2 border-mint-soft bg-snow shadow-sm"
        >
          <div className="h-80 bg-mint-soft/70"></div>
          <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 rounded-full bg-mint-soft"></div>
            <div className="h-3 w-1/3 rounded-full bg-mint-soft"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function NoticeCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-[32px] border-2 border-dashed border-mint bg-snow/80 p-12 text-center backdrop-blur-sm">
      <TrayIcon className="mx-auto h-10 w-10 text-mint-deep" />
      <p className="mt-4 font-display text-xl font-bold text-chocolate">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-cocoa">{message}</p>
    </div>
  )
}

async function InitialGallery() {
  let movies: MovieSearchItem[] = []
  let failed = false

  try {
    movies = await getInitialMovies()
  } catch {
    failed = true
  }

  if (failed) {
    return (
      <NoticeCard
        title="No se pudieron cargar las películas"
        message="OMDb no está disponible en este momento. Recarga la página para intentarlo de nuevo."
      />
    )
  }

  if (movies.length === 0) {
    return (
      <NoticeCard title="La vitrina está vacía" message="Intenta de nuevo más tarde." />
    )
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <DetailTrigger key={movie.imdbID} imdbID={movie.imdbID}>
            <MovieCard movie={movie} />
          </DetailTrigger>
        ))}
      </div>
      <p className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-cocoa">
        <span className="h-1.5 w-1.5 rounded-full bg-mint-deep"></span>
        {movies.length} títulos servidos desde el servidor con una sola petición a OMDb
      </p>
    </>
  )
}

function SectionHeading({
  icon,
  title,
  badge,
  badgeClass,
  description,
}: {
  icon: 'film' | 'search'
  title: string
  badge: string
  badgeClass: string
  description: string
}) {
  const Icon = icon === 'film' ? FilmIcon : SearchIcon
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-mint to-mint-deep text-chocolate-deep shadow-lg shadow-mint/40 ring-4 ring-cream">
        <Icon className="h-7 w-7" />
      </span>
      <div className="min-w-0">
        <h2 className="flex flex-wrap items-center gap-3 font-display text-2xl font-bold text-chocolate sm:text-3xl">
          {title}
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] ${badgeClass}`}
          >
            {badge}
          </span>
        </h2>
        <p className="mt-1.5 text-sm text-cocoa">{description}</p>
      </div>
    </div>
  )
}

export default function MoviesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-mint via-mint to-mint-deep pb-32 pt-16">
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -left-20 -top-28 h-80 w-80 rounded-full bg-cream/50 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -right-24 top-6 h-96 w-96 rounded-full bg-snow/40 blur-3xl"
          style={{ animationDelay: '-7s' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-20rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full border-2 border-cream/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-15rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border-2 border-cream/25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(rgba(74,55,53,0.45)_1.5px,transparent_1.5px)] bg-[length:22px_22px]"
        />

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-cream/80 bg-cream/90 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-chocolate shadow-lg">
            Galería de películas y series
          </span>

          <div className="relative mt-7 inline-block">
            <h1 className="font-display text-6xl font-bold leading-none tracking-tight text-chocolate-deep [text-shadow:0_3px_0_rgba(242,232,220,0.9),0_14px_34px_rgba(74,55,53,0.35)] sm:text-8xl">
              Cinespoiler
            </h1>
            <span className="absolute -right-4 -top-5 rotate-[-10deg] rounded-full border-2 border-chocolate bg-cream px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-chocolate shadow-md sm:-right-14">
              spoiler
            </span>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium text-chocolate-deep/85 sm:text-lg">
            Una vitrina con sabor a helado de menta: la galería llega renderizada desde el servidor y
            la búsqueda responde al instante, sin recargar la página.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-chocolate px-5 py-2.5 text-sm font-semibold text-cream shadow-lg shadow-chocolate/30">
              <span className="h-2 w-2 animate-pulse rounded-full bg-mint"></span>
              SSR · Galería inicial
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-chocolate/60 bg-cream/85 px-5 py-2.5 text-sm font-semibold text-chocolate shadow-sm">
              CSR · Búsqueda en vivo
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 text-cream">
          <Wave className="h-14 sm:h-20" />
        </div>
      </header>

      <main className="relative mx-auto -mt-8 max-w-6xl px-6 pb-4">
        <section className="animate-rise">
          <SectionHeading
            icon="film"
            title="Galería inicial"
            badge="SSR"
            badgeClass="bg-mint text-chocolate-deep"
            description="Server Side Rendering: las tarjetas vienen en el HTML inicial, listas para el rastreador y para el usuario."
          />
          <div className="mt-10">
            <Suspense fallback={<GallerySkeleton />}>
              <InitialGallery />
            </Suspense>
          </div>
        </section>

        <section className="animate-rise mt-24">
          <div className="relative overflow-hidden rounded-[36px] border-2 border-mint-soft bg-snow/90 p-8 shadow-[0_28px_70px_-40px_rgba(74,55,53,0.6)] backdrop-blur-xl sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-mint/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cream-deep/50 blur-3xl"
            />
            <div className="relative">
              <SectionHeading
                icon="search"
                title="Búsqueda dinámica"
                badge="CSR"
                badgeClass="bg-chocolate text-cream"
                description="Client Side Rendering con debounce de 500 ms: escribe y los resultados aparecen sin recargar."
              />
              <div className="mt-8">
                <SearchMovies />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative mt-24 bg-mint pb-10 pt-20 text-chocolate-deep">
        <div className="absolute inset-x-0 -top-px text-mint">
          <Wave className="h-12" />
        </div>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-2xl font-bold">Cinespoiler</p>
          <p className="mt-2 text-sm font-medium text-chocolate-deep/80">
            Next.js 16 · Tailwind CSS v4 · Datos de OMDb
          </p>
        </div>
      </footer>
    </div>
  )
}
