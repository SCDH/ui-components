import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Header root container.
 *
 * Features:
 * - Fixed height (75px ≈ 10vh)
 * - Horizontal flex layout with space between logo (left) and title (center)
 * - Bottom border using design token ulb-grey-200
 */
const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, style, ...props }, ref) => (
    <header
      ref={ref}
      style={{ '--header-height': '75px', ...style } as React.CSSProperties}
      className={cn(
        'sticky top-0 z-10 flex h-[var(--header-height,75px)] items-center justify-between bg-white border-b border-ulb-grey-200 px-[var(--space-linear-300)]',
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
        'absolute left-1/2 -translate-x-1/2 font-metawebpro text-xl font-medium text-ulb-grey-900',
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
