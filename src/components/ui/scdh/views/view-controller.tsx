import * as React from 'react'

import { cn } from '@/lib/utils'
import { Pager } from '@/components/ui/scdh/pager'
import { View, type ViewMode } from './view'
import {
  MAX_VIEWS,
  useViewController,
  type UseViewControllerOptions,
  type ViewControllerApi,
  type ViewState
} from './use-view-controller'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ViewControllerProps
  extends
    Omit<UseViewControllerOptions, 'modes'>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'title'> {
  /** Default modes for all views. Not needed when a `controller` is passed. */
  modes?: ViewMode[]
  /** State created with `useViewController`, for operating on the views from outside. */
  controller?: ViewControllerApi
  /** Header label of views that offer a mode selection. Default "Ansicht". */
  title?: React.ReactNode
  /** Shows a close button on the views that can be closed. */
  closable?: boolean
  /** Ref to the scrolling content of a view, e.g. for synchronised scrolling. */
  getContentRef?: (viewId: string) => React.Ref<HTMLDivElement> | undefined
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

/** Width of a pinned column (px), without its separator. */
const PINNED_MIN = 200
const PINNED_MAX = 300
/** Width of a pinned column relative to a view. */
const PINNED_RATIO = 0.5
/** Width of a view (px): keeps lines readable. */
const VIEW_MIN = 320
const VIEW_MAX = 600
const GAP = 32
const SEPARATOR = 1

interface Layout {
  /**
   * Too narrow for a pinned column next to a view: one view at a time, all of them swiped, the
   * pinned ones first.
   */
  allSwiped: boolean
  /** Number of views visible next to each other in the track. */
  slots: number
  pinnedWidth: number
  viewWidth: number
  /** Width of the visible part of the track: `slots` views and the gaps between them. */
  trackWidth: number
}

/** Width of `count` views next to each other. */
const span = (count: number, viewWidth: number) => count * viewWidth + (count - 1) * GAP

/**
 * Works out the columns for the width the controller has. As many views as fit at their minimum
 * width are shown (at most `MAX_VIEWS`). A pinned column is half as wide as a view, within its own
 * limits. Once the views reach their maximum, the rest of the width stays free.
 */
function computeLayout(width: number, hasPinned: boolean, viewCount: number): Layout {
  const pinnedSpace = hasPinned ? PINNED_MIN + SEPARATOR + GAP : 0
  const fits = (count: number) => pinnedSpace + span(count, VIEW_MIN) <= width
  if (!fits(1)) {
    return { allSwiped: true, slots: 1, pinnedWidth: 0, viewWidth: width, trackWidth: width }
  }

  let slots = Math.max(1, Math.min(viewCount, MAX_VIEWS))
  while (slots > 1 && !fits(slots)) slots--

  let viewWidth: number
  let pinnedWidth = 0
  if (!hasPinned) {
    viewWidth = Math.min(VIEW_MAX, (width - (slots - 1) * GAP) / slots)
  } else {
    const clampPinned = (w: number) => Math.min(Math.max(w, PINNED_MIN), PINNED_MAX)
    // Space for the pinned column and the views, without separator and gaps
    const available = width - SEPARATOR - slots * GAP
    viewWidth = available / (slots + PINNED_RATIO)
    pinnedWidth = PINNED_RATIO * viewWidth
    if (pinnedWidth !== clampPinned(pinnedWidth)) {
      pinnedWidth = clampPinned(pinnedWidth)
      viewWidth = (available - pinnedWidth) / slots
    }
    if (viewWidth > VIEW_MAX) {
      viewWidth = VIEW_MAX
      pinnedWidth = clampPinned(PINNED_RATIO * viewWidth)
    }
  }
  viewWidth = Math.floor(viewWidth)
  return {
    allSwiped: false,
    slots,
    pinnedWidth: Math.floor(pinnedWidth),
    viewWidth,
    trackWidth: span(slots, viewWidth)
  }
}

/** Distance between two positions of a track of views, as it is laid out right now. */
function trackStep(track: HTMLElement) {
  const [first, second] = Array.from(track.children) as HTMLElement[]
  return second ? second.offsetLeft - first.offsetLeft : track.clientWidth
}

/** Width of an element's content box (without its padding), kept up to date. */
function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const style = getComputedStyle(el)
      setWidth(el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight))
    }
    const observer = new ResizeObserver(update)
    observer.observe(el)
    update()
    return () => observer.disconnect()
  }, [ref])
  return width
}

