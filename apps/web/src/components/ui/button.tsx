import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 uppercase tracking-wide',
  {
    variants: {
      variant: {
        primary:
          'bg-neon-yellow text-black hover:bg-yellow-300 active:scale-[0.98] shadow-neon hover:shadow-neon-lg font-semibold',
        outline:
          'border border-neon-yellow/40 text-neon-yellow bg-transparent hover:bg-neon-yellow/10 hover:border-neon-yellow/70 hover:shadow-neon-sm',
        ghost:
          'text-foreground/60 hover:text-foreground hover:bg-white/5',
        danger:
          'border border-red-500/40 text-red-400 bg-transparent hover:bg-red-500/10 hover:border-red-500/70',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
