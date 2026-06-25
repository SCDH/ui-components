import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Returns `true` when the viewport width is below the mobile breakpoint (768px).
 *
 * Uses `window.matchMedia` with a `change` listener for responsive updates.
 * SSR-safe — defaults to `false` during server-side rendering.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    // Set initial value on mount (in case SSR defaulted wrong)
    setIsMobile(mql.matches)

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
