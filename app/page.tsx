'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PublicHeader } from '../components/PublicHeader'
import { supabase } from '../lib/supabase'

export default function HomePage() {
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
          <h1 className="text-4xl font-bold tracking-tight">Akibacard</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Collectionnez, échangez et gérez vos cartes TCG au même endroit.
          </p>
        </section>

        <section className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded bg-neutral-900 px-5 py-2.5 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className="rounded border border-neutral-300 px-5 py-2.5 text-sm dark:border-neutral-700"
          >
            Se connecter
          </Link>
        </section>
      </main>
    </>
  )
}
