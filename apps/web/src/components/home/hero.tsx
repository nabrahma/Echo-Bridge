import Link from 'next/link'
import { ArrowRight, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignalOrb } from '@/components/ui/signal-orb'
import { CyberGrid } from '@/components/ui/cyber-grid'

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background */}
      <CyberGrid withGlow />

      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,215,0,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div className="animate-slide-up">
            {/* Eyebrow label */}
            <div className="mb-6 inline-flex items-center gap-2 border border-neon-yellow/20 bg-neon-yellow/5 px-3 py-1.5 rounded-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-yellow animate-pulse-slow" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest text-neon-yellow font-medium">
                Browser-native · No install required
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[clamp(3.5rem,10vw,7rem)] leading-none tracking-display text-neon-yellow mb-6">
              YOUR LAPTOP
              <br />
              <span className="text-foreground">AUDIO.</span>
              <br />
              <span className="text-neon-yellow">ON YOUR</span>
              <br />
              <span className="text-foreground">PHONE.</span>
            </h1>

            {/* Supporting line */}
            <p className="text-foreground/60 text-lg max-w-md mb-8 leading-relaxed">
              Stream laptop audio to your phone in real time. Plug in wired earphones.
              Listen from anywhere in the room. No app install. No accounts. No clutter.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Button asChild variant="primary" size="lg" id="hero-cta-broadcast">
                <Link href="/broadcast">
                  Start Broadcasting
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" id="hero-cta-join">
                <Link href="/join">
                  <Smartphone className="h-4 w-4" aria-hidden="true" />
                  Join From Phone
                </Link>
              </Button>
            </div>

            {/* Technical reassurance */}
            <p className="text-xs uppercase tracking-widest text-foreground/30">
              Secure pairing · Local network · WebRTC peer-to-peer · Audio never leaves your network
            </p>
          </div>

          {/* Orb side */}
          <div className="flex justify-center lg:justify-end animate-fade-in">
            <div className="relative">
              <SignalOrb size="lg" active />
              {/* Decorative labels */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-right hidden lg:block">
                <div className="text-xs text-neon-yellow/60 uppercase tracking-widest mb-1">Laptop</div>
                <div className="h-px w-12 bg-neon-yellow/20 ml-auto" />
              </div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                <div className="h-px w-12 bg-neon-yellow/20 mb-1" />
                <div className="text-xs text-neon-yellow/60 uppercase tracking-widest">Phone</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
