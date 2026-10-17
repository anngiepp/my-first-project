'use client'

import { useState, useEffect, type ChangeEvent, type ReactNode } from 'react'
import axios from 'axios'
import { FilmIcon, SearchIcon, StarIcon, ClockIcon, TrayIcon } from './icons'

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

interface MovieDetail {
  Title: string
  Year: string
  Rated: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Poster: string
  Country: string
  Language: string
  Awards: string
  imdbRating: string
  Type: string
  Response: string
}

const SUGGESTIONS = ['Iron Man', 'Suits', 'Harry Potter', 'Toy Story', 'Batman']

function typeLabel(type: string) {
  return type === 'series' ? 'Serie' : 'Película'
}

function display(value?: string) {
  return !value || value === 'N/A' ? '—' : value
}

function PosterImage({
  poster,
  title,
  large = false,
}: {
  poster: string
  title: string
  large?: boolean
}) {
  const sizeClass = large ? 'h-full min-h-[280px]' : 'h-72'

  if (!poster || poster === 'N/A') {
    return (
      <div
        className={`${sizeClass} flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-mint-soft via-cream to-mint/40 text-mint-deep`}
      >
        <FilmIcon className="h-10 w-10" />
        <span className="text-sm font-semibold">Sin póster</span>
      </div>
    )
  }

  return (
    <img
      src={poster}
      alt={title}
      className={`${sizeClass} w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105`}
    />
  )
}

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-16">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-mint-soft border-t-mint-deep"></div>
      <p className="mt-4 text-sm font-semibold text-cocoa">{label}</p>
    </div>
  )
}

