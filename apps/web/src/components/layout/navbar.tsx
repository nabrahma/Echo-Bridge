'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Radio } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/broadcast', label: 'Broadcast' },
  { href: '/join', label: 'Join Room' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neon-yellow/10 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="EchoBridge Home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-neon-yellow/40 bg-neon-yellow/10 group-hover:bg-neon-yellow/20 transition-all duration-200">
            <Radio className="h-4 w-4 text-neon-yellow" aria-hidden="true" />
          </div>
          <span className="font-display text-2xl tracking-display text-neon-yellow">
            ECHOBRIDGE
          </span>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs uppercase tracking-wide font-medium transition-colors duration-150 focus-neon',
                pathname === link.href
                  ? 'text-neon-yellow'
                  : 'text-foreground/50 hover:text-foreground/90'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/join">Join Room</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/broadcast">Broadcast</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
