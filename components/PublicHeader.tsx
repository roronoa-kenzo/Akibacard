'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LocaleSwitcher } from './LocaleSwitcher'

const navLink =
  'text-base font-bold uppercase tracking-wide text-[#B9FF48] transition-opacity hover:opacity-80'

export function PublicHeader() {
  const t = useTranslations('common')

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex h-24 w-full items-center justify-between px-6 md:px-12">
      <LocaleSwitcher tone="onDark" />
      <nav className="ml-auto flex items-center gap-8">
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
