import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Footer root container.
 *
 * Pushes to the bottom via `mt-auto` in a flex/grid layout.
 * Uses a top border to visually separate from content.
 */
const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        'mt-auto border-t border-ulb-grey-200 bg-white px-[var(--space-linear-300)] py-4',
        className
      )}
      {...props}
    >
      {children}
    </footer>
  )
)
Footer.displayName = 'Footer'

export { Footer }
