import * as React from 'react'
import { cn } from '@/lib/cn'

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  active?: boolean
  noPadding?: boolean
}

/**
 * NeonCard — the primary surface in EchoBridge.
 * Thin yellow border, dark background, optional active glow state.
 */
export function NeonCard({
  className,
  glow = false,
  active = false,
  noPadding = false,
  children,
  ...props
}: NeonCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-sm border bg-[#0a0a0a] transition-all duration-300',
        'border-neon-dim',
        active && 'border-neon-active',
        glow && 'shadow-neon',
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
 * NeonCardHeader — bold uppercase section heading inside a card
 */
export function NeonCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * NeonCardTitle — card title styled for the brand
 */
export function NeonCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display text-2xl tracking-display text-neon-yellow uppercase', className)}
      {...props}
    >
      {children}
    </h3>
  )
}
