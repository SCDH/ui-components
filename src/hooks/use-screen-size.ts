import * as React from 'react'

export type ScreenSize = 'mobile' | 'tablet' | 'desktop'

/** Same limit as `useIsMobile` (Tailwind `md`). */
const TABLET_MIN_WIDTH = 768
/** Tailwind `lg`. */
const DESKTOP_MIN_WIDTH = 1024

function read(): ScreenSize {
  if (typeof window === 'undefined') return 'desktop'
  if (window.innerWidth < TABLET_MIN_WIDTH) return 'mobile'
  if (window.innerWidth < DESKTOP_MIN_WIDTH) return 'tablet'
  return 'desktop'
}

/**
 * Returns the current screen class: `mobile` (< 768px), `tablet` (768-1023px) or `desktop`
 * (>= 1024px). SSR-safe, defaults to `desktop` on the server.
 */
export function useScreenSize(): ScreenSize {
  const [size, setSize] = React.useState<ScreenSize>(read)

  React.useEffect(() => {
    const queries = [TABLET_MIN_WIDTH, DESKTOP_MIN_WIDTH].map(w =>
      window.matchMedia(`(min-width: ${w}px)`)
    )
    const onChange = () => setSize(read())
    queries.forEach(q => q.addEventListener('change', onChange))
    onChange()
    return () => queries.forEach(q => q.removeEventListener('change', onChange))
  }, [])

  return size
}
