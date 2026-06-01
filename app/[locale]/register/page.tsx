'use client'

import { useTranslations } from 'next-intl'
import { FormEvent, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const t = useTranslations('register')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim() },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    setMessage(t('confirmEmail'))
  }

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          {tCommon('username')}
          <input
            type="text"
            required
            minLength={3}
            pattern="[a-zA-Z0-9_]+"
            title={tCommon('usernamePattern')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {tCommon('email')}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          {tCommon('password')}
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && (
          <p className="text-sm text-green-700 dark:text-green-400">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-neutral-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {loading ? t('submitting') : t('submit')}
        </button>
      </form>

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {t('hasAccount')}{' '}
        <Link href="/login" className="underline">
          {t('signIn')}
        </Link>
      </p>
    </main>
  )
}
