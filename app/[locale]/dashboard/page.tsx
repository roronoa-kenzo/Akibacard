'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { DashboardHeader } from '@/components/DashboardHeader'
import { supabase } from '@/lib/supabase'

const gameTiles = [
  {
    slug: 'pokemon',
    name: 'Pokémon',
    image: '/tcg_games/pokemon.webp',
  },
  {
    slug: 'one-piece',
    name: 'One Piece',
    image: '/tcg_games/one-piece.jpg',
  },
  {
    slug: 'yugioh',
    name: 'Yu-Gi-Oh',
    image: '/tcg_games/yugiyoh.png',
  },
] as const

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.replace('/')
        return
      }

      if (active) {
        setUser(data.session.user)
        setChecking(false)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/')
        return
      }
      setUser(session.user)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [router])

  if (checking) {
    return <div className="hero-bg min-h-screen" aria-hidden="true" />
  }

  const isLastOdd = gameTiles.length % 2 === 1

  return (
    <div className="hero-bg flex min-h-screen flex-col text-white">
      <DashboardHeader user={user} />

      <main className="flex flex-1 flex-col px-6 pb-6 md:px-12">
        <header className="mb-4">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-white/60">{t('subtitle')}</p>
        </header>

        <div className="grid flex-1 gap-4 md:grid-cols-2 md:grid-rows-2">
          {gameTiles.map((game, i) => {
            const spanFull = isLastOdd && i === gameTiles.length - 1

            return (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className={`group relative flex min-h-[28vh] items-center justify-center overflow-hidden rounded-2xl border-2 border-white/10 transition-colors duration-300 hover:border-[#B9FF48] ${
                  spanFull ? 'md:col-span-2' : ''
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${game.image})` }}
                />
                <div className="absolute inset-0 bg-black/65 transition-colors duration-300 group-hover:bg-black/55" />

                <div className="relative flex flex-col items-center gap-3 p-6 text-center md:p-8">
                  <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    {game.name}
                  </h2>
                  <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#B9FF48] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {t('explore')}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
