'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex gap-2 text-sm">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={
            locale === l
              ? 'font-semibold underline'
              : 'text-neutral-500 hover:underline dark:text-neutral-400'
          }
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
