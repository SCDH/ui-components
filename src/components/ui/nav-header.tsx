import * as React from 'react'
import { Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// NavHeaderContext — shared mobile-menu open state
// ---------------------------------------------------------------------------

type NavHeaderContextValue = {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const NavHeaderContext = React.createContext<NavHeaderContextValue | null>(null)

function useNavHeader() {
  const ctx = React.useContext(NavHeaderContext)
  if (!ctx) {
    throw new Error('NavHeader compound components must be used within <NavHeader>')
  }
  return ctx
}

// ---------------------------------------------------------------------------
// NavHeader — Root container, provides mobile-menu state
// ---------------------------------------------------------------------------

const NavHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const [mobileOpen, setMobileOpen] = React.useState(false)

    return (
      <NavHeaderContext.Provider value={{ mobileOpen, setMobileOpen }}>
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          {children}
        </div>
      </NavHeaderContext.Provider>
    )
  }
)
NavHeader.displayName = 'NavHeader'

// ---------------------------------------------------------------------------
// NavHeaderMobileTrigger — hamburger ↔ X toggle (visible only on mobile)
// ---------------------------------------------------------------------------

const NavHeaderMobileTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const { mobileOpen, setMobileOpen } = useNavHeader()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMobileOpen(!mobileOpen)
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn(
        'md:hidden inline-flex items-center justify-center size-10 rounded-md text-ulb-grey-700 hover:bg-ulb-grey-100 transition-colors',
        className
      )}
      aria-expanded={mobileOpen}
      aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
      {...props}
    >
      {children ?? (mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />)}
    </button>
  )
})
NavHeaderMobileTrigger.displayName = 'NavHeaderMobileTrigger'

// ---------------------------------------------------------------------------
// NavHeaderMobileContent — overlay menu that covers the main area only
// ---------------------------------------------------------------------------

/**
 * Renders an overlay below the header on mobile when the menu is open.
 *
 * - Backdrop with blur covers the main content area
 * - The header remains visible and interactive (higher z-index)
 * - Click the backdrop to close
 */
const NavHeaderMobileContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { mobileOpen, setMobileOpen } = useNavHeader()

  if (!mobileOpen) return null

  return (
    <>
      {/* Blur backdrop — sits behind the header (lower z-index) */}
      <div
        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />
      {/* Menu panel — starts right below the 75px header */}
      <div
        ref={ref}
        className={cn('fixed top-[75px] inset-x-0 z-30 bg-white shadow-lg md:hidden', className)}
        {...props}
      >
        <nav className="flex flex-col gap-1 p-4">{children}</nav>
      </div>
    </>
  )
})
NavHeaderMobileContent.displayName = 'NavHeaderMobileContent'

export { NavHeader, NavHeaderMobileTrigger, NavHeaderMobileContent }
