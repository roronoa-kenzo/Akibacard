'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { supabase } from '@/lib/supabase'

export function BrandLogoLink() {
  const [href, setHref] = useState<'/' | '/dashboard'>('/')

  useEffect(() => {
    let active = true

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (active) {
        setHref(data.session ? '/dashboard' : '/')
      }
    }

    syncSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHref(session ? '/dashboard' : '/')
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Link href={href} aria-label="Akibacard home">
      <Image src="/AKIBACARD.svg" alt="Akibacard" width={180} height={20} priority />
    </Link>
  )
}