function MovieDetailModal({ imdbID, onClose }: { imdbID: string; onClose: () => void }) {
  const [detail, setDetail] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get<MovieDetail>(`/api/omdb?i=${imdbID}`)
        if (response.data.Response === 'False') {
          setError('No se pudo cargar el detalle.')
          setDetail(null)
        } else {
          setDetail(response.data)
        }
      } catch {
        setError('No se pudo cargar el detalle.')
        setDetail(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [imdbID])

  const facts: [string, string | undefined][] = detail
    ? [
        ['Género', detail.Genre],
        ['Director', detail.Director],
        ['Guion', detail.Writer],
        ['Actores', detail.Actors],
        ['País', detail.Country],
        ['Idioma', detail.Language],
      ]
    : []

  return (
    <div
      className="fixed inset-0 z-50 flex animate-modal-in items-center justify-center bg-chocolate-deep/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[32px] border-4 border-cream bg-snow shadow-[0_44px_110px_-30px_rgba(74,55,53,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-mint via-mint to-mint-deep px-6 py-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(rgba(74,55,53,0.5)_1.5px,transparent_1.5px)] bg-[length:16px_16px]"
          />
          <div className="relative flex items-center gap-3">
            <span className="rotate-[-6deg] rounded-full border-2 border-chocolate bg-cream px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-chocolate">
              Spoiler
            </span>
            <h3 className="font-display text-lg font-bold text-chocolate-deep">Detalle</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-chocolate font-bold text-cream shadow-md transition-all duration-300 hover:rotate-90 hover:bg-chocolate-deep"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[calc(90vh-73px)] overflow-y-auto">
          {loading ? (
            <Spinner label="Preparando el detalle..." />
          ) : error ? (
            <div className="flex flex-col items-center py-16">
              <TrayIcon className="h-10 w-10 text-cocoa" />
              <p className="mt-3 font-semibold text-chocolate">{error}</p>
            </div>
          ) : detail ? (
            <div className="grid md:grid-cols-[290px_1fr]">
              <div className="relative overflow-hidden bg-gradient-to-b from-mint-soft to-cream md:rounded-bl-[28px]">
                <PosterImage poster={detail.Poster} title={detail.Title} large />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate-deep/60 to-transparent"
                />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-cream bg-chocolate px-4 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-cream shadow-lg">
                  {typeLabel(detail.Type)}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <h4 className="font-display text-3xl font-bold leading-tight text-chocolate">
                  {detail.Title}
                </h4>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-chocolate ring-1 ring-cream-deep">
                    {detail.Year}
                  </span>
                  <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-chocolate-deep">
                    {display(detail.Rated)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-chocolate px-3 py-1 text-xs font-bold text-cream">
                    <StarIcon />
                    {display(detail.imdbRating)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1 text-xs font-bold text-chocolate ring-1 ring-cream-deep">
                    <ClockIcon />
                    {display(detail.Runtime)}
                  </span>
                </div>

                <dl className="mt-6 space-y-2.5 text-sm">
                  {facts.map(([label, value]) => (
                    <div key={label} className="flex gap-3 rounded-xl bg-cream/60 px-3 py-1.5">
                      <dt className="w-20 shrink-0 font-bold text-chocolate">{label}</dt>
                      <dd className="text-cocoa">{display(value)}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 rounded-3xl border-2 border-mint-soft bg-gradient-to-br from-mint-soft/60 via-cream to-snow p-5">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-chocolate-deep">
                    Sinopsis
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-cocoa">{display(detail.Plot)}</p>
                </div>

                <p className="mt-4 text-sm text-cocoa">
                  <strong className="font-bold text-chocolate">Premios:</strong>{' '}
                  {display(detail.Awards)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function DetailTrigger({ imdbID, children }: { imdbID: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setOpen(true)
        }}
        className="group h-full cursor-pointer"
      >
        {children}
      </div>
      {open && <MovieDetailModal imdbID={imdbID} onClose={() => setOpen(false)} />}
    </>
  )
}

function ResultCard({ movie, onSelect }: { movie: MovieSearchItem; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className="group h-full text-left">
      <article className="flex h-full flex-col overflow-hidden rounded-[28px] border-2 border-mint-soft bg-snow shadow-[0_14px_34px_-16px_rgba(74,55,53,0.45)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-mint group-hover:shadow-[0_30px_60px_-20px_rgba(74,55,53,0.55)]">
        <div className="relative">
          <PosterImage poster={movie.Poster} title={movie.Title} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[16px] bg-[radial-gradient(circle_at_50%_100%,#F2F2F2_8px,transparent_8.5px)] bg-[length:16px_16px] bg-repeat-x"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chocolate-deep/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="absolute left-3 top-3 rounded-full bg-snow/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-chocolate shadow backdrop-blur-sm">
            {typeLabel(movie.Type)}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 pt-5">
          <h3 className="font-display text-base font-semibold leading-snug text-chocolate transition-colors duration-300 group-hover:text-mint-deep">
            {movie.Title}
          </h3>
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-sm font-semibold text-cocoa">{movie.Year}</span>
            <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-chocolate-deep">
              spoilers
            </span>
          </div>
        </div>
      </article>
    </button>
  )
}

export default function SearchMovies() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MovieSearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const updateQuery = (value: string) => {
    setQuery(value)

    if (value.trim()) {
      setLoading(true)
      setError(null)
    } else {
      setResults([])
      setLoading(false)
      setError(null)
      setHasSearched(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => updateQuery(e.target.value)

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get<MovieSearchResponse>(
          `/api/omdb?s=${encodeURIComponent(trimmed)}`
        )
        if (cancelled) return
        if (response.data.Response === 'False') {
          setResults([])
        } else {
          setResults(response.data.Search ?? [])
        }
        setHasSearched(true)
      } catch {
        if (cancelled) return
        setResults([])
        setError('No se pudo conectar con OMDb. Intenta de nuevo.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return (
    <div>
      <div className="group relative">
        <SearchIcon className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-mint-deep transition-transform duration-300 group-focus-within:scale-110" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Buscar película o serie..."
          className="w-full rounded-full border-2 border-mint-soft bg-cream py-4 pl-14 pr-6 font-medium text-chocolate shadow-inner placeholder:text-cocoa/70 transition-all duration-300 focus:border-mint-deep focus:shadow-[0_0_0_5px_rgba(149,191,191,0.25)] focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-cocoa">Prueba con</span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => updateQuery(suggestion)}
            className={`rounded-full border-2 px-3 py-1 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
              query === suggestion
                ? 'border-chocolate bg-chocolate text-cream'
                : 'border-mint bg-snow text-chocolate hover:border-mint-deep'
            }`}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {hasSearched && !loading && results.length > 0 && (
        <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-cocoa">
          <span className="h-2 w-2 rounded-full bg-mint-deep"></span>
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para «
          {query.trim()}»
        </p>
      )}

      {loading ? (
        <Spinner label="Buscando delicias..." />
      ) : error ? (
        <div className="mt-6 rounded-[32px] border-2 border-dashed border-cocoa/40 bg-cream/60 p-10 text-center">
          <TrayIcon className="mx-auto h-10 w-10 text-cocoa" />
          <p className="mt-3 font-semibold text-chocolate">{error}</p>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="mt-6 rounded-[32px] border-2 border-dashed border-mint bg-cream/60 p-10 text-center">
          <SearchIcon className="mx-auto h-10 w-10 text-mint-deep" />
          <p className="mt-3 font-display text-lg font-bold text-chocolate">
            No se encontraron resultados
          </p>
          <p className="mt-1 text-sm text-cocoa">Prueba con otro título.</p>
        </div>
      ) : results.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((movie) => (
            <ResultCard
              key={movie.imdbID}
              movie={movie}
              onSelect={() => setSelectedId(movie.imdbID)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center rounded-[32px] border-2 border-dashed border-mint-soft bg-snow/60 py-12">
          <FilmIcon className="h-9 w-9 text-mint-deep" />
          <p className="mt-3 text-sm font-medium text-cocoa">
            Escribe un título para empezar a buscar...
          </p>
        </div>
      )}

      {selectedId && (
        <MovieDetailModal imdbID={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
