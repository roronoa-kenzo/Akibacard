'use client'

import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
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
    <header className="flex items-center justify-between gap-4 border-b border-border p-4">
      <Link href="/dashboard" className="text-sm font-semibold">
        {t('brand')}
      </Link>
      <nav className="flex items-center gap-2">
        <LocaleSwitcher />
        {email && (
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {email}
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          {t('logout')}
        </Button>
      </nav>
    </header>
  )
}