// ---------------------------------------------------------------------------
// ViewController
// ---------------------------------------------------------------------------

/**
 * Arranges views and holds their state: which views are open, which one is active and how each is
 * set. It does not know what a view shows, that is up to the view's mode.
 *
 * - Up to 3 views can be open next to the pinned "Metadaten" (see `canAdd`). The width the
 *   controller has decides how many of them fit next to each other: views are 320-600px wide,
 *   "Metadaten" half as wide as a view (200-300px). Views that do not fit are paged through with a
 *   `Pager` below them. Once all columns are at their maximum, the controller is centred.
 * - Too narrow for "Metadaten" next to a view (below 553px plus its padding of 24px on either
 *   side), it shows 1 view at once. All views, "Metadaten" first, sit next to each other and are
 *   swiped; the `Pager` below follows and also switches views. Crossing this width sets up
 *   "Metadaten" anew, its content starts at the top again.
 *
 * Swiping happens in the content of a view (CSS scroll-snap); the `Pager` reacts to it and can
 * also move the views itself. Resizing keeps the active view in sight.
 *
 * The controller takes the width of its container and does not stretch it: place it where the
 * width is set from outside (a block, a `flex-1` or `1fr` area), not in one that shrinks to fit
 * its content. It shows nothing until it knows that width.
 */
