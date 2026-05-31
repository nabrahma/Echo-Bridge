const features = [
  {
    id: 'no-install',
    label: 'Zero setup',
    title: 'No install.\nNo account.',
    body: 'Both devices open a URL. That\'s it. Nothing to download, nothing to sign up for.',
  },
  {
    id: 'p2p-audio',
    label: 'Architecture',
    title: 'Peer-to-peer\naudio.',
    body: 'Audio travels directly between your devices over WebRTC. It never touches a server.',
  },
  {
    id: 'wired-earphones',
    label: 'Use case',
    title: 'Wired earphones\non your phone.',
    body: 'Plug any wired earphones into your phone. Listen to your laptop from across the room.',
  },
  {
    id: 'qr-pairing',
    label: 'Pairing',
    title: 'QR or\nroom code.',
    body: 'Scan a QR code with your camera or type a 6-character code. Either way takes under 10 seconds.',
  },
]

export function FeatureCards() {
  return (
    <section
      className="mx-auto max-w-6xl px-6 py-20"
      aria-labelledby="features-heading"
    >
      <div className="mb-12">
        <p className="label text-fg-3 mb-3" id="features-heading">What it does</p>
        <div className="divider w-12" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {features.map((f) => (
          <article
            key={f.id}
            id={`feature-${f.id}`}
            className="bg-background p-6 flex flex-col gap-4"
          >
            <p className="label text-fg-4">{f.label}</p>
            <h3
              className="font-display text-display-md text-foreground"
              style={{ whiteSpace: 'pre-line' }}
            >
              {f.title}
            </h3>
            <p className="text-sm text-fg-2 leading-relaxed">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
