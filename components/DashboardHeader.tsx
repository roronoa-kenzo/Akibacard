'use client'

import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'
import { LocaleSwitcher } from './LocaleSwitcher'

type DashboardHeaderProps = {
  email?: string | null
}

export function DashboardHeader({ email }: DashboardHeaderProps) {
  const t = useTranslations('common')
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 p-4 dark:border-neutral-800">
      <Link href="/dashboard" className="font-semibold">
        {t('brand')}
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <LocaleSwitcher />
        {email && (
          <span className="text-neutral-600 dark:text-neutral-400">{email}</span>
        )}
        <button type="button" onClick={handleLogout} className="underline">
          {t('logout')}
        </button>
      </nav>
    </header>
  )
}
