'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { User } from '@supabase/supabase-js'
import { useRouter } from '@/i18n/navigation'
import { DashboardHeader } from '@/components/DashboardHeader'
import { supabase } from '@/lib/supabase'

// ─── Bannières par jeu ──────────────────────────────────────────────
// Pour changer l'image d'une bannière : modifie `image` (chemin dans /public,
// ex: '/banners/pokemon.jpg'). `title` est le nom affiché par-dessus.
const GAME_BANNERS: Record<string, { image: string; title: string }> = {
  pokemon: { image: '/tcg_games/pokemon.webp', title: 'Pokémon' },
  'one-piece': { image: '/tcg_games/one-piece.jpg', title: 'One Piece' },
  yugioh: { image: '/tcg_games/yugiyoh.png', title: 'Yu-Gi-Oh' },
}

// Nombre de cartes chargées à chaque étape du scroll infini.
const PAGE_SIZE = 40

type Card = {
  id: string
  name: string
  image_url: string | null
  rarity: string | null
  set_name: string | null
  market_price: string | null
}

export default function GamePage() {
  const t = useTranslations('game')
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>()

  const [user, setUser] = useState<User | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [gameName, setGameName] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'notFound'>('loading')
  const [reachedEnd, setReachedEnd] = useState(false)

  const gameIdRef = useRef<string | null>(null)
  const pageRef = useRef(0)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Charge la page suivante de cartes (triées des plus récentes aux plus anciennes).
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !gameIdRef.current) return
    loadingRef.current = true

    const from = pageRef.current * PAGE_SIZE
    const { data, error } = await supabase
      .from('cards')
      .select('id, name, image_url, rarity, set_name, market_price')
      .eq('game_id', gameIdRef.current)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

    if (!error && data) {
      setCards((prev) => [...prev, ...(data as Card[])])
      pageRef.current += 1
      if (data.length < PAGE_SIZE) setReachedEnd(true)
    }

    loadingRef.current = false
  }, [])

  // Auth + résolution du jeu via le slug, puis chargement de la première page.
  useEffect(() => {
    let active = true

    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        router.replace('/')
        return
      }
      if (!active) return
      setUser(sessionData.session.user)

      const { data: game } = await supabase
        .from('tcg_games')
        .select('id, name')
        .eq('slug', slug)
        .maybeSingle()

      if (!active) return
      if (!game) {
        setStatus('notFound')
        return
      }

      gameIdRef.current = game.id
      setGameName(GAME_BANNERS[slug]?.title ?? game.name)
      setStatus('ready')
      await loadMore()
    }

    init()
    return () => {
      active = false
    }
  }, [slug, router, loadMore])

  // Scroll infini : déclenche le chargement avant même d'atteindre le bas.
  useEffect(() => {
    if (status !== 'ready' || reachedEnd) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore()
      },
      { rootMargin: '600px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [status, reachedEnd, loadMore])

  if (status === 'loading') {
    return <div className="hero-bg min-h-screen" aria-hidden="true" />
  }

  if (status === 'notFound') {
    return (
      <div className="hero-bg flex min-h-screen flex-col text-white">
        <DashboardHeader user={user} />
        <div className="flex flex-1 items-center justify-center px-6 text-center text-white/60">
          {t('notFound')}
        </div>
      </div>
    )
  }

  const banner = GAME_BANNERS[slug]

  return (
    <div className="hero-bg flex min-h-screen flex-col text-white">
      <DashboardHeader user={user} />

      {/* Bannière : image de fond + titre du jeu */}
      <section className="relative flex h-44 items-end overflow-hidden sm:h-56 md:h-64">
        {banner && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <h1 className="relative px-6 pb-5 font-heading text-4xl font-bold tracking-tight sm:text-5xl md:px-12">
          {gameName}
        </h1>
      </section>

      {/* Barre linéaire qui sépare la bannière des cartes */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300" />

      {/* Grille de cartes */}
      <main className="flex-1 px-6 py-8 md:px-12">
        {reachedEnd && cards.length === 0 ? (
          <p className="py-16 text-center text-white/60">{t('empty')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cards.map((card) => (
              <article
                key={card.id}
                className="group relative aspect-[63/88] overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-colors hover:border-[#B9FF48]"
              >
                {card.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image_url}
                    alt={card.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Infos affichées au survol (glissent depuis le bas) */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full space-y-1.5 bg-gradient-to-t from-black via-black/95 to-transparent p-4 pt-8 transition-transform duration-300 group-hover:translate-y-0">
                  <h2 className="truncate text-lg font-bold" title={card.name}>
                    {card.name}
                  </h2>
                  <p className="truncate text-sm text-white/60">{card.set_name}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="truncate text-sm text-white/65">{card.rarity}</span>
                    <span className="text-base font-bold text-[#B9FF48]">
                      ${card.market_price ?? '0'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Sentinelle observée par le scroll infini */}
        <div ref={sentinelRef} className="h-10" />

        {!reachedEnd && (
          <p className="py-6 text-center text-sm text-white/40">{t('loading')}</p>
        )}
        {reachedEnd && cards.length > 0 && (
          <p className="py-6 text-center text-sm text-white/40">{t('end')}</p>
        )}
      </main>
    </div>
  )
}
