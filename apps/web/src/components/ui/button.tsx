import * as React from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  // Primary — solid accent fill, dark text
  primary: [
    'bg-accent text-[#0A0A0A] font-semibold',
    'hover:bg-[#D9A40E] active:bg-[#B8860B]',
    'disabled:bg-fg-4 disabled:text-fg-3 disabled:cursor-not-allowed',
  ].join(' '),

  // Outline — transparent with border
  outline: [
    'bg-transparent border border-border-mid text-foreground',
    'hover:border-border-strong hover:bg-surface-2',
    'active:bg-surface-3',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  // Ghost — no border, subtle hover
  ghost: [
    'bg-transparent text-fg-2',
    'hover:bg-surface-2 hover:text-foreground',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  // Danger — muted red
  danger: [
    'bg-[#1E0A0A] border border-error/30 text-error',
    'hover:bg-[#2A0E0E] hover:border-error/50',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8  px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
}

/**
 * Button — clean, flat, single-accent. No gradients, no glow.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'outline', size = 'md', asChild, children, ...props }, ref) => {
    // asChild support: render the first child as the element
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        className: cn(
          'inline-flex items-center justify-center rounded-sm font-medium',
          'transition-colors duration-150',
          'select-none whitespace-nowrap',
          variantClasses[variant],
          sizeClasses[size],
          className,
          (children as React.ReactElement<{ className?: string }>).props.className
        ),
      })
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-sm font-medium',
          'transition-colors duration-150',
          'select-none whitespace-nowrap',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
