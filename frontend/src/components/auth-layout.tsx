import type { ReactNode } from 'react'
import { CircleHelp } from 'lucide-react'

function Skyline() {
  return (
    <svg
      viewBox="0 0 1200 220"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full select-none sm:h-56"
      aria-hidden="true"
    >
      <polygon points="0,220 0,120 180,40 360,140 520,60 700,150 860,80 1020,150 1200,90 1200,220" fill="#e2e8f0" />
      <polygon points="0,220 0,170 140,150 260,190 400,160 560,200 720,165 900,195 1060,160 1200,180 1200,220" fill="#cbd5e1" />
      <rect x="120" y="150" width="40" height="70" fill="#cbd5e1" />
      <rect x="600" y="160" width="34" height="60" fill="#cbd5e1" />
      <rect x="980" y="150" width="46" height="70" fill="#cbd5e1" />
    </svg>
  )
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 w-full items-center justify-end bg-red-800 px-4 sm:px-8">
        <button
          type="button"
          aria-label="Ayuda"
          className="rounded-full p-1 text-white/90 hover:text-white"
        >
          <CircleHelp className="size-6" />
        </button>
      </header>
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-gray-100 px-4 py-10">
        <Skyline />
        <div className="relative z-10 flex w-full max-w-sm flex-col gap-4">
          {children}
        </div>
      </main>
    </div>
  )
}
