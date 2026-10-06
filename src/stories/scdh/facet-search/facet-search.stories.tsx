import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within, expect, waitFor } from 'storybook/test'
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
// 1) Modes – Different interaction behaviours
// ---------------------------------------------------------------------------

/**
 * **Instant Mode (Default)**
 * Every facet click immediately triggers a new search.
 * Facet counts reflect the current filter state after each interaction.
 */
export const InstantMode: Story = {
  args: {
    mode: 'instant',
    searchPlaceholder: 'Volltextsuche im Katalog (Instant)...',
    searchAriaLabel: 'Search the scholarly catalogue'
  }
}

/**
 * **Explore Mode**
 * Selecting a facet updates only the result list; the facet sidebar freezes
 * so users can orient themselves. Facets refresh only when the user
 * introduces a second filter dimension.
 */
export const ExploreMode: Story = {
  args: {
    mode: 'explore',
    searchPlaceholder: 'Volltextsuche im Katalog (Explore)...'
  }
}

/**
 * **Deferred Mode**
 * Checkboxes give instant visual feedback but no search is triggered.
 * An "Apply Filters" button appears once selections diverge from the last applied state.
 */
export const DeferredMode: Story = {
  args: {
    mode: 'deferred',
    searchPlaceholder: 'Volltextsuche im Katalog (Deferred)...'
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
    await step('Verify initial state (12 results)', async () => {
      await waitFor(() => expect(canvas.getByText('12 results')).toBeInTheDocument(), {
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
      await waitFor(() => expect(canvas.getByText('12 results')).toBeInTheDocument(), {
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
      await waitFor(() => expect(canvas.getByText('12 results')).toBeInTheDocument(), {
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

// ---------------------------------------------------------------------------
// 5) Explore mode – Facets stay frozen until a second dimension is selected
// ---------------------------------------------------------------------------

/**
 * Demonstrates the **explore** interaction mode.
 *
 * In explore mode a facet's own counts never change based on its own selection.
 * Selecting within a single dimension only updates the result list; the facet
 * sidebar stays frozen. Only when the user picks a value from a *different*
 * facet dimension do the facets refresh.
 *
 * Flow demonstrated:
 * 1. Load – 10 results, all facet counts visible
 * 2. Click "Philosophy" (Category facet) – 4 results, facets UNCHANGED
 * 3. Click "19th century" (Century facet) – 3 results, facets UPDATE
 */
export const ExploreModeFlow: Story = {
  name: 'Interactive: Explore Mode',
  args: {
    searchPlaceholder: 'Volltextsuche im Katalog...',
    mode: 'explore'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    // Wait for initial load
    await step('Wait for initial results (12)', async () => {
      await waitFor(() => expect(canvas.getByText('12 results')).toBeInTheDocument(), {
        timeout: 5000
      })
    })

    // Click "Philosophy" – only item list should change, facets stay frozen
    await step('Select "Philosophy" in Category facet', async () => {
      const philosophyCheckbox = canvas.getByRole('checkbox', { name: /Philosophy/ })
      await userEvent.click(philosophyCheckbox)
    })

    await step(
      'Item list shows 4 results; facet counts still reflect the full unfiltered set',
      async () => {
        await waitFor(() => expect(canvas.getByText('4 results')).toBeInTheDocument(), {
          timeout: 5000
        })
        // Literature count 6 must still be present – it would be 0 in instant mode
        const countElements = canvas.getAllByText('6')
        expect(countElements.length).toBeGreaterThan(0)
      }
    )

    // Click "19th century" – introducing a second dimension unfreezes the facets
    await step('Select "19th century" in Century facet (second dimension)', async () => {
      const centuryCheckbox = canvas.getByRole('checkbox', { name: /19th century/ })
      await userEvent.click(centuryCheckbox)
    })

    await step('Item list narrows; facets now update to the combined filter state', async () => {
      // Philosophy + 19th century: Nietzsche, Hegel, Schopenhauer = 3 items
      await waitFor(() => expect(canvas.getByText('3 results')).toBeInTheDocument(), {
        timeout: 5000
      })
      // Literature count 6 is gone – facets unfroze and now reflect actual counts
      expect(canvas.queryByText('6')).toBeNull()
    })
  }
}

// ---------------------------------------------------------------------------
// 6) Deferred mode – Collect selections, then submit
// ---------------------------------------------------------------------------

/**
 * Demonstrates the **deferred** interaction mode.
 *
 * In deferred mode facet checkboxes are ticked immediately for visual feedback,
 * but no search is triggered. An "Apply Filters" button appears as soon as
 * selections diverge from the last applied state. The search fires only when
 * that button is clicked.
 *
 * Flow demonstrated:
 * 1. Load – 10 results
 * 2. Tick "Philosophy" – results still 10, button appears
 * 3. Click "Apply Filters" – results update to 4
 */
export const DeferredModeFlow: Story = {
  name: 'Interactive: Deferred Mode',
  args: {
    searchPlaceholder: 'Volltextsuche im Katalog...',
    mode: 'deferred'
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    // Wait for initial load
    await step('Wait for initial results (12)', async () => {
      await waitFor(() => expect(canvas.getByText('12 results')).toBeInTheDocument(), {
        timeout: 5000
      })
    })

    // Tick the checkbox – no immediate search
    await step('Tick "Philosophy" checkbox (no search yet)', async () => {
      const philosophyCheckbox = canvas.getByRole('checkbox', { name: /Philosophy/ })
      await userEvent.click(philosophyCheckbox)
    })

    await step('Result count stays at 12; "Apply Filters" button is now enabled', async () => {
      // Results must not change yet
      expect(canvas.getByText('12 results')).toBeInTheDocument()
      // Apply button must have appeared and be enabled
      const applyButton = canvas.getByRole('button', { name: /Apply Filters/ })
      expect(applyButton).not.toBeDisabled()
    })

    // Submit the pending selection
    await step('Click "Apply Filters"', async () => {
      const applyButton = canvas.getByRole('button', { name: /Apply Filters/ })
      await userEvent.click(applyButton)
    })

    // Now the search fires
    await step('Results update to 4 philosophy items', async () => {
      await waitFor(() => expect(canvas.getByText('4 results')).toBeInTheDocument(), {
        timeout: 5000
      })
      expect(canvas.getByText('Kritik der reinen Vernunft')).toBeInTheDocument()
    })
  }
}
