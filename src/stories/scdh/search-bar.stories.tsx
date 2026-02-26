import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchBar } from '../../components/ui/scdh/search-bar'
import { useState } from 'react'
import { userEvent, within, expect } from '@storybook/test'

const meta = {
  title: 'SCDH-UI/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A search input with leading icon and clear button. Built on top of the SCDH Input component. ' +
          'Designed for two contexts: standalone (default size) or compact (e.g. inside a Facet). ' +
          'Fully controlled – the consumer manages state, debouncing, and filtering.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Size variant – default for standalone, compact for inline usage (e.g. inside Facet)'
    },
    value: {
      control: 'text',
      description: 'Current search value (controlled)'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    }
  }
} satisfies Meta<typeof SearchBar>

export default meta

type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Basic variants
// ---------------------------------------------------------------------------

/** Default size – for standalone search bars (e.g. main search) */
export const Default: Story = {
  render: () => {
    const [query, setQuery] = useState('')

    return (
      <div className="w-full max-w-[400px]">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search the catalogue..."
          aria-label="Search the catalogue"
        />
      </div>
    )
  }
}

/** Compact size – for inline usage inside Facets or sidebars */
export const Compact: Story = {
  render: () => {
    const [query, setQuery] = useState('')

    return (
      <div className="w-full max-w-[280px]">
        <SearchBar
          size="compact"
          value={query}
          onChange={setQuery}
          placeholder="Filter..."
          aria-label="Filter items"
        />
      </div>
    )
  }
}

/** Shows the clear button when there is text in the input */
export const WithValue: Story = {
  name: 'With Value (Clear Button Visible)',
  render: () => {
    const [query, setQuery] = useState('Goethe')

    return (
      <div className="w-full max-w-[400px]">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search..."
          aria-label="Search"
        />
      </div>
    )
  }
}

// ---------------------------------------------------------------------------
// Interactive stories
// ---------------------------------------------------------------------------

/**
 * Demonstrates the SearchBar as a controlled component with live state.
 * Type to see the value update, press Escape or click X to clear.
 */
export const Interactive: Story = {
  name: 'Interactive (Controlled State)',
  render: () => {
    const [query, setQuery] = useState('')
    const [submitted, setSubmitted] = useState<string | null>(null)

    return (
      <div className="flex flex-col gap-4 w-full max-w-[400px]">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={(q) => setSubmitted(q)}
          placeholder="Type and press Enter to submit..."
          aria-label="Interactive search"
        />

        {/* Live display of current query state */}
        <div className="text-sm text-ulb-grey-600 space-y-1">
          <div>
            <span className="font-medium">Current value:</span>{' '}
            {query ? <code className="text-scdh-blue-700">{query}</code> : <em>empty</em>}
          </div>
          {submitted !== null && (
            <div>
              <span className="font-medium">Last submitted:</span>{' '}
              <code className="text-scdh-blue-700">{submitted}</code>
            </div>
          )}
        </div>
      </div>
    )
  }
}

/** Side-by-side comparison of default and compact size variants */
export const SizeComparison: Story = {
  name: 'Size Comparison',
  render: () => {
    const [defaultQuery, setDefaultQuery] = useState('')
    const [compactQuery, setCompactQuery] = useState('')

    return (
      <div className="flex flex-col gap-6 w-full max-w-[400px]">
        {/* Default size */}
        <div>
          <p className="text-sm font-medium text-ulb-grey-600 mb-2">Default (standalone)</p>
          <SearchBar
            value={defaultQuery}
            onChange={setDefaultQuery}
            placeholder="Full-size search..."
            aria-label="Default size search"
          />
        </div>

        {/* Compact size */}
        <div>
          <p className="text-sm font-medium text-ulb-grey-600 mb-2">Compact (for inline use)</p>
          <SearchBar
            size="compact"
            value={compactQuery}
            onChange={setCompactQuery}
            placeholder="Compact filter..."
            aria-label="Compact size search"
          />
        </div>
      </div>
    )
  }
}

// ---------------------------------------------------------------------------
// Play function: automated interaction test
// ---------------------------------------------------------------------------

/**
 * Automated test: types text, verifies clear button appears,
 * clicks clear, and verifies the input is empty again.
 */
export const AutomatedInteraction: Story = {
  name: 'Automated: Type and Clear',
  render: () => {
    const [query, setQuery] = useState('')

    return (
      <div className="w-full max-w-[400px]">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Watch the automated test..."
          aria-label="Automated test search"
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Step 1: Find the search input
    const searchInput = canvas.getByRole('searchbox')
    expect(searchInput).toBeInTheDocument()

    // Step 2: Type a query
    await userEvent.type(searchInput, 'Goethe')
    expect(searchInput).toHaveValue('Goethe')

    // Step 3: Verify clear button appears
    const clearButton = canvas.getByLabelText('Clear search')
    expect(clearButton).toBeInTheDocument()

    // Step 4: Click clear
    await userEvent.click(clearButton)
    expect(searchInput).toHaveValue('')
  }
}
