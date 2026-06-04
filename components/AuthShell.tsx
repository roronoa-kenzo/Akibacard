'use client'

import { PublicHeader } from '@/components/PublicHeader'

type AuthShellProps = {
  title: string
  children: React.ReactNode
}

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <main className="hero-bg relative min-h-screen overflow-hidden text-white">
      <PublicHeader />

      <section className="mx-auto flex min-h-screen w-full max-w-screen-2xl items-center justify-center px-6 py-28 md:px-12">
        <div className="w-full max-w-md">
          <header className="mb-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h1>
            <div className="mt-2 h-1 w-full max-w-xs rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300" />
          </header>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm md:p-7">
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}
