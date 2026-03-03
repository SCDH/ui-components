import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within, expect, waitFor } from '@storybook/test'
import { FacetSearch, SearchServiceProvider } from '../../../components/ui/scdh/facet-search'
import { searchHandlers } from './handlers'
import { HttpSearchService } from './http-search-service'

// ---------------------------------------------------------------------------
// Shared service instance (injected via decorator)
// ---------------------------------------------------------------------------

const searchService = new HttpSearchService()

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'SCDH-UI/Composites/FacetSearch',
  component: FacetSearch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composite search interface combining SearchBar, Facets, and ListItems.\n\n' +
          '**Architecture:**\n' +
          '- The `FacetSearch` component is decoupled from any search backend via the Strategy pattern.\n' +
          '- A `SearchService` is injected through React Context (`SearchServiceProvider`).\n' +
          '- The `useSearchFacets` hook manages debouncing, caching, and state.\n' +
          '- MSW (Mock Service Worker) intercepts HTTP requests for realistic data flow.\n\n' +
          '**Layout:** Global search bar (top), facet filters (left sidebar), result list (right).'
      }
    },
    // MSW handlers for this story – intercepting /api/search requests
    msw: {
      handlers: searchHandlers
    }
  },
  // Decorator: inject the SearchService via Context (Dependency Injection)
  decorators: [
    Story => (
      <SearchServiceProvider service={searchService}>
        <div className="max-w-[1200px] mx-auto">
          <Story />
        </div>
      </SearchServiceProvider>
    )
  ]
} satisfies Meta<typeof FacetSearch>

export default meta

type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// 1) Default – Full search interface with all facets and results
// ---------------------------------------------------------------------------

/**
 * The default story shows the complete FacetSearch interface.
 *
 * MSW intercepts the `/api/search` endpoint and returns mock data
 * from a simulated scholarly catalogue (German literary works).
 *
 * The SearchService is injected via the `SearchServiceProvider` decorator.
 */
export const Default: Story = {
  args: {
    searchPlaceholder: 'Volltextsuche im Katalog...',
    searchAriaLabel: 'Search the scholarly catalogue'
  }
}

// ---------------------------------------------------------------------------
// 2) Interactive: Search flow with play function
// ---------------------------------------------------------------------------

/**
 * Demonstrates a complete user flow:
 * 1. User types "Kafka" in the search bar
 * 2. Results update to show only Kafka works
 * 3. Result count changes accordingly
 *
 * Uses a Storybook Play Function to automate the interaction.
 */
export const SearchFlow: Story = {
  name: 'Interactive: Search Flow',
  args: {
    searchPlaceholder: 'Volltextsuche im Katalog...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    // Wait for initial results to load
    await step('Wait for initial results', async () => {
      await waitFor(() => expect(canvas.getByText(/\d+ results/)).toBeInTheDocument(), {
        timeout: 5000
      })
    })

    // Verify initial state shows all results
    await step('Verify initial state (10 results)', async () => {
      await waitFor(() => expect(canvas.getByText('10 results')).toBeInTheDocument(), {
        timeout: 3000
      })
    })

    // Type search query
    await step('Type "Kafka" in the search bar', async () => {
      const searchInput = canvas.getByRole('searchbox', { name: /Full-text search/ })
      await userEvent.clear(searchInput)
      await userEvent.type(searchInput, 'Kafka', { delay: 80 })
    })

    // Verify filtered results
    await step('Verify results filtered to Kafka works', async () => {
      await waitFor(() => expect(canvas.getByText('2 results')).toBeInTheDocument(), {
        timeout: 5000
      })
      expect(canvas.getByText('Der Prozess')).toBeInTheDocument()
      expect(canvas.getByText('Die Verwandlung')).toBeInTheDocument()
    })
  }
}

// ---------------------------------------------------------------------------
// 3) Interactive: Facet filter flow with play function
// ---------------------------------------------------------------------------

/**
 * Demonstrates facet filtering:
 * 1. User sees all 10 results
 * 2. User clicks the "Philosophy" checkbox in the Category facet
 * 3. Results filter to philosophical works only
 *
 * This validates the full data flow: UI → Hook → Service → MSW → Response → UI.
 */
export const FacetFilterFlow: Story = {
  name: 'Interactive: Facet Filter Flow',
  args: {
    searchPlaceholder: 'Volltextsuche im Katalog...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    // Wait for initial load
    await step('Wait for initial results', async () => {
      await waitFor(() => expect(canvas.getByText('10 results')).toBeInTheDocument(), {
        timeout: 5000
      })
    })

    // Click on the "Philosophy" checkbox
    await step('Select "Philosophy" in Category facet', async () => {
      const philosophyCheckbox = canvas.getByRole('checkbox', { name: /Philosophy/ })
      await userEvent.click(philosophyCheckbox)
    })

    // Verify results are filtered
    await step('Verify filtered results (4 philosophy items)', async () => {
      await waitFor(() => expect(canvas.getByText('4 results')).toBeInTheDocument(), {
        timeout: 5000
      })
      expect(canvas.getByText('Kritik der reinen Vernunft')).toBeInTheDocument()
      expect(canvas.getByText('Also sprach Zarathustra')).toBeInTheDocument()
    })
  }
}

// ---------------------------------------------------------------------------
// 4) Interactive: Combined search + facet filtering
// ---------------------------------------------------------------------------

/**
 * Full combined flow:
 * 1. User searches for "Goethe"
 * 2. Results narrow to Goethe's works
 * 3. User further filters by "Drama" category
 * 4. Only "Faust" remains
 *
 * This is the most comprehensive demo of the FacetSearch data flow.
 */
export const CombinedFlow: Story = {
  name: 'Interactive: Combined Search + Facet',
  args: {
    searchPlaceholder: 'Volltextsuche im Katalog...'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    // Wait for initial load
    await step('Wait for initial results', async () => {
      await waitFor(() => expect(canvas.getByText('10 results')).toBeInTheDocument(), {
        timeout: 5000
      })
    })

    // Search for "Goethe"
    await step('Search for "Goethe"', async () => {
      const searchInput = canvas.getByRole('searchbox', { name: /Full-text search/ })
      await userEvent.type(searchInput, 'Goethe', { delay: 80 })
    })

    // Wait for filtered results
    await step('Verify Goethe results', async () => {
      await waitFor(() => expect(canvas.getByText('2 results')).toBeInTheDocument(), {
        timeout: 5000
      })
    })

    // Further filter by "Drama"
    await step('Select "Drama" in Category facet', async () => {
      const dramaCheckbox = canvas.getByRole('checkbox', { name: /Drama/ })
      await userEvent.click(dramaCheckbox)
    })

    // Verify only Faust remains
    await step('Verify only Faust remains', async () => {
      await waitFor(() => expect(canvas.getByText('1 results')).toBeInTheDocument(), {
        timeout: 5000
      })
      expect(canvas.getByText('Faust: Eine Tragödie')).toBeInTheDocument()
    })
  }
}
