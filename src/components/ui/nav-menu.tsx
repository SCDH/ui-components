import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// NavMenu — Root container
// ---------------------------------------------------------------------------

const NavMenu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
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
NavMenu.displayName = 'NavMenu'

// ---------------------------------------------------------------------------
// NavMenuItems — left-aligned desktop navigation items (hidden on mobile)
// ---------------------------------------------------------------------------

const NavMenuItems = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('hidden md:flex items-center gap-[var(--space-linear-050)] h-full', className)}
      {...props}
    />
  )
)
NavMenuItems.displayName = 'NavMenuItems'

// ---------------------------------------------------------------------------
// NavMenuItem — Individual link/button
// ---------------------------------------------------------------------------

const navMenuItemVariants = cva(
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

export interface NavMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof navMenuItemVariants> {
  asChild?: boolean
}

const NavMenuItem = React.forwardRef<HTMLButtonElement, NavMenuItemProps>(
  ({ className, active, variant = 'desktop', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(navMenuItemVariants({ active, variant }), className)}
        {...props}
      />
    )
  }
)
NavMenuItem.displayName = 'NavMenuItem'

// ---------------------------------------------------------------------------
// NavMenuActions — right-aligned action buttons (hidden on mobile)
// ---------------------------------------------------------------------------

const NavMenuActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('hidden md:flex items-center gap-[var(--space-linear-075)] ml-auto', className)}
      {...props}
    />
  )
)
NavMenuActions.displayName = 'NavMenuActions'

// ---------------------------------------------------------------------------
// Mobile Navigation Components
// ---------------------------------------------------------------------------

const NavMenuMobile = DialogPrimitive.Root

const NavMenuMobileTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    className={cn(
      'md:hidden inline-flex items-center justify-center size-10 rounded-md text-ulb-grey-700 hover:bg-ulb-grey-100 transition-colors',
      className
    )}
    asChild
    {...props}
  >
    <button>{children || <Menu className="size-5" />}</button>
  </DialogPrimitive.Trigger>
))
NavMenuMobileTrigger.displayName = 'NavMenuMobileTrigger'

const NavMenuMobileContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title?: string }
>(({ className, children, title = 'Navigation', ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col w-[280px] bg-white shadow-lg focus:outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        'data-[state=closed]:duration-200 data-[state=open]:duration-300',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between h-14 px-[var(--space-linear-300)] border-b border-ulb-grey-200">
        <DialogPrimitive.Title className="font-medium text-lg text-ulb-grey-900">
          {title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Close className="inline-flex items-center justify-center size-10 rounded-md text-ulb-grey-700 hover:bg-ulb-grey-100 transition-colors">
          <X className="size-5" />
          <span className="sr-only">Schließen</span>
        </DialogPrimitive.Close>
      </div>
      <nav className="flex flex-col gap-1 p-4">{children}</nav>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
NavMenuMobileContent.displayName = 'NavMenuMobileContent'

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  NavMenu,
  NavMenuItems,
  NavMenuItem,
  NavMenuActions,
  NavMenuMobile,
  NavMenuMobileTrigger,
  NavMenuMobileContent,
  navMenuItemVariants
}
