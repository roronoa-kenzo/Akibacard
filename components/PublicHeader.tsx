'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { buttonVariants } from '@/components/ui/button'
import { LocaleSwitcher } from './LocaleSwitcher'

export function PublicHeader() {
  const t = useTranslations('common')

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border p-4">
      <Link href="/" className="text-sm font-semibold">
        {t('brand')}
      </Link>
      <nav className="flex items-center gap-2">
        <LocaleSwitcher />
        <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          {t('login')}
        </Link>
        <Link href="/register" className={buttonVariants({ size: 'sm' })}>
          {t('register')}
        </Link>
      </nav>
    </header>
  )
}
