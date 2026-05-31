import { cn } from '@/lib/cn'

interface CyberGridProps {
  className?: string
  withNoise?: boolean
  withGlow?: boolean
}

/**
 * CyberGrid — decorative background element with yellow grid lines and optional radial glow.
 * Used as an absolute-positioned overlay layer behind content.
 */
export function CyberGrid({ className, withNoise = false, withGlow = true }: CyberGridProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {/* Grid lines */}
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-100" />

      {/* Radial glow from center */}
      {withGlow && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 215, 0, 0.06) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-16 h-16 opacity-30"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-30"
        style={{
          background:
            'linear-gradient(225deg, rgba(255,215,0,0.15) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-16 h-16 opacity-30"
        style={{
          background:
            'linear-gradient(45deg, rgba(255,215,0,0.15) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-16 h-16 opacity-30"
        style={{
          background:
            'linear-gradient(315deg, rgba(255,215,0,0.15) 0%, transparent 60%)',
        }}
      />
    </div>
  )
}
