import Link from 'next/link'

export function Footer() {
  return (
    <footer
      className="border-t border-border mt-20"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Left */}
        <div>
          <p className="font-display text-base tracking-display text-foreground mb-1">
            EchoBridge
          </p>
          <p className="text-sm text-fg-3">
            Browser-native audio relay. No install. No accounts.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <Link
            href="https://github.com/nabrahma/Echo-Bridge"
            target="_blank"
            rel="noopener noreferrer"
            className="label text-fg-3 hover:text-fg-2 transition-colors duration-150"
            aria-label="View source on GitHub"
          >
            GitHub
          </Link>
          <Link
            href="/broadcast"
            className="label text-fg-3 hover:text-fg-2 transition-colors duration-150"
          >
            Broadcast
          </Link>
          <Link
            href="/join"
            className="label text-fg-3 hover:text-fg-2 transition-colors duration-150"
          >
            Join Room
          </Link>
        </div>

      </div>
    </footer>
  )
}
