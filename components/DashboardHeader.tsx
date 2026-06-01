'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

type DashboardHeaderProps = {
  email?: string | null
}

export function DashboardHeader({ email }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 p-4 dark:border-neutral-800">
      <Link href="/dashboard" className="font-semibold">
        Akibacard
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        {email && (
          <span className="text-neutral-600 dark:text-neutral-400">{email}</span>
        )}
        <button type="button" onClick={handleLogout} className="underline">
          Déconnexion
        </button>
      </nav>
    </header>
  )
}
