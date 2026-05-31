import { Zap, Globe, Lock, Headphones } from 'lucide-react'
import { NeonCard } from '@/components/ui/neon-card'

const features = [
  {
    icon: Zap,
    title: 'Low Latency',
    body: 'WebRTC peer-to-peer transport keeps audio delay near-zero. Built for movies, not podcasts.',
    accent: 'text-neon-yellow',
  },
  {
    icon: Globe,
    title: 'Browser Native',
    body: 'No downloads, no app store. Open a URL on both devices and you\'re paired in seconds.',
    accent: 'text-neon-yellow',
  },
  {
    icon: Lock,
    title: 'Private by Default',
    body: 'Audio travels directly between your devices. The signaling server never sees your stream.',
    accent: 'text-neon-yellow',
  },
  {
    icon: Headphones,
    title: 'Wired Earphone Ready',
    body: 'Designed specifically for plugging in wired earphones to your phone as a remote audio receiver.',
    accent: 'text-neon-yellow',
  },
]

export function FeatureCards() {
  return (
    <section className="py-24 px-6" aria-label="Features">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-widest text-neon-yellow/60 mb-3">Why EchoBridge</p>
          <h2 className="font-display text-5xl tracking-display text-foreground">
            BUILT FOR ONE PURPOSE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <NeonCard
                key={f.title}
                className="group hover:border-neon-yellow/40 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-neon-yellow/20 bg-neon-yellow/5 group-hover:bg-neon-yellow/10 transition-all duration-200">
                  <Icon className="h-5 w-5 text-neon-yellow" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl tracking-display text-neon-yellow mb-2">
                  {f.title.toUpperCase()}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{f.body}</p>
              </NeonCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
