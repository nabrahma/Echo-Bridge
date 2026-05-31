'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const navLinks = [
  { href: '/',          label: 'Home'      },
  { href: '/broadcast', label: 'Broadcast' },
  { href: '/join',      label: 'Join Room' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background"
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-6 h-full flex items-center justify-between">

        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-xl tracking-display text-foreground hover:text-accent transition-colors duration-150"
          aria-label="EchoBridge — home"
        >
          EchoBridge
        </Link>

        {/* Nav links — desktop */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'label transition-colors duration-150',
                  active ? 'text-foreground' : 'text-fg-3 hover:text-fg-2'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/join"
            id="nav-join-btn"
            className={cn(
              'label px-3 h-8 inline-flex items-center rounded-sm border transition-colors duration-150',
              'border-border-mid text-fg-2 hover:border-border-strong hover:text-foreground'
            )}
          >
            Join Room
          </Link>
          <Link
            href="/broadcast"
            id="nav-broadcast-btn"
            className={cn(
              'label px-3 h-8 inline-flex items-center rounded-sm transition-colors duration-150',
              'bg-accent text-[#0A0A0A] font-semibold hover:bg-[#D9A40E]'
            )}
          >
            Broadcast
          </Link>
        </div>
      </div>
    </header>
  )
}
