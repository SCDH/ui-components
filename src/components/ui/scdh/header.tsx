import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Header root container.
 *
 * Features:
 * - Fixed height (80px)
 * - Horizontal flex layout with space between logo (left) and title (center)
 * - No border: the grey Menubar below separates it
 */
const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, style, ...props }, ref) => (
    <header
      ref={ref}
      style={{ '--header-height': '80px', ...style } as React.CSSProperties}
      className={cn(
        'sticky top-0 z-10 flex h-[var(--header-height,80px)] items-center justify-between bg-white px-[var(--space-linear-300)]',
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
)
Header.displayName = 'Header'

/**
 * Logo slot — left-aligned.
 *
 * Accepts an `<img>`, `<svg>`, or any React node.
 * Image height is constrained to 50px to fit the header comfortably.
 */
const HeaderLogo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center flex-shrink-0', className)} {...props}>
      {children}
    </div>
  )
)
HeaderLogo.displayName = 'HeaderLogo'

/**
 * Site title — centered.
 *
 * Uses absolute positioning to stay truly centered regardless of
 * the width of the left/right slots.
 */
const HeaderTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Wide letter-spacing as in the design; the left padding keeps the text visually centred
        'absolute left-1/2 -translate-x-1/2 pl-[0.2em] font-metawebpro text-xl font-normal tracking-[0.2em] text-ulb-grey-950',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
HeaderTitle.displayName = 'HeaderTitle'

export { Header, HeaderLogo, HeaderTitle }
