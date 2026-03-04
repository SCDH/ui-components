import type { SearchService, SearchRequest, SearchResponse } from '@/components/ui/scdh/facet-search/types.ts'
import { SEARCH_API_URL } from './handlers'

// ---------------------------------------------------------------------------
// HTTP-based SearchService implementation
// ---------------------------------------------------------------------------

/**
 * A SearchService implementation that makes HTTP GET requests.
 *
 * In Storybook, these requests are intercepted by MSW handlers.
 * In production, this could target a real Solr/Elasticsearch endpoint.
 *
 * Follows the Strategy pattern – the FacetSearch component doesn't
 * know or care whether the data comes from MSW, a REST API, or GraphQL.
 */
export class HttpSearchService implements SearchService {
  private readonly baseUrl: string

  constructor(baseUrl: string = SEARCH_API_URL) {
    this.baseUrl = baseUrl
  }

  async search(request: SearchRequest): Promise<SearchResponse> {
    const url = new URL(this.baseUrl, window.location.origin)

    // Add query parameter
    if (request.query) {
      url.searchParams.set('q', request.query)
    }

    // Add filter parameters: filters[key]=value (repeated for multi-select)
    for (const [key, values] of Object.entries(request.filters)) {
      for (const value of values) {
        url.searchParams.append(`filters[${key}]`, value)
      }
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<SearchResponse>
  }
}
