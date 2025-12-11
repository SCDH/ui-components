import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-100 whitespace-nowrap rounded-lg font-metawebpro font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scdh-blue-700 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'text-black bg-scdh-blue-300 hover:bg-scdh-blue-200 active:bg-scdh-blue-400',
        secondary: 'bg-ulb-grey-200 text-black hover:bg-ulb-grey-100 active:bg-ulb-grey-300',
        tertiary: 'bg-white text-black hover:bg-ulb-grey-100 active:bg-ulb-grey-200',
        tertiary_alt:
          'box-border border border-ulb-grey-900 bg-white hover:bg-ulb-grey-100 active:bg-ulb-grey-200',
        link: 'text-ulb-grey-900 underline-offset-4 underline  hover:decoration-transparent'
      },
      size: {
        default: 'h-[36px] px-3 text-lg',
        sm: 'h-[28px] px-2  font-small text-md gap-075',
        lg: 'h-[36px] px-3 text-lg',
        icon: 'h-[36px] w-[36px]'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
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
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
