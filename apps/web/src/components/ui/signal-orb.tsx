import { cn } from '@/lib/cn'

interface ConnectionIndicatorProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
}

/**
 * ConnectionIndicator — replaces SignalOrb.
 *
 * A clean, flat device-pairing diagram: two labeled blocks
 * connected by a line. When active, the line sweeps with an
 * amber fill to indicate live data flow. No glow, no floating,
 * no concentric rings.
 */
export function SignalOrb({ className, size = 'md', active = false }: ConnectionIndicatorProps) {
  const containerSize = { sm: 'w-48 h-20', md: 'w-72 h-28', lg: 'w-96 h-36' }[size]
  const labelSize     = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const blockSize     = size === 'lg' ? 'w-24 h-16' : size === 'md' ? 'w-20 h-14' : 'w-16 h-11'

  return (
    <div
      className={cn('relative flex items-center justify-between', containerSize, className)}
      aria-hidden="true"
    >
      {/* Laptop block */}
      <div className={cn(
        'flex flex-col items-center justify-center rounded-sm border text-center flex-shrink-0',
        blockSize,
        active ? 'border-accent-border bg-accent-subtle' : 'border-border bg-surface-2'
      )}>
        <svg viewBox="0 0 20 14" className={cn('mb-1', size === 'sm' ? 'w-4 h-3' : 'w-5 h-3.5')} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="1" y="1" width="18" height="10" rx="1" className={active ? 'stroke-accent' : 'stroke-fg-3'} />
          <path d="M0 13h20" className={active ? 'stroke-accent' : 'stroke-fg-4'} strokeLinecap="round" />
        </svg>
        <span className={cn(labelSize, 'label', active ? 'text-accent' : 'text-fg-3')}>Laptop</span>
      </div>

      {/* Connection line with optional active sweep */}
      <div className="flex-1 mx-3 relative">
        <div className="conn-line" />
        {active && <div className="conn-line conn-line-active absolute inset-0" />}

        {/* Flow dots */}
        <div className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'flex items-center gap-1.5'
        )}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                'block w-1 h-1 rounded-full',
                active ? 'bg-accent animate-pulse-dot' : 'bg-fg-4'
              )}
              style={active ? { animationDelay: `${i * 0.35}s` } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Phone block */}
      <div className={cn(
        'flex flex-col items-center justify-center rounded-sm border text-center flex-shrink-0',
        blockSize,
        active ? 'border-accent-border bg-accent-subtle' : 'border-border bg-surface-2'
      )}>
        <svg viewBox="0 0 12 20" className={cn('mb-1', size === 'sm' ? 'w-2.5 h-4' : 'w-3 h-5')} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="1" y="1" width="10" height="18" rx="2" className={active ? 'stroke-accent' : 'stroke-fg-3'} />
          <circle cx="6" cy="16.5" r="0.75" className={active ? 'fill-accent stroke-none' : 'fill-fg-4 stroke-none'} />
        </svg>
        <span className={cn(labelSize, 'label', active ? 'text-accent' : 'text-fg-3')}>Phone</span>
      </div>
    </div>
  )
}
