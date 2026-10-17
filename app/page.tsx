import Link from 'next/link'
import { FilmIcon, CloudIcon, PokeIcon } from './movies/icons'

const exercises = [
  {
    icon: PokeIcon,
    title: 'Ejercicio 1.1',
    subtitle: 'Pokémon: CSR vs SSR',
    description:
      'Comparación de Client Side Rendering y Server Side Rendering con la PokéAPI.',
    links: [
      { href: '/pokemon-csr', label: 'Versión CSR' },
      { href: '/pokemon-ssr', label: 'Versión SSR' },
    ],
  },
  {
    icon: CloudIcon,
    title: 'Ejercicio 2.1',
    subtitle: 'Dashboard del clima',
    description:
      'Página híbrida: datos del servidor para Lima y widget dinámico con cuatro ciudades.',
    links: [{ href: '/weather', label: 'Abrir dashboard' }],
  },
  {
    icon: FilmIcon,
    title: 'Actividad Integradora',
    subtitle: 'Cinespoiler',
    description:
      'Galería de películas y series con SSR, búsqueda en vivo y detalle en modal usando OMDb.',
    links: [{ href: '/movies', label: 'Abrir galería' }],
    featured: true,
  },
]

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

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-mint via-mint to-mint-deep pb-28 pt-16">
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -left-20 -top-28 h-80 w-80 rounded-full bg-cream/50 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-drift pointer-events-none absolute -right-24 top-4 h-96 w-96 rounded-full bg-snow/45 blur-3xl"
          style={{ animationDelay: '-7s' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-19rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full border-2 border-cream/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(rgba(74,55,53,0.45)_1.5px,transparent_1.5px)] bg-[length:22px_22px]"
        />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-cream/80 bg-cream/90 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-chocolate shadow-lg">
            GLAB S09 · Next.js 16
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-none tracking-tight text-chocolate-deep [text-shadow:0_3px_0_rgba(242,232,220,0.9),0_14px_30px_rgba(74,55,53,0.3)] sm:text-7xl">
            Laboratorio de renderizado
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-chocolate-deep/85 sm:text-lg">
            Tres prácticas para entender cuándo usar renderizado en el servidor y cuándo en el
            cliente, con Tailwind CSS y APIs externas.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-chocolate px-5 py-2.5 text-sm font-semibold text-cream shadow-lg shadow-chocolate/30">
              Server Side Rendering
            </span>
            <span className="rounded-full border-2 border-chocolate/60 bg-cream/85 px-5 py-2.5 text-sm font-semibold text-chocolate">
              Client Side Rendering
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 text-cream">
          <Wave className="h-14 sm:h-20" />
        </div>
      </header>

      <main className="relative mx-auto -mt-8 max-w-5xl px-6 pb-20">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => {
            const Icon = exercise.icon
            return (
              <article
                key={exercise.subtitle}
                className={`group flex h-full flex-col rounded-[32px] border-2 p-7 shadow-[0_18px_40px_-22px_rgba(74,55,53,0.5)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_36px_70px_-26px_rgba(74,55,53,0.55)] ${
                  exercise.featured
                    ? 'border-mint bg-gradient-to-br from-mint/90 via-mint to-mint-deep'
                    : 'border-mint-soft bg-snow hover:border-mint'
                }`}
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-3xl shadow-lg ring-4 ring-cream ${
                    exercise.featured ? 'bg-cream text-mint-deep' : 'bg-mint text-chocolate-deep'
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </span>

                <p className="mt-6 text-[11px] font-black uppercase tracking-[0.25em] text-chocolate/70">
                  {exercise.title}
                </p>
                <h2
                  className={`mt-1 font-display text-2xl font-bold ${
                    exercise.featured ? 'text-chocolate-deep' : 'text-chocolate'
                  }`}
                >
                  {exercise.subtitle}
                </h2>
                <p
                  className={`mt-2 flex-1 text-sm leading-relaxed ${
                    exercise.featured ? 'text-chocolate-deep/85' : 'text-cocoa'
                  }`}
                >
                  {exercise.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {exercise.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                        exercise.featured
                          ? 'border-chocolate bg-cream text-chocolate hover:bg-chocolate hover:text-cream'
                          : 'border-mint bg-cream text-chocolate hover:border-mint-deep hover:bg-mint'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </main>

      <footer className="relative bg-mint pt-20 pb-10 text-chocolate-deep">
        <div className="absolute inset-x-0 -top-px text-mint">
          <Wave className="h-12" />
        </div>
        <p className="mx-auto max-w-5xl px-6 text-center text-sm font-medium text-chocolate-deep/80">
          Tailwind CSS v4 · React 19 · Datos de OMDb y PokéAPI
        </p>
      </footer>
    </div>
  )
}
