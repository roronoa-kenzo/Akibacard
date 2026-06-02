'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { PublicHeader } from '@/components/PublicHeader'
import { buttonVariants } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.replace('/dashboard')
        return
      }

      setChecking(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (checking) {
    return null
  }

  return (
    <>
      <PublicHeader />

      <main className="mx-auto flex max-w-2xl flex-col gap-8 p-8">
        <section className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">{tCommon('brand')}</h1>
          <p className="text-lg text-muted-foreground">{t('tagline')}</p>
        </section>

        <section className="flex flex-wrap gap-3">
          <Link href="/register" className={buttonVariants({ size: 'lg' })}>
            {t('createAccount')}
          </Link>
          <Link href="/login" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            {t('signIn')}
          </Link>
        </section>
      </main>
    </>
  )
}
