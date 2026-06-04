'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { BrandLogoLink } from './BrandLogoLink'
import { LocaleSwitcher } from './LocaleSwitcher'

const navLink =
  'text-base font-bold uppercase tracking-wide text-[#B9FF48] transition-opacity hover:opacity-80'

export function PublicHeader() {
  const t = useTranslations('common')

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex h-24 w-full items-center justify-between px-6 md:px-12">
      <BrandLogoLink />
      <nav className="ml-auto flex items-center gap-4 md:gap-8">
        <LocaleSwitcher tone="onDark" />
        <Link href="/login" className={navLink}>
          {t('login')}
        </Link>
        <Link href="/register" className={navLink}>
          {t('register')}
        </Link>
      </nav>
    </header>
  )
}
