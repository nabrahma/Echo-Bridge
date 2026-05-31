import * as React from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  raised?: boolean
  noPadding?: boolean
}

/**
 * Card — the primary surface. Flat dark, thin border, no glow.
 * `active` applies an accent border only — no shadow, no glow.
 */
export function NeonCard({
  className,
  active = false,
  raised = false,
  noPadding = false,
  children,
  // Ignore glow prop silently — glow is not part of the new design
  ...props
}: CardProps & { glow?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-sm border transition-colors duration-150',
        raised ? 'bg-surface-2' : 'bg-surface',
        active
          ? 'border-accent-border'
          : 'border-border',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * NeonCardHeader — row layout for title + badge/status
 */
export function NeonCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-5 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * NeonCardTitle — section heading inside a card.
 * Uses Bebas Neue, uppercase, no color by default (white).
 */
export function NeonCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display text-xl tracking-display text-foreground uppercase', className)}
      {...props}
    >
      {children}
    </h3>
  )
}
