import { Monitor, QrCode, Headphones } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Monitor,
    title: 'Open on Laptop',
    body: 'Visit EchoBridge on your laptop and click "Start Broadcasting." Select your audio source when prompted.',
  },
  {
    number: '02',
    icon: QrCode,
    title: 'Pair Your Phone',
    body: 'Scan the QR code shown on screen with your phone, or type in the 6-character room code manually.',
  },
  {
    number: '03',
    icon: Headphones,
    title: 'Plug In and Listen',
    body: 'Plug your wired earphones into the phone. Audio streams instantly. Move anywhere in the room.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-6 border-t border-neon-yellow/10" aria-label="How it works">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-widest text-neon-yellow/60 mb-3">Setup in seconds</p>
          <h2 className="font-display text-5xl tracking-display text-foreground">
            HOW IT WORKS
          </h2>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            className="absolute top-10 left-0 right-0 h-px hidden lg:block"
            style={{
              background:
                'linear-gradient(90deg, transparent 5%, rgba(255,215,0,0.15) 20%, rgba(255,215,0,0.15) 80%, transparent 95%)',
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  {/* Step indicator */}
                  <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-neon-yellow/30 bg-background">
                    <Icon className="h-8 w-8 text-neon-yellow" aria-hidden="true" />
                    {/* Number badge */}
                    <span
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-neon-yellow/40 bg-neon-yellow text-black text-xs font-bold"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                  </div>

                  <div className="font-display text-6xl tracking-display text-neon-yellow/10 mb-2 leading-none">
                    {step.number}
                  </div>

                  <h3 className="font-display text-2xl tracking-display text-foreground mb-3">
                    {step.title.toUpperCase()}
                  </h3>
                  <p className="text-sm text-foreground/55 leading-relaxed max-w-xs">
                    {step.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
