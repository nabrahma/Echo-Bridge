import { cn } from '@/lib/cn'
import type { ConnectionState } from '@echobridge/shared'

type BadgeState =
  | ConnectionState
  | 'broadcasting'
  | 'listening'
  | 'idle'

interface StatusBadgeProps {
  state: BadgeState
  label?: string
  className?: string
}

const stateConfig: Record<BadgeState, { dot: string; text: string; defaultLabel: string; pulse: boolean }> = {
  idle:          { dot: 'bg-fg-4',         text: 'text-fg-3',   defaultLabel: 'Idle',         pulse: false },
  connecting:    { dot: 'bg-warning/80',   text: 'text-fg-2',   defaultLabel: 'Connecting',   pulse: true  },
  connected:     { dot: 'bg-success',      text: 'text-fg-2',   defaultLabel: 'Connected',    pulse: false },
  broadcasting:  { dot: 'bg-accent',       text: 'text-fg-2',   defaultLabel: 'Broadcasting', pulse: true  },
  listening:     { dot: 'bg-success',      text: 'text-fg-2',   defaultLabel: 'Listening',    pulse: false },
  reconnecting:  { dot: 'bg-warning/80',   text: 'text-fg-2',   defaultLabel: 'Reconnecting', pulse: true  },
  disconnected:  { dot: 'bg-fg-4',         text: 'text-fg-3',   defaultLabel: 'Disconnected', pulse: false },
  error:         { dot: 'bg-error/80',     text: 'text-error/70', defaultLabel: 'Error',      pulse: false },
}

/**
 * StatusBadge — minimal text + dot indicator. No borders, no background.
 * Communicates state through color and text only.
 */
export function StatusBadge({ state, label, className }: StatusBadgeProps) {
  const cfg = stateConfig[state] ?? stateConfig.idle

  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      role="status"
      aria-label={label ?? cfg.defaultLabel}
    >
      <span
        className={cn(
          'status-dot',
          cfg.dot,
          cfg.pulse && 'animate-pulse-dot'
        )}
        aria-hidden="true"
      />
      <span className={cn('label', cfg.text)}>
        {label ?? cfg.defaultLabel}
      </span>
    </span>
  )
}
