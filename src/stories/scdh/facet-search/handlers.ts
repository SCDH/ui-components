import { http, HttpResponse, delay } from 'msw'
import { performMockSearch } from './mock-data'

// ---------------------------------------------------------------------------
// API endpoint URL
// ---------------------------------------------------------------------------

/** The mock API endpoint used by the MSW handler */
export const SEARCH_API_URL = '/api/search'

// ---------------------------------------------------------------------------
// MSW Request Handlers
// ---------------------------------------------------------------------------

/**
 * MSW handlers that intercept HTTP requests to the search API.
 *
 * These handlers simulate a real backend:
 * - Parse query parameters from the request
 * - Apply filtering logic via `performMockSearch`
 * - Return a JSON response with artificial latency
 *
 * Used in Storybook via msw-storybook-addon to demonstrate
 * realistic data fetching without a real server.
 */
export const searchHandlers = [
  http.get(SEARCH_API_URL, async ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') ?? ''

    // Parse filters from query params: filters[category]=literature&filters[category]=drama
    const filters: Record<string, string[]> = {}
    url.searchParams.forEach((value, key) => {
      const match = key.match(/^filters\[(.+)]$/)
      if (match?.[1]) {
        const facetKey = match[1]
        if (!filters[facetKey]) {
          filters[facetKey] = []
        }
        filters[facetKey].push(value)
      }
    })

    // Simulate network latency (150-400ms)
    await delay(150 + Math.random() * 250)

    const result = performMockSearch(query, filters)

    return HttpResponse.json(result)
  }),
]
