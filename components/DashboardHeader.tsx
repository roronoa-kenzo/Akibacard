'use client'

import type { User } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { BrandLogoLink } from '@/components/BrandLogoLink'
import { supabase } from '@/lib/supabase'
import { LocaleSwitcher } from './LocaleSwitcher'
import { UserAvatar } from './UserAvatar'

const navAction =
  'text-base font-bold uppercase tracking-wide text-[#B9FF48] transition-opacity hover:opacity-80'

type DashboardHeaderProps = {
  user: User | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const t = useTranslations('common')
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="relative z-20 flex h-24 w-full items-center justify-between px-6 md:px-12">
      <BrandLogoLink />
      <nav className="ml-auto flex items-center gap-4 md:gap-6">
        <LocaleSwitcher tone="onDark" />
        <button type="button" onClick={handleLogout} className={navAction}>
          {t('logout')}
        </button>
        <UserAvatar user={user} />
      </nav>
    </header>
  )
}
