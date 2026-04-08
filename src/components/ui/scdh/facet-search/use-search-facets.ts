import * as React from 'react'
import { useSearchService } from './search-service-context'
import type { FacetInteractionMode, SearchRequest, SearchResponse, FacetDefinition } from './types'

// ---------------------------------------------------------------------------
// Hook configuration
// ---------------------------------------------------------------------------

/** Default debounce delay for search queries (ms) */
const SEARCH_DEBOUNCE_MS = 300

// ---------------------------------------------------------------------------
// State types
// ---------------------------------------------------------------------------

interface SearchState {
  /** The current full-text query */
  readonly query: string
  /** Applied facet filters (trigger searches in instant/explore mode) */
  readonly filters: Record<string, string[]>
  /**
   * Pending facet filters (deferred mode only).
   * Collected without triggering a search; applied via applyPendingFilters().
   */
  readonly pendingFilters: Record<string, string[]>
  /**
   * Explore mode: frozen snapshot of facet definitions from before the current
   * filter was applied. null means "use live response facets".
   */
  readonly frozenFacets: readonly FacetDefinition[] | null
  /** Whether a search request is currently in-flight */
  readonly isLoading: boolean
  /** The latest search response (null before first search) */
  readonly response: SearchResponse | null
  /** Error from the last search request, if any */
  readonly error: string | null
}

