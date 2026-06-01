'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useRouter } from '@/i18n/navigation'
import { DashboardHeader } from '@/components/DashboardHeader'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.replace('/')
        return
      }

      setUser(data.session.user)
      setChecking(false)
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/')
        return
      }
      setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (checking) {
    return null
  }

  return (
    <>
      <DashboardHeader email={user?.email} />
      <main />
    </>
  )
}
