import { cn } from '@/lib/cn'

interface SignalOrbProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
}

/**
 * SignalOrb — animated glowing orb representing the audio signal state.
 * The hero visual motif of EchoBridge.
 */
export function SignalOrb({ className, size = 'lg', active = false }: SignalOrbProps) {
  const sizes = {
    sm: { outer: 'w-24 h-24', inner: 'w-16 h-16', core: 'w-8 h-8' },
    md: { outer: 'w-40 h-40', inner: 'w-28 h-28', core: 'w-14 h-14' },
    lg: { outer: 'w-64 h-64', inner: 'w-44 h-44', core: 'w-20 h-20' },
  }

  const s = sizes[size]

  return (
    <div
      className={cn('relative flex items-center justify-center', s.outer, className)}
      aria-hidden="true"
    >
      {/* Outermost glow ring */}
      <div
        className={cn(
          'absolute rounded-full border',
          s.outer,
          active
            ? 'border-neon-yellow/20 animate-pulse-slow'
            : 'border-neon-yellow/10'
        )}
        style={{
          boxShadow: active
            ? '0 0 60px rgba(255,215,0,0.12), 0 0 120px rgba(255,215,0,0.05)'
            : 'none',
        }}
      />

      {/* Middle ring */}
      <div
        className={cn(
          'absolute rounded-full border',
          s.inner,
          active
            ? 'border-neon-yellow/35 animate-pulse-slow'
            : 'border-neon-yellow/20'
        )}
        style={{
          animationDelay: '0.5s',
          boxShadow: active
            ? '0 0 30px rgba(255,215,0,0.2), inset 0 0 30px rgba(255,215,0,0.04)'
            : 'inset 0 0 20px rgba(255,215,0,0.02)',
        }}
      />

      {/* Core orb */}
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          s.core,
          active ? 'animate-orb-float' : ''
        )}
        style={{
          background: active
            ? 'radial-gradient(circle at 35% 35%, rgba(255,215,0,0.9) 0%, rgba(184,134,11,0.7) 40%, rgba(255,215,0,0.3) 70%, transparent 100%)'
            : 'radial-gradient(circle at 35% 35%, rgba(255,215,0,0.3) 0%, rgba(184,134,11,0.15) 50%, transparent 100%)',
          boxShadow: active
            ? '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.25), 0 0 100px rgba(255,215,0,0.1)'
            : '0 0 15px rgba(255,215,0,0.15)',
        }}
      />

      {/* Signal rings (animated when active) */}
      {active && (
        <>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-neon-yellow/15 animate-ping"
              style={{
                width: `${25 + i * 20}%`,
                height: `${25 + i * 20}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: '2.5s',
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
