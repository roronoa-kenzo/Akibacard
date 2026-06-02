'use client'

import { useTranslations } from 'next-intl'
import { passwordRules } from '@/lib/password'
import { cn } from '@/lib/utils'

type PasswordRequirementsProps = {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const t = useTranslations('register.passwordRules')

  return (
    <ul className="flex flex-col gap-1 text-xs" aria-live="polite">
      {passwordRules.map(({ key, test }) => {
        const valid = password.length > 0 && test(password)

        return (
          <li
            key={key}
            className={cn(
              'text-muted-foreground',
              valid && 'text-green-600 dark:text-green-400'
            )}
          >
            <span aria-hidden="true">{valid ? '✓' : '○'}</span> {t(key)}
          </li>
        )
      })}
    </ul>
  )
}
