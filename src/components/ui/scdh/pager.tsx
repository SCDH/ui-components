import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PagerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'defaultValue'> {
  /** Number of pages. */
  count: number
  /** Current page (0-based). Makes the pager controlled. */
  index?: number
  /** Initial page (0-based) when uncontrolled. */
  defaultIndex?: number
  /** Called with the new page index when the user picks a page via arrows or the progress bar. */
  onIndexChange?: (index: number) => void
}

// ---------------------------------------------------------------------------
// Pager
// ---------------------------------------------------------------------------

/**
 * Compact navigation bar for swipeable pages: arrow buttons with a progress bar between them.
 *
 * The pager does not contain the pages and has no swipe handling itself. The host swipes its
 * pages and passes the resulting `index`; the pager in turn reports `onIndexChange` when the user
 * taps an arrow or a segment of the progress bar. Dragging over the progress bar does nothing.
 */
const Pager = React.forwardRef<HTMLElement, PagerProps>(
  (
    {
      count,
      index,
      defaultIndex = 0,
      onIndexChange,
      className,
      'aria-label': ariaLabel = 'Seitenwechsel',
      ...props
    },
    ref
  ) => {
    const [rawIndex, setIndex] = useControllableState({
      value: index,
      defaultValue: defaultIndex,
      onChange: onIndexChange
    })
    const last = Math.max(count - 1, 0)
    const current = Math.min(Math.max(rawIndex, 0), last)

    const goTo = (next: number) => {
      const clamped = Math.min(Math.max(next, 0), last)
      if (clamped !== current) setIndex(clamped)
    }

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        // `manipulation` keeps taps instant and ignores double-tap zoom; no pan gestures here
        className={cn('flex touch-manipulation items-center gap-2 px-6 py-4', className)}
        {...props}
      >
        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label="Vorherige Seite"
          className="text-ulb-grey-700"
          disabled={current <= 0}
          onClick={() => goTo(current - 1)}
        >
          <ChevronLeft />
        </Button>

        <div className="flex flex-1 justify-center">
          {/* The progress bar: a thin track with a thicker segment for the current page */}
          <div className="flex w-full max-w-40 items-center">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Seite ${i + 1} von ${count}`}
                aria-current={i === current ? 'true' : undefined}
                onClick={() => goTo(i)}
                className="group flex h-6 min-w-0 flex-1 items-center focus-visible:outline-none"
              >
                <span
                  className={cn(
                    'w-full group-focus-visible:ring-2 group-focus-visible:ring-scdh-blue-700',
                    i === current
                      ? 'h-1 rounded-full bg-scdh-blue-600'
                      : 'h-0.5 bg-border group-first:rounded-l-full group-last:rounded-r-full group-hover:bg-ulb-grey-300'
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label="Nächste Seite"
          className="text-ulb-grey-700"
          disabled={current >= last}
          onClick={() => goTo(current + 1)}
        >
          <ChevronRight />
        </Button>
      </nav>
    )
  }
)
Pager.displayName = 'Pager'

export { Pager }
