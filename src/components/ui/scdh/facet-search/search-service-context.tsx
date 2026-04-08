import * as React from 'react'
import type { SearchService } from './types'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/**
 * React Context for the SearchService.
 *
 * The FacetSearch component and its hook consume this context to access
 * the injected search service implementation. This enables the
 * Dependency Injection / Strategy pattern – the concrete backend
 * (REST API, mock, Solr, etc.) is provided by the consumer.
 *
 * @see SearchServiceProvider
 * @see useSearchService
 */
const SearchServiceContext = React.createContext<SearchService | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface SearchServiceProviderProps {
  /** The search service implementation to inject */
  readonly service: SearchService
  readonly children: React.ReactNode
}

/**
 * Provider component that injects a SearchService into the React tree.
 *
 * Wrap the FacetSearch (or any consuming component) with this provider
 * and pass your service implementation. This is ideal for use as a
 * Storybook decorator or in application layouts.
 *
 * @example
 * ```tsx
 * <SearchServiceProvider service={myApiService}>
 *   <FacetSearch />
 * </SearchServiceProvider>
 * ```
 */
export function SearchServiceProvider({ service, children }: SearchServiceProviderProps) {
  return <SearchServiceContext.Provider value={service}>{children}</SearchServiceContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Retrieves the injected SearchService from context.
 *
 * @throws Error if used outside a SearchServiceProvider
 * @returns The search service instance
 */
export function useSearchService(): SearchService {
  const service = React.useContext(SearchServiceContext)

  if (!service) {
    throw new Error(
      'useSearchService must be used within a <SearchServiceProvider>. ' +
        'Wrap your component tree with <SearchServiceProvider service={...}>.'
    )
  }

  return service
}
