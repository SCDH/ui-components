import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const WIDE_BREAKPOINT = 1024

/**
 * Returns `true` while the viewport is narrower than `breakpoint`.
 *
 * Uses `window.matchMedia` with a `change` listener for responsive updates.
 * SSR-safe — defaults to `false` during server-side rendering.
 */
function useIsBelow(breakpoint: number): boolean {
  const [isBelow, setIsBelow] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

    const onChange = (e: MediaQueryListEvent) => {
      setIsBelow(e.matches)
    }

    // Set initial value on mount (in case SSR defaulted wrong)
    setIsBelow(mql.matches)

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])

  return isBelow
}

/** Returns `true` when the viewport width is below the mobile breakpoint (768px). */
export function useIsMobile(): boolean {
  return useIsBelow(MOBILE_BREAKPOINT)
}

/** Returns `true` when the viewport is narrower than 1024px (mobile and tablet). */
export function useIsNarrow(): boolean {
  return useIsBelow(WIDE_BREAKPOINT)
}
