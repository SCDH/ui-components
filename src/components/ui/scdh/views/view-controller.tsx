import * as React from 'react'

import { cn } from '@/lib/utils'
import { useScreenSize } from '@/hooks/use-screen-size'
import { Pager } from '@/components/ui/scdh/pager'
import { View, type ViewMode } from './view'
import {
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
  /**
   * How many views are visible at once, pinned views included. Default: 2 on tablet, 3 on desktop.
   * On small screens it is always 1. With more views a `Pager` appears.
   */
  visibleViews?: { tablet?: number; desktop?: number }
  /** Header label of views that offer a mode selection. Default "Ansicht". */
  title?: React.ReactNode
  /** Shows a close button on the views that can be closed. */
  closable?: boolean
  /** Ref to the scrolling content of a view, e.g. for synchronised scrolling. */
  getContentRef?: (viewId: string) => React.Ref<HTMLDivElement> | undefined
}

// ---------------------------------------------------------------------------
// ViewController
// ---------------------------------------------------------------------------

/**
 * Arranges views and holds their state: which views are open, which one is active and how each is
 * set. It does not know what a view shows, that is up to the view's mode.
 *
 * - **Desktop** shows up to 3 views at once (e.g. the pinned "Metadaten" and 2 others), **tablet**
 *   up to 2. Pinned views stay in place; with more views the others are paged through and a
 *   `Pager` appears below them.
 * - **Small screens** show 1 view at once. All views, pinned ones first, sit next to each other
 *   and are swiped; the `Pager` below follows and also switches views.
 *
 * Swiping happens in the content of a view (CSS scroll-snap); the `Pager` reacts to it and can
 * also move the views itself.
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
      visibleViews,
      title = 'Ansicht',
      closable = false,
      getContentRef,
      className,
      ...props
    },
    ref
  ) => {
    const screen = useScreenSize()
    const isMobile = screen === 'mobile'
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
    const maxVisible = isMobile
      ? 1
      : screen === 'tablet'
        ? (visibleViews?.tablet ?? 2)
        : (visibleViews?.desktop ?? 3)
    const pinned = isMobile ? [] : controller.views.filter(v => v.pinned)
    const scrolling = controller.views.filter(v => isMobile || !v.pinned)
    // Views per track page. Fewer views than slots fill the available width.
    const slots = Math.max(1, Math.min(maxVisible - pinned.length, scrolling.length))
    const positions = Math.max(1, scrolling.length - slots + 1)
    const activeIndex = Math.min(
      Math.max(
        scrolling.findIndex(v => v.id === controller.activeId),
        0
      ),
      positions - 1
    )

    // ---- Track <-> active view ----
    const trackRef = React.useRef<HTMLDivElement>(null)
    const scrollingIds = scrolling.map(v => v.id)
    const setActiveRef = React.useRef(controller.setActive)
    React.useEffect(() => {
      setActiveRef.current = controller.setActive
    })

    // Swipe: read the position the track settled on and make that view the active one
    React.useEffect(() => {
      const track = trackRef.current
      if (!track) return
      let timer: ReturnType<typeof setTimeout> | undefined
      const sync = () => {
        if (track.clientWidth === 0) return
        const id = scrollingIds[Math.round(track.scrollLeft / (track.clientWidth / slots))]
        if (id !== undefined) setActiveRef.current(id)
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
      // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollingIds compared by content
    }, [slots, scrollingIds.join('\u0000')])

    // Pager / controlled change: scroll the track to the active view
    const lastTrack = React.useRef<HTMLDivElement | null>(null)
    React.useEffect(() => {
      const track = trackRef.current
      if (!track) return
      const left = Math.min(
        activeIndex * (track.clientWidth / slots),
        track.scrollWidth - track.clientWidth
      )
      if (Math.abs(track.scrollLeft - left) > 1) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        // A freshly mounted track jumps to its position, later changes animate
        const jump = lastTrack.current !== track || reduceMotion
        track.scrollTo({ left, behavior: jump ? 'auto' : 'smooth' })
      }
      lastTrack.current = track
    }, [slots, activeIndex, scrolling.length])

    const renderView = (view: ViewState, trackView = false) => {
      const viewModes = view.modes ?? controller.modes
      return (
        <View
          key={view.id}
          id={view.id}
          title={viewModes.length > 1 ? title : undefined}
          modes={viewModes}
          mode={view.mode}
          onModeChange={modeId => controller.setMode(view.id, modeId)}
          defaultSize={view.size}
          onClose={
            closable && controller.canClose(view.id)
              ? () => controller.closeView(view.id)
              : undefined
          }
          contentRef={getContentRef?.(view.id)}
          className={
            trackView
              ? cn(
                  'snap-start snap-always',
                  // No divider between mobile pages; next to pinned views the track starts with one
                  isMobile ? 'not-first:border-l-0' : pinned.length > 0 && 'first:border-l'
                )
              : undefined
          }
          style={trackView ? { flex: `0 0 ${100 / slots}%` } : undefined}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn('flex h-full min-h-0 min-w-0 flex-row bg-background', className)}
        {...props}
      >
        {pinned.map(v => renderView(v))}
        {/* Paged views: `slots` of them are visible at once */}
        <div className="flex min-h-0 min-w-0 flex-col" style={{ flex: `${slots} 1 0%` }}>
          <div
            ref={trackRef}
            className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-none"
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
              className="shrink-0 border-t border-ulb-grey-300 dark:border-border"
            />
          )}
        </div>
      </div>
    )
  }
)
ViewController.displayName = 'ViewController'

export { ViewController }
