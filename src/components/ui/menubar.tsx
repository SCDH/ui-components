import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Menubar — Root container (horizontal navigation bar)
// ---------------------------------------------------------------------------

const Menubar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        'relative flex items-center h-14 bg-white border-b border-ulb-grey-200 px-[var(--space-linear-300)]',
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
)
Menubar.displayName = 'Menubar'

// ---------------------------------------------------------------------------
// MenubarItems — left-aligned desktop navigation items (hidden on mobile)
// ---------------------------------------------------------------------------

const MenubarItems = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('hidden md:flex items-center gap-[var(--space-linear-050)] h-full', className)}
      {...props}
    />
  )
)
MenubarItems.displayName = 'MenubarItems'

// ---------------------------------------------------------------------------
// MenubarItem — Individual link/button
// ---------------------------------------------------------------------------

const menubarItemVariants = cva(
  'inline-flex items-center justify-center text-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scah-blue-700 cursor-pointer select-none',
  {
    variants: {
      active: {
        true: '',
        false: ''
      },
      variant: {
        desktop: '',
        mobile: ''
      }
    },
    compoundVariants: [
      {
        variant: 'desktop',
        active: false,
        className:
          'h-full px-[var(--space-linear-150)] text-ulb-grey-700 hover:text-ulb-grey-900 hover:border-ulb-grey-200 border-b-[3px] border-transparent'
      },
      {
        variant: 'desktop',
        active: true,
        className:
          'h-full px-[var(--space-linear-150)] text-scah-blue-700 border-b-[3px] border-scah-blue-700'
      },
      {
        variant: 'mobile',
        active: false,
        className: 'text-ulb-grey-700 hover:bg-ulb-grey-100'
      },
      {
        variant: 'mobile',
        active: true,
        className: 'text-scah-blue-700 bg-ulb-grey-100'
      }
    ],
    defaultVariants: {
      active: false,
      variant: 'desktop'
    }
  }
)

export interface MenubarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof menubarItemVariants> {
  asChild?: boolean
}

const MenubarItem = React.forwardRef<HTMLButtonElement, MenubarItemProps>(
  ({ className, active, variant = 'desktop', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(menubarItemVariants({ active, variant }), className)}
        {...props}
      />
    )
  }
)
MenubarItem.displayName = 'MenubarItem'

// ---------------------------------------------------------------------------
// MenubarActions — right-aligned action buttons (hidden on mobile)
// ---------------------------------------------------------------------------

const MenubarActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('hidden md:flex items-center gap-[var(--space-linear-075)] ml-auto', className)}
      {...props}
    />
  )
)
MenubarActions.displayName = 'MenubarActions'

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Menubar, MenubarItems, MenubarItem, MenubarActions, menubarItemVariants }
