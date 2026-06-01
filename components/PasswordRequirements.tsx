'use client'

import { useTranslations } from 'next-intl'
import { passwordRules } from '@/lib/password'

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
            className={
              valid
                ? 'text-green-600 dark:text-green-400'
                : 'text-neutral-500 dark:text-neutral-400'
            }
          >
            <span aria-hidden="true">{valid ? '✓' : '○'}</span>{' '}
            {t(key)}
          </li>
        )
      })}
    </ul>
  )
}