const ViewController = React.forwardRef<HTMLDivElement, ViewControllerProps>(
  (
    {
      modes,
      views,
      defaultViews,
      onViewsChange,
      activeViewId,
      defaultActiveViewId,
      onActiveViewChange,
      minViews,
      controller: externalController,
      title = 'Ansicht',
      closable = false,
      getContentRef,
      className,
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => rootRef.current!)
    const width = useWidth(rootRef)
    const ownController = useViewController({
      modes: modes ?? [],
      views,
      defaultViews,
      onViewsChange,
      activeViewId,
      defaultActiveViewId,
      onActiveViewChange,
      minViews
    })
    const controller = externalController ?? ownController

    // ---- What is visible, what is paged ----
    const pinnedViews = controller.views.filter(v => v.pinned)
    const otherViews = controller.views.filter(v => !v.pinned)
    const layout = computeLayout(width, pinnedViews.length > 0, otherViews.length)
    const { allSwiped, slots } = layout
    // Next to the track, and in it
    const pinned = allSwiped ? [] : pinnedViews
    const scrolling = allSwiped ? [...pinnedViews, ...otherViews] : otherViews
    // Nothing is shown before the width is known, so no view is set up in the wrong place
    const measured = width > 0
    const hasTrack = measured && scrolling.length > 0
    const positions = Math.max(1, scrolling.length - slots + 1)
    const activeIndex = Math.min(
      Math.max(
        scrolling.findIndex(v => v.id === controller.activeId),
        0
      ),
      positions - 1
    )
    // The view in front of the track: the active one, or the last one that can be in front
    const frontId = scrolling[activeIndex]?.id

    // ---- Track <-> active view ----
    // Both directions measure the track as it is laid out right now: while the width changes, the
    // browser moves the track before the layout above is worked out again.
    const trackRef = React.useRef<HTMLDivElement>(null)
    const frontIdRef = React.useRef(frontId)
    const setActiveRef = React.useRef(controller.setActive)
    React.useLayoutEffect(() => {
      frontIdRef.current = frontId
      setActiveRef.current = controller.setActive
    })

    // Swipe: read the view the track settled on and make it the active one. Settling on the view
    // already in front (e.g. after a resize) keeps the active view, even one further along that
    // is only in sight because several views fit.
    React.useEffect(() => {
      const track = trackRef.current
      if (!track) return
      let timer: ReturnType<typeof setTimeout> | undefined
      const sync = () => {
        const step = trackStep(track)
        if (step === 0) return
        const view = track.children[Math.round(track.scrollLeft / step)]
        if (view && view.id !== frontIdRef.current) setActiveRef.current(view.id)
      }
      // `scrollend` where available, otherwise wait for the scrolling to pause
      const onScroll = () => {
        clearTimeout(timer)
        timer = setTimeout(sync, 120)
      }
      track.addEventListener('scrollend', sync)
      track.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        clearTimeout(timer)
        track.removeEventListener('scrollend', sync)
        track.removeEventListener('scroll', onScroll)
      }
    }, [hasTrack])

    // Pager / controlled change / resize: bring the view in front into place
    const scrolledAtWidth = React.useRef<number | null>(null)
    React.useEffect(() => {
      const track = trackRef.current
      const front = track?.children[activeIndex] as HTMLElement | undefined
      if (!track || !front) return
      const first = track.children[0] as HTMLElement
      const left = Math.min(
        front.offsetLeft - first.offsetLeft,
        track.scrollWidth - track.clientWidth
      )
      if (Math.abs(track.scrollLeft - left) > 1) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        // On the first render and after a resize the track jumps, a new active view animates
        const animate = scrolledAtWidth.current === width && !reduceMotion
        track.scrollTo({ left, behavior: animate ? 'smooth' : 'auto' })
      }
      scrolledAtWidth.current = width
    }, [width, activeIndex, scrolling.length])

    const pinnedFlex = `0 0 ${layout.pinnedWidth + SEPARATOR}px`
    const trackViewFlex = allSwiped ? '0 0 100%' : `0 0 ${layout.viewWidth}px`

    const renderView = (view: ViewState, inTrack: boolean) => {
      const viewModes = view.modes ?? controller.modes
      return (
        <View
          key={view.id}
          id={view.id}
          title={viewModes.length > 1 ? title : undefined}
          modes={viewModes}
          mode={view.mode}
          onModeChange={modeId => controller.setMode(view.id, modeId)}
          pinned={view.pinned}
          onClose={
            closable && controller.canClose(view.id)
              ? () => controller.closeView(view.id)
              : undefined
          }
          contentRef={getContentRef?.(view.id)}
          className={cn(
            inTrack && 'snap-start snap-always',
            // The only separator: right of a pinned column
            !inTrack && 'border-r border-ulb-grey-300 dark:border-border'
          )}
          style={{ flex: inTrack ? trackViewFlex : pinnedFlex }}
        />
      )
    }

    return (
      <div
        ref={rootRef}
        className={cn(
          // Its width follows the surroundings only, never the columns inside (they follow it)
          'flex h-full min-h-0 min-w-0 flex-row justify-center bg-background px-6 [contain:inline-size]',
          className
        )}
        {...props}
      >
        {measured && pinned.map(v => renderView(v, false))}
        {/* Paged views: `slots` of them are visible at once */}
        {hasTrack && (
          <div
            className="flex min-h-0 min-w-0 flex-col"
            style={{
              flex: allSwiped ? '1 1 0%' : `0 0 ${layout.trackWidth}px`,
              marginLeft: pinned.length > 0 ? GAP : undefined
            }}
          >
            <div
              ref={trackRef}
              className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-none"
              style={{ columnGap: allSwiped ? undefined : GAP }}
            >
              {scrolling.map(v => renderView(v, true))}
            </div>
            {positions > 1 && (
              <Pager
                count={positions}
                index={activeIndex}
                onIndexChange={i => {
                  const id = scrolling[i]?.id
                  if (id !== undefined) controller.setActive(id)
                }}
                aria-label="Ansicht wechseln"
                className="shrink-0 border-t border-ulb-grey-200 dark:border-border"
              />
            )}
          </div>
        )}
      </div>
    )
  }
)
ViewController.displayName = 'ViewController'

export { ViewController }
