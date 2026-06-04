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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl(user)}
      alt={user?.email ?? 'Profile'}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-[#B9FF48] bg-white/10 object-cover"
    />
  )
}
