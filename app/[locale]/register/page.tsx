'use client'

import { useTranslations } from 'next-intl'
import { FormEvent, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { AuthShell } from '@/components/AuthShell'
import { PasswordRequirements } from '@/components/PasswordRequirements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isPasswordValid } from '@/lib/password'
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

  const passwordValid = isPasswordValid(password)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!passwordValid) {
      setError(t('passwordInvalid'))
      return
    }

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
    <AuthShell title={t('title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username" className="text-white/80">
            {tCommon('username')}
          </Label>
          <Input
            id="username"
            type="text"
            required
            minLength={3}
            pattern="[a-zA-Z0-9_]+"
            title={tCommon('usernamePattern')}
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-white/15 bg-black/30 text-white placeholder:text-white/35"
          />
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-requirements"
            aria-invalid={password.length > 0 && !passwordValid}
            className="border-white/15 bg-black/30 text-white placeholder:text-white/35"
          />
          <div id="password-requirements">
            <PasswordRequirements password={password} />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-green-400">{message}</p>}

        <Button
          type="submit"
          disabled={loading || !passwordValid}
          className="mt-2 w-full bg-[#B9FF48] font-bold text-black hover:opacity-90"
        >
          {loading ? t('submitting') : t('submit')}
        </Button>

        <p className="pt-1 text-center text-sm text-white/60">
          {t('hasAccount')}{' '}
          <Link href="/login" className="font-semibold text-[#B9FF48] hover:underline">
            {t('signIn')}
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
