import * as React from 'react'
import { useSearchService } from './search-service-context'
import type { SearchRequest, SearchResponse, FacetDefinition } from './types'

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
  /** Active facet filters: facet key → selected values */
  readonly filters: Record<string, string[]>
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
  /** Active filters map */
  readonly filters: Readonly<Record<string, readonly string[]>>
  /** Toggle a single facet value (instant mode) */
  readonly toggleFacetValue: (facetKey: string, value: string) => void
  /** Set the selected values for a radio facet */
  readonly setRadioFacetValue: (facetKey: string, value: string) => void
  /** Whether a request is in progress */
  readonly isLoading: boolean
  /** The search response */
  readonly response: SearchResponse | null
  /** Facets with isSelected state merged in */
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
 * @returns The complete search state and control functions
 */
export function useSearchFacets(): UseSearchFacetsReturn {
  const service = useSearchService()

  const [state, setState] = React.useState<SearchState>({
    query: '',
    filters: {},
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
  // Public API: facet filter management
  // -----------------------------------------------------------------------

  /** Toggle a checkbox facet value */
  const toggleFacetValue = React.useCallback(
    (facetKey: string, value: string) => {
      setState(prev => {
        const current = prev.filters[facetKey] ?? []
        const next = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]

        const newFilters = { ...prev.filters, [facetKey]: next }

        // Clear cache when filters change for fresh counts
        cacheRef.current.clear()
        void executeSearch(prev.query, newFilters)

        return { ...prev, filters: newFilters }
      })
    },
    [executeSearch]
  )

  /** Set a single value for a radio facet */
  const setRadioFacetValue = React.useCallback(
    (facetKey: string, value: string) => {
      setState(prev => {
        const newFilters = { ...prev.filters, [facetKey]: [value] }

        cacheRef.current.clear()
        void executeSearch(prev.query, newFilters)

        return { ...prev, filters: newFilters }
      })
    },
    [executeSearch]
  )

  // -----------------------------------------------------------------------
  // Derived state: facets with selection merged in
  // -----------------------------------------------------------------------

  /** Merge isSelected flags into facet items based on current filters */
  const facetsWithSelection: FacetDefinition[] = React.useMemo(() => {
    if (!state.response?.facets) return []

    return state.response.facets.map(facet => ({
      ...facet,
      items: facet.items.map(item => ({
        ...item,
        isSelected: state.filters[facet.key]?.includes(item.value) ?? false,
      })),
    }))
  }, [state.response?.facets, state.filters])

  return {
    query: state.query,
    setQuery,
    submitQuery,
    filters: state.filters,
    toggleFacetValue,
    setRadioFacetValue,
    isLoading: state.isLoading,
    response: state.response,
    facetsWithSelection,
    error: state.error,
    totalCount: state.response?.totalCount ?? 0,
  }
}
