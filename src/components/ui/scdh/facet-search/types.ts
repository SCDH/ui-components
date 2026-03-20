import type { FacetItem } from '../facet'
import type { ListItemProps } from '../list-item'

// ---------------------------------------------------------------------------
// Interaction mode
// ---------------------------------------------------------------------------

/**
 * Controls how facet filter selections trigger search updates.
 *
 * - **instant**: Every click immediately triggers a new search (default).
 * - **deferred**: Selections are collected; search fires only on explicit submit.
 * - **explore**: Item list updates on every click; facets stay frozen until
 *   a selection is made in a different facet dimension (disjunctive UX).
 */
export type FacetInteractionMode = 'instant' | 'deferred' | 'explore'

// ---------------------------------------------------------------------------
// Search Request / Response types
// ---------------------------------------------------------------------------

/**
 * Describes a single facet definition returned by the search service.
 * Each facet has a key (e.g. "language"), a label, and a list of items.
 */
export interface FacetDefinition {
  /** Unique key identifying this facet (e.g. "language", "category") */
  readonly key: string
  /** Human-readable title displayed in the UI */
  readonly title: string
  /** Whether the facet supports multiple selection or single selection */
  readonly selectionMode: 'checkbox' | 'radio'
  /** Whether the facet items are searchable via a filter input */
  readonly searchable?: boolean
  /** The individual facet items with counts */
  readonly items: readonly FacetItem[]
}

/**
 * A search request sent to the search service.
 * Describes the current query, active facet filters, and pagination state.
 */
export interface SearchRequest {
  /** The full-text search query */
  readonly query: string
  /** Currently active facet filters: key → selected values */
  readonly filters: Readonly<Record<string, readonly string[]>>
}

/**
 * The response returned by the search service.
 * Contains result items, updated facet definitions, and total count.
 */
export interface SearchResponse {
  /** Total number of results matching the query + filters */
  readonly totalCount: number
  /** The result items for the current page */
  readonly items: readonly ListItemProps[]
  /** Updated facet definitions (counts reflect current query/filters) */
  readonly facets: readonly FacetDefinition[]
}

// ---------------------------------------------------------------------------
// Search Service Interface (Strategy Pattern)
// ---------------------------------------------------------------------------

/**
 * Abstract search service interface.
 *
 * The FacetSearch component is decoupled from any concrete search backend.
 * Consumers provide a service implementation via React Context, enabling
 * easy swapping between real APIs, mock services, or Solr/Elasticsearch.
 */
export interface SearchService {
  /**
   * Execute a search request and return the response.
   * The implementation handles the actual data fetching (REST, GraphQL, etc.).
   *
   * @param request - The search parameters (query, filters)
   * @returns A promise resolving to the search response
   */
  search(request: SearchRequest): Promise<SearchResponse>
}
