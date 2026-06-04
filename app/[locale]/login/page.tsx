'use client'

import { useTranslations } from 'next-intl'
import { FormEvent, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { AuthShell } from '@/components/AuthShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const t = useTranslations('login')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthShell title={t('title')}>
      <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-white/80">
            {tCommon('email')}
          </Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/15 bg-black/30 text-white placeholder:text-white/35"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-white/80">
            {tCommon('password')}
          </Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/15 bg-black/30 text-white placeholder:text-white/35"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-[#B9FF48] font-bold text-black hover:opacity-90"
        >
          {loading ? t('submitting') : t('submit')}
        </Button>

        <p className="pt-1 text-center text-sm text-white/60">
          {t('noAccount')}{' '}
          <Link href="/register" className="font-semibold text-[#B9FF48] hover:underline">
            {t('signUp')}
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
