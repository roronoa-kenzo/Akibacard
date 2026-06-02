'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { useTranslations } from 'next-intl'
import {
  ArrowLeftRight,
  ChevronDown,
  Gauge,
  Images,
  Layers,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link, useRouter } from '@/i18n/navigation'
import { PublicHeader } from '@/components/PublicHeader'
import { Reveal } from '@/components/Reveal'
import { supabase } from '@/lib/supabase'

const BRAND_COLOR = '#B9FF48'
const SECTION_X_PADDING = 'px-6 md:px-12'
const CONTENT_MAX_WIDTH = 'mx-auto max-w-screen-2xl'
const SURFACE_CARD_CLASS =
  'rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:border-[#B9FF48]/40 hover:bg-white/[0.06]'
const ACCENT_BAR_CLASS = 'bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300'

const heroCard = {
  src: 'https://images.pokemontcg.io/sv8/238_hires.png',
  alt: 'Pikachu ex',
  className:
    'pointer-events-none absolute top-1/2 hidden max-w-none -translate-y-1/2 rotate-12 -left-20 w-72 drop-shadow-2xl sm:w-80 md:-left-24 md:w-96 lg:block lg:w-96 xl:-left-28 xl:scale-110',
}

const heroBrandStyle = {
  color: BRAND_COLOR,
  textShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
} as const

type FeatureKey =
  | 'prices'
  | 'collection'
  | 'evaluate'
  | 'trade'
  | 'community'
  | 'games'

const featureItems: { key: FeatureKey; Icon: ComponentType<{ className?: string }> }[] = [
  { key: 'prices', Icon: TrendingUp },
  { key: 'collection', Icon: Images },
  { key: 'evaluate', Icon: Gauge },
  { key: 'trade', Icon: ArrowLeftRight },
  { key: 'community', Icon: Users },
  { key: 'games', Icon: Layers },
] as const

export default function HomePage() {
  const t = useTranslations('home')
  const tf = useTranslations('features')
  const tg = useTranslations('games')
  const tc = useTranslations('cta')
  const tFooter = useTranslations('footer')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.replace('/dashboard')
        return
      }

      if (active) {
        setChecking(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard')
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [router])

  if (checking) {
    return <div className="hero-bg min-h-screen" aria-hidden="true" />
  }

  return (
    <div className="bg-[#0d0d0d] text-white">
      <section className="hero-bg relative min-h-screen overflow-hidden">
        <PublicHeader />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroCard.src} alt={heroCard.alt} className={heroCard.className} />

        <div className="relative mx-auto flex min-h-screen max-w-screen-2xl flex-col justify-center px-6 py-28 md:px-12">
          <div className="ml-auto flex w-full max-w-2xl flex-col lg:max-w-3xl">
            <h1 className="font-heading uppercase leading-tight tracking-tight">
              <span className="block text-5xl font-medium sm:text-6xl md:text-7xl xl:text-8xl">
                {t('heroWelcome')}
              </span>
              <span className="mt-2 block pl-12 text-5xl font-medium sm:pl-16 sm:text-6xl md:pl-24 md:text-7xl xl:text-8xl">
                {t('heroTo')}{' '}
                <span className="font-bold" style={heroBrandStyle}>
                  {t('heroBrand')}
                </span>
              </span>
            </h1>

            <div className="mt-12 max-w-xl sm:mt-16">
              <h2 className="font-heading text-lg font-medium sm:text-xl md:text-2xl">
                {t('heroSubtitleTitle')}
              </h2>
              <div className={`${ACCENT_BAR_CLASS} mt-2 h-1 w-full max-w-md rounded-full`} />
              <p className="mt-4 text-sm font-normal leading-relaxed text-white/75 sm:text-base">
                {t('heroSubtitleBody')}
              </p>
            </div>
          </div>

          <a
            href="#features"
            aria-label={t('scrollHint')}
            className="float-hint absolute bottom-8 left-1/2 text-white/50 transition-colors hover:text-[#B9FF48]"
          >
            <ChevronDown className="h-7 w-7" />
          </a>
        </div>
      </section>

      <div className={`${ACCENT_BAR_CLASS} h-1 w-full`} />

      <section id="features" className={`${SECTION_X_PADDING} py-24 md:py-32`}>
        <div className={CONTENT_MAX_WIDTH}>
          <Reveal>
            <h2 className="font-heading max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {tf('title')}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/60 sm:text-base">
              {tf('subtitle')}
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featureItems.map(({ key, Icon }, i) => (
              <Reveal key={key} delay={i * 80}>
                <article
                  className={`group h-full p-6 hover:-translate-y-1 ${SURFACE_CARD_CLASS}`}
                >
                  <span className="inline-flex rounded-xl bg-[#B9FF48]/10 p-3 text-[#B9FF48] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-heading mt-5 text-lg font-semibold">
                    {tf(`${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {tf(`${key}.desc`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`${SECTION_X_PADDING} pb-24 md:pb-32`}>
        <div className={CONTENT_MAX_WIDTH}>
          <Reveal>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {tg('title')}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/60 sm:text-base">
              {tg('subtitle')}
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[tg('pokemon'), tg('onepiece')].map((game, i) => (
              <Reveal key={game} delay={i * 100}>
                <div className={`group flex items-center justify-between p-6 ${SURFACE_CARD_CLASS}`}>
                  <span className="font-heading text-xl font-semibold">{game}</span>
                  <ArrowLeftRight className="h-5 w-5 text-[#B9FF48] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`${SECTION_X_PADDING} pb-24 md:pb-32`}>
        <Reveal className={CONTENT_MAX_WIDTH}>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-14 text-center md:px-16 md:py-20">
            <div className={`${ACCENT_BAR_CLASS} absolute inset-x-0 top-0 h-1`} />
            <h2 className="font-heading mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {tc('title')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">
              {tc('body')}
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#0d0d0d] transition hover:opacity-90"
              style={{ backgroundColor: BRAND_COLOR }}
            >
              {tc('button')}
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className={`border-t border-white/10 ${SECTION_X_PADDING} py-10`}>
        <div className={`${CONTENT_MAX_WIDTH} flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left`}>
          <div>
            <span className="font-heading text-lg font-bold">{tCommon('brand')}</span>
            <p className="mt-1 text-sm text-white/50">{tFooter('tagline')}</p>
          </div>
          <p className="text-sm text-white/40">
            {tFooter('copyright', { year: String(new Date().getFullYear()) })}
          </p>
        </div>
      </footer>
    </div>
  )
}
