const steps = [
  {
    number: '01',
    device: 'Laptop',
    action: 'Open /broadcast',
    detail: 'A 6-character room code is generated and a QR code appears immediately.',
  },
  {
    number: '02',
    device: 'Phone',
    action: 'Open /join',
    detail: 'Scan the QR code or type the room code. Both devices pair over your local network.',
  },
  {
    number: '03',
    device: 'Laptop',
    action: 'Click Start Broadcast',
    detail: 'Select your tab or window. Check "Share tab audio" when the browser prompts you.',
  },
  {
    number: '04',
    device: 'Phone',
    action: 'Plug in earphones',
    detail: 'Audio streams in real time. Volume is controlled on the phone.',
  },
]

export function HowItWorks() {
  return (
    <section
      className="mx-auto max-w-6xl px-6 py-20 border-t border-border"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mb-12">
        <p className="label text-fg-3 mb-3" id="how-it-works-heading">How it works</p>
        <h2 className="font-display text-display-lg text-foreground">
          Four steps.<br />Under a minute.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col gap-3">
            {/* Step number */}
            <div className="flex items-center gap-3 mb-1">
              <span className="font-display text-3xl text-fg-4 leading-none">{step.number}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Device label */}
            <p className="label text-accent">{step.device}</p>

            {/* Action */}
            <p className="font-semibold text-foreground text-sm">{step.action}</p>

            {/* Detail */}
            <p className="text-sm text-fg-2 leading-relaxed">{step.detail}</p>
          </div>
        ))}
      </div>

      {/* Browser note */}
      <div className="mt-16 pt-8 border-t border-border">
        <p className="label text-fg-4 mb-3">Browser requirement</p>
        <p className="text-sm text-fg-2 max-w-xl leading-relaxed">
          System audio capture requires Chrome or Edge on desktop for the broadcaster.
          The phone can use any modern browser — Chrome, Safari, Firefox.
          Both devices must be on the same Wi-Fi network.
        </p>
      </div>
    </section>
  )
}
