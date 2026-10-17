type IconProps = {
  className?: string
}

export function FilmIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M8 4v16M16 4v16M3 12h18M3 8h5M3 16h5M16 8h5M16 16h5" />
    </svg>
  )
}

export function SearchIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function StarIcon({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2.6l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.5 6.4 19.7l1.4-6.3L3 9.1l6.4-.6L12 2.6z" />
    </svg>
  )
}

export function ClockIcon({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function TrayIcon({ className = 'h-8 w-8' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 13h4l2 3h6l2-3h4" />
      <path d="M5 5h14l2 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5l2-8z" />
    </svg>
  )
}

export function CloudIcon({ className = 'h-8 w-8' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5H7z" />
    </svg>
  )
}

export function PokeIcon({ className = 'h-8 w-8' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2c2.2 0 3.4 2.2 3.2 4.3 1.9.6 3.4 1.9 4.3 3.6 1.6-.5 3.2-.3 4.4.6 1.1.8 1.6 2 1.6 3.3 0 1.9-1.4 3.4-3.4 3.9-.4 1.6-1.5 3-3 3.8.1 1.1-.4 2.2-1.4 2.9-1 .7-2.3.8-3.4.2-.7.9-1.8 1.4-3 1.3-2 0-3.4-1.9-3.1-4-1.3-.9-2-2.4-1.8-4.1-1-1.2-1.1-2.8-.3-4.1.8-1.3 2.2-2 3.6-1.9.9-1.4 2.4-2.4 4.1-2.4.9 0 1.8.2 2.6.6C8.6 4.2 9.8 2 12 2z" />
    </svg>
  )
}