/** Public API returned by the useSearchFacets hook */
export interface UseSearchFacetsReturn {
  /** Current search query */
  readonly query: string
  /** Update the search query (debounced search will follow) */
  readonly setQuery: (query: string) => void
  /** Submit the search immediately (e.g. on Enter) */
  readonly submitQuery: (query: string) => void
  /** Applied filters map */
  readonly filters: Readonly<Record<string, readonly string[]>>
  /** Toggle a single facet value (instant / explore mode) */
  readonly toggleFacetValue: (facetKey: string, value: string) => void
  /** Set the selected value for a radio facet (instant / explore mode) */
  readonly setRadioFacetValue: (facetKey: string, value: string) => void
  // --- Deferred mode ---
  /** Pending (not yet applied) filters – deferred mode only */
  readonly pendingFilters: Readonly<Record<string, readonly string[]>>
  /** Update pending selections for a facet without triggering a search */
  readonly setPendingFacetValues: (facetKey: string, values: string[]) => void
  /** Apply all pending filters and execute the search */
  readonly applyPendingFilters: () => void
  /** True when pendingFilters differs from the currently applied filters */
  readonly hasPendingChanges: boolean
  // --- Common ---
  /** Whether a request is in progress */
  readonly isLoading: boolean
  /** The search response */
  readonly response: SearchResponse | null
  /** Facets with isSelected state merged in (respects mode) */
  readonly facetsWithSelection: readonly FacetDefinition[]
  /** Error message, if any */
  readonly error: string | null
  /** Total result count */
  readonly totalCount: number
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

/**
 * Custom hook that encapsulates the complete search + facet business logic.
 *
 * Responsibilities:
 * - Manages search query state with debouncing
 * - Manages facet filter state (toggle, radio selection)
 * - Calls the injected SearchService on query/filter changes
 * - Provides a simple cache (deduplicates identical requests)
 * - Merges selection state back into facet definitions for the UI
 *
 * @param mode - Interaction mode (default: 'instant')
 * @returns The complete search state and control functions
 */
export function useSearchFacets(mode: FacetInteractionMode = 'instant'): UseSearchFacetsReturn {
  const service = useSearchService()

  const [state, setState] = React.useState<SearchState>({
    query: '',
    filters: {},
    pendingFilters: {},
    frozenFacets: null,
    isLoading: false,
    response: null,
    error: null,
  })

  // Simple request cache to avoid duplicate fetches
  const cacheRef = React.useRef<Map<string, SearchResponse>>(new Map())
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // -----------------------------------------------------------------------
  // Core search execution
  // -----------------------------------------------------------------------

  /** Build a cache key from the request parameters */
  const buildCacheKey = React.useCallback((request: SearchRequest): string => {
    return JSON.stringify({ q: request.query, f: request.filters })
  }, [])

  /** Execute a search request against the service */
  const executeSearch = React.useCallback(
    async (query: string, filters: Record<string, string[]>) => {
      const request: SearchRequest = { query, filters }
      const cacheKey = buildCacheKey(request)

      // Return cached response if available
      const cached = cacheRef.current.get(cacheKey)
      if (cached) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          response: cached,
          error: null,
        }))
        return
      }

      // Cancel any in-flight request
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await service.search(request)

        // Store in cache (limit cache size to prevent memory leaks)
        if (cacheRef.current.size > 50) {
          const firstKey = cacheRef.current.keys().next().value
          if (firstKey !== undefined) {
            cacheRef.current.delete(firstKey)
          }
        }
        cacheRef.current.set(cacheKey, response)

        setState(prev => ({
          ...prev,
          isLoading: false,
          response,
          error: null,
        }))
      } catch (err) {
        // Ignore aborted requests
        if (err instanceof DOMException && err.name === 'AbortError') return

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Search failed',
        }))
      }
    },
    [service, buildCacheKey]
  )

  // -----------------------------------------------------------------------
  // Debounced search trigger
  // -----------------------------------------------------------------------

  /** Schedule a debounced search (called on query/filter changes) */
  const debouncedSearch = React.useCallback(
    (query: string, filters: Record<string, string[]>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        void executeSearch(query, filters)
      }, SEARCH_DEBOUNCE_MS)
    },
    [executeSearch]
  )

  // Cleanup timers and abort controllers on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      abortControllerRef.current?.abort()
    }
  }, [])

  // Trigger initial search on mount
  React.useEffect(() => {
    void executeSearch('', {})
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -----------------------------------------------------------------------
  // Public API: query management
  // -----------------------------------------------------------------------

  /** Update the query with debounced search */
  const setQuery = React.useCallback(
    (query: string) => {
      setState(prev => {
        debouncedSearch(query, prev.filters)
        return { ...prev, query }
      })
    },
    [debouncedSearch]
  )

  /** Submit the query immediately (bypass debounce) */
  const submitQuery = React.useCallback(
    (query: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      setState(prev => {
        void executeSearch(query, prev.filters)
        return { ...prev, query }
      })
    },
    [executeSearch]
  )

  // -----------------------------------------------------------------------
  // Public API: facet filter management (instant + explore mode)
  // -----------------------------------------------------------------------

  /**
   * Returns the number of facet dimensions (keys) that have at least one
   * active filter value in a given filter map.
   */
  const countActiveDimensions = (filters: Record<string, string[]>): number =>
    Object.values(filters).filter(v => v.length > 0).length

  /** Toggle a checkbox facet value and trigger an immediate search. */
  const toggleFacetValue = React.useCallback(
    (facetKey: string, value: string) => {
      setState(prev => {
        const current = prev.filters[facetKey] ?? []
        const next = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]

        const newFilters = { ...prev.filters, [facetKey]: next }

        // --- Explore mode: decide whether to freeze / unfreeze facets ---
        let frozenFacets = prev.frozenFacets

        if (mode === 'explore') {
          const prevActiveDims = countActiveDimensions(prev.filters)
          const newActiveDims = countActiveDimensions(newFilters)

          if (newActiveDims === 0) {
            // All filters removed → unfreeze: show live facets again
            frozenFacets = null
          } else if (prevActiveDims === 0) {
            // Very first filter applied → freeze the current live facets so
            // the sidebar doesn't change on the user's first click
            frozenFacets = prev.response?.facets ?? null
          } else {
            const prevActiveFacetKeys = new Set(
              Object.entries(prev.filters)
                .filter(([, v]) => v.length > 0)
                .map(([k]) => k)
            )
            if (!prevActiveFacetKeys.has(facetKey)) {
              // User clicked in a NEW dimension → unfreeze so other facets
              // update to reflect the combined filter state
              frozenFacets = null
            }
            // Same dimension toggled → keep facets frozen (the clicked facet
            // must not update its own counts based on its own selection)
          }
        }

        // Clear cache when filters change so counts are always fresh
        cacheRef.current.clear()
        void executeSearch(prev.query, newFilters)

        return { ...prev, filters: newFilters, frozenFacets }
      })
    },
    [mode, executeSearch]
  )

  /** Set the selected value for a radio facet and trigger an immediate search. */
  const setRadioFacetValue = React.useCallback(
    (facetKey: string, value: string) => {
      setState(prev => {
        const newFilters = { ...prev.filters, [facetKey]: [value] }

        // Apply the same explore-mode freeze logic as toggleFacetValue
        let frozenFacets = prev.frozenFacets

        if (mode === 'explore') {
          const prevActiveDims = countActiveDimensions(prev.filters)
          const prevActiveFacetKeys = new Set(
            Object.entries(prev.filters)
              .filter(([, v]) => v.length > 0)
              .map(([k]) => k)
          )

          if (prevActiveDims === 0) {
            frozenFacets = prev.response?.facets ?? null
          } else if (!prevActiveFacetKeys.has(facetKey)) {
            frozenFacets = null
          }
        }

        cacheRef.current.clear()
        void executeSearch(prev.query, newFilters)

        return { ...prev, filters: newFilters, frozenFacets }
      })
    },
    [mode, executeSearch]
  )

  // -----------------------------------------------------------------------
  // Public API: deferred mode
  // -----------------------------------------------------------------------

  /**
   * Replace the pending selections for a facet key without triggering a search.
   * Used by the FacetSearch UI in deferred mode to collect selections before
   * the user explicitly submits them.
   */
  const setPendingFacetValues = React.useCallback(
    (facetKey: string, values: string[]) => {
      setState(prev => ({
        ...prev,
        pendingFilters: { ...prev.pendingFilters, [facetKey]: values },
      }))
    },
    []
  )

  /**
   * Copy pending filters to applied filters and execute the search.
   * This is the "submit" action in deferred mode.
   */
  const applyPendingFilters = React.useCallback(() => {
    setState(prev => {
      cacheRef.current.clear()
      void executeSearch(prev.query, prev.pendingFilters)
      return { ...prev, filters: prev.pendingFilters }
    })
  }, [executeSearch])

  // -----------------------------------------------------------------------
  // Derived state: facets with selection merged in
  // -----------------------------------------------------------------------

  /**
   * Merge isSelected flags into facet items based on current mode:
   *
   * - instant:  live response facets  +  applied filters for isSelected
   * - explore:  frozen facets (if set) +  applied filters for isSelected
   * - deferred: live response facets  +  pending filters for isSelected
   */
  const facetsWithSelection: FacetDefinition[] = React.useMemo(() => {
    // In explore mode prefer the frozen snapshot over the live response facets
    const facetDefs =
      mode === 'explore' && state.frozenFacets !== null
        ? state.frozenFacets
        : state.response?.facets

    if (!facetDefs) return []

    // In deferred mode the checkboxes reflect pending selections, not applied ones
    const selectionSource = mode === 'deferred' ? state.pendingFilters : state.filters

    return facetDefs.map(facet => ({
      ...facet,
      items: facet.items.map(item => ({
        ...item,
        isSelected: selectionSource[facet.key]?.includes(item.value) ?? false,
      })),
    }))
  }, [mode, state.frozenFacets, state.response?.facets, state.filters, state.pendingFilters])

  // True when the pending selections differ from the currently applied filters
  const hasPendingChanges = React.useMemo(
    () => JSON.stringify(state.pendingFilters) !== JSON.stringify(state.filters),
    [state.pendingFilters, state.filters]
  )

  return {
    query: state.query,
    setQuery,
    submitQuery,
    filters: state.filters,
    toggleFacetValue,
    setRadioFacetValue,
    pendingFilters: state.pendingFilters,
    setPendingFacetValues,
    applyPendingFilters,
    hasPendingChanges,
    isLoading: state.isLoading,
    response: state.response,
    facetsWithSelection,
    error: state.error,
    totalCount: state.response?.totalCount ?? 0,
  }
}
