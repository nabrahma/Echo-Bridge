import { cn } from '@/lib/cn'
import type { ConnectionState } from '@echobridge/shared'

interface StatusBadgeProps {
  state: ConnectionState | 'broadcasting' | 'listening'
  label?: string
  className?: string
  showPulse?: boolean
}

const STATE_CONFIG: Record<
  string,
  { color: string; label: string; pulseClass: string }
> = {
  idle: { color: 'bg-gray-500', label: 'Idle', pulseClass: '' },
  connecting: { color: 'bg-yellow-400', label: 'Connecting', pulseClass: 'animate-pulse' },
  connected: { color: 'bg-green-500', label: 'Connected', pulseClass: 'animate-pulse-slow' },
  reconnecting: { color: 'bg-yellow-500', label: 'Reconnecting', pulseClass: 'animate-pulse' },
  disconnected: { color: 'bg-gray-500', label: 'Disconnected', pulseClass: '' },
  error: { color: 'bg-red-500', label: 'Error', pulseClass: '' },
  broadcasting: { color: 'bg-neon-yellow', label: 'Broadcasting', pulseClass: 'animate-pulse-slow' },
  listening: { color: 'bg-green-400', label: 'Listening', pulseClass: 'animate-pulse-slow' },
}

/**
 * StatusBadge — a pulse dot + uppercase label for connection/stream state.
 */
export function StatusBadge({ state, label, className, showPulse = true }: StatusBadgeProps) {
  const config = STATE_CONFIG[state] ?? STATE_CONFIG['idle']!
  const displayLabel = label ?? config.label

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs uppercase tracking-wide font-medium',
        className
      )}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      <span
        className={cn(
          'relative h-2 w-2 rounded-full flex-shrink-0',
          config.color,
          showPulse && config.pulseClass
        )}
        aria-hidden="true"
      />
      <span className="text-foreground/70">{displayLabel}</span>
    </span>
  )
}
