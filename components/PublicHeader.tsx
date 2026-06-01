import Link from 'next/link'

export function PublicHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 p-4 dark:border-neutral-800">
      <Link href="/" className="font-semibold">
        Akibacard
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link href="/login" className="underline">
          Connexion
        </Link>
        <Link href="/register" className="underline">
          Inscription
        </Link>
      </nav>
    </header>
  )
}
