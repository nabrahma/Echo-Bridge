import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignalOrb } from '@/components/ui/signal-orb'

export function Hero() {
  return (
    <section
      className="min-h-screen flex items-center pt-16"
      aria-label="Hero — EchoBridge overview"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="animate-slide-up">

            {/* Eyebrow */}
            <p className="label text-fg-3 mb-5">
              Browser-native · No install required
            </p>

            {/* Headline — big, Bebas, tight */}
            <h1
              className="font-display text-display-xl text-foreground mb-5"
              style={{ lineHeight: 0.95 }}
            >
              Stream your<br />
              <span className="text-accent">laptop audio</span><br />
              to your phone.
            </h1>

            {/* Subline — short, not marketing */}
            <p className="text-fg-2 text-base max-w-sm mb-8 leading-relaxed">
              Plug wired earphones into your phone and hear your laptop
              from anywhere in the room. No app. No account. No cloud.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Button asChild variant="primary" size="lg" id="hero-cta-broadcast">
                <Link href="/broadcast">
                  Start Broadcasting
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" id="hero-cta-join">
                <Link href="/join">Join From Phone</Link>
              </Button>
            </div>

            {/* Technical reassurance — small, muted */}
            <p className="label text-fg-4 max-w-xs leading-relaxed tracking-label">
              WebRTC peer-to-peer · Audio stays on your local network ·
              Works in Chrome and Edge
            </p>
          </div>

          {/* Right — connection diagram */}
          <div className="flex flex-col items-center gap-8 animate-fade-in lg:items-end">
            <SignalOrb size="lg" active />

            {/* Live status preview */}
            <div className="w-full max-w-xs bg-surface border border-border rounded-sm p-4">
              <p className="label text-fg-3 mb-3">How pairing works</p>
              <ol className="space-y-2">
                {[
                  'Open /broadcast on your laptop',
                  'Share the 6-char code with your phone',
                  'Open /join on your phone and enter the code',
                  'Audio flows peer-to-peer, instantly',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-fg-2">
                    <span className="label text-fg-4 mt-0.5 flex-shrink-0 w-4">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
