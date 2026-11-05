import * as React from 'react'

import { useControllableState } from '@/hooks/use-controllable-state'
import type { ViewMode } from './view'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ViewState {
  id: string
  /** Id of the current mode. */
  mode: string
  /** Modes of this view; falls back to the controller's `modes`. A single mode shows no selection. */
  modes?: ViewMode[]
  /**
   * Pins the view: it can not be closed and, on tablet and desktop, stays in place while the other
   * views are paged through. On small screens it is the first page of the swipe.
   */
  pinned?: boolean
  /** Relative share of the available space next to other views (flex-grow). Default 1. */
  size?: number
}

export interface UseViewControllerOptions {
  /** Default modes for all views, also used by `addView`. */
  modes: ViewMode[]
  views?: ViewState[]
  defaultViews?: ViewState[]
  onViewsChange?: (views: ViewState[]) => void
  activeViewId?: string
  defaultActiveViewId?: string
  onActiveViewChange?: (id: string) => void
  /** Number of views that always stay open. Default 2. */
  minViews?: number
}

export interface ViewControllerApi {
  modes: ViewMode[]
  views: ViewState[]
  minViews: number
  /**
   * Id of the active view: the visible one on small screens, the first visible one of the paged
   * views on tablet and desktop.
   */
  activeId: string | undefined
  /** `true` if the view may be closed: it is not pinned and more than `minViews` views are open. */
  canClose: (id: string) => boolean
  /** Opens a new view (in the given mode, default: first mode) and makes it active. Returns its id. */
  addView: (modeId?: string) => string
  closeView: (id: string) => void
  setActive: (id: string) => void
  setMode: (id: string, modeId: string) => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * State of a `ViewController`: which views are open, which one is active and how they are set.
 *
 * Use it directly when something outside the controller has to operate on the views, for example
 * an "add view" button above them, and pass the result as `controller` to `ViewController`.
 */
export function useViewController({
  modes,
  views: viewsProp,
  defaultViews = [],
  onViewsChange,
  activeViewId,
  defaultActiveViewId,
  onActiveViewChange,
  minViews = 2
}: UseViewControllerOptions): ViewControllerApi {
  const [views, setViews] = useControllableState<ViewState[]>({
    value: viewsProp,
    defaultValue: defaultViews,
    onChange: onViewsChange
  })
  const [rawActiveId, setActiveId] = useControllableState<string | undefined>({
    value: activeViewId,
    defaultValue: defaultActiveViewId,
    onChange: id => {
      if (id !== undefined) onActiveViewChange?.(id)
    }
  })

  // A removed view can not stay active
  const activeId = views.some(v => v.id === rawActiveId) ? rawActiveId : views[0]?.id

  const counter = React.useRef(0)

  const canClose = (id: string) => views.length > minViews && !views.find(v => v.id === id)?.pinned

  const update = (id: string, patch: Partial<ViewState>) =>
    setViews(views.map(v => (v.id === id ? { ...v, ...patch } : v)))

  return {
    modes,
    views,
    minViews,
    activeId,
    canClose,
    addView: modeId => {
      let id: string
      do {
        counter.current += 1
        id = `view-${counter.current}`
      } while (views.some(v => v.id === id))
      setViews([...views, { id, mode: modeId ?? modes[0]?.id ?? '' }])
      setActiveId(id)
      return id
    },
    closeView: id => {
      if (!canClose(id)) return
      const index = views.findIndex(v => v.id === id)
      const next = views.filter(v => v.id !== id)
      setViews(next)
      if (id === activeId) setActiveId(next[Math.min(index, next.length - 1)]?.id)
    },
    setActive: id => {
      if (id !== activeId) setActiveId(id)
    },
    setMode: (id, modeId) => update(id, { mode: modeId })
  }
}
