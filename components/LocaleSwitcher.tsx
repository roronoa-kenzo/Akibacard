'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { routing } from '@/i18n/routing'

type LocaleSwitcherProps = {
  tone?: 'default' | 'onDark'
}

export function LocaleSwitcher({ tone = 'default' }: LocaleSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()

  const base =
    tone === 'onDark'
      ? 'text-white/60 hover:text-white'
      : 'text-muted-foreground hover:text-foreground'
  const active = tone === 'onDark' ? 'text-white' : 'text-foreground'

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={cn('uppercase transition-colors', base, locale === l && active)}
        >
          {l}
        </Link>
      ))}
    </div>
  )
}
