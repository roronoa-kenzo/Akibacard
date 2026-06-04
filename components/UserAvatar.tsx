'use client'

import type { User } from '@supabase/supabase-js'

type UserAvatarProps = {
  user: User | null
  size?: number
}

function avatarUrl(user: User | null) {
  const custom = user?.user_metadata?.avatar_url as string | undefined
  if (custom) return custom

  const seed = user?.email ?? user?.id ?? 'akibacard'
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`
}

export function UserAvatar({ user, size = 40 }: UserAvatarProps) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-300 p-[2px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl(user)}
        alt={user?.email ?? 'Profile'}
        className="h-full w-full rounded-full bg-[#0d0d0d] object-cover"
      />
    </span>
  )
}
