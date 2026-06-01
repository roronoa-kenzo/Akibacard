'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LocaleSwitcher } from './LocaleSwitcher'

export function PublicHeader() {
  const t = useTranslations('common')

  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 p-4 dark:border-neutral-800">
      <Link href="/" className="font-semibold">
        {t('brand')}
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <LocaleSwitcher />
        <Link href="/login" className="underline">
          {t('login')}
        </Link>
        <Link href="/register" className="underline">
          {t('register')}
        </Link>
      </nav>
    </header>
  )
}
