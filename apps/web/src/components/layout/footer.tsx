import Link from 'next/link'
import { Radio } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-neon-yellow/10 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2" aria-label="EchoBridge">
            <Radio className="h-4 w-4 text-neon-yellow/60" aria-hidden="true" />
            <span className="font-display text-lg tracking-display text-neon-yellow/60">
              ECHOBRIDGE
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-foreground/30 uppercase tracking-wide text-center">
            Browser-native audio relay · WebRTC · No accounts · No cloud
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/broadcast"
              className="text-xs text-foreground/40 hover:text-foreground/70 uppercase tracking-wide transition-colors"
            >
              Broadcast
            </Link>
            <Link
              href="/join"
              className="text-xs text-foreground/40 hover:text-foreground/70 uppercase tracking-wide transition-colors"
            >
              Join
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
