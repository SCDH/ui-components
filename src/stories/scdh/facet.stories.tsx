import type { Meta, StoryObj } from '@storybook/react-vite'
import { Facet, type FacetItem } from '../../components/ui/scdh/facet'
import { useState } from 'react'

const meta = {
  title: 'SCDH-UI/Facet',
  component: Facet,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A facet component for displaying filterable categories with counts. Supports instant mode (onToggle) and deferred mode (onSelectionChange), multiple selection modes (checkbox/radio) and can be collapsible.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: [undefined, 'checkbox', 'radio'],
      description: 'Selection mode for facet items'
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the facet can be collapsed'
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether the facet is expanded by default (when collapsible)'
    }
  },
  args: {
    items: [],
    title: 'Facet'
  }
} satisfies Meta<typeof Facet>

export default meta

type Story = StoryObj<typeof meta>

// Sample library data - Book categories
const bookCategories: FacetItem[] = [
  { id: 'fiction', value: 'fiction', label: 'Fiction', count: 1243 },
  { id: 'non-fiction', value: 'non-fiction', label: 'Non-Fiction', count: 892 },
  { id: 'science', value: 'science', label: 'Science', count: 567 },
  { id: 'history', value: 'history', label: 'History', count: 432 },
  { id: 'biography', value: 'biography', label: 'Biography', count: 234 },
  { id: 'poetry', value: 'poetry', label: 'Poetry', count: 156 }
]

// Book languages
const bookLanguages: FacetItem[] = [
  { id: 'de', value: 'de', label: 'German', count: 3421 },
  { id: 'en', value: 'en', label: 'English', count: 2876 },
  { id: 'fr', value: 'fr', label: 'French', count: 543 },
  { id: 'it', value: 'it', label: 'Italian', count: 234 },
  { id: 'es', value: 'es', label: 'Spanish', count: 187 },
  { id: 'la', value: 'la', label: 'Latin', count: 98 }
]

// Publication years
const publicationYears: FacetItem[] = [
  { id: '2020s', value: '2020-2029', label: '2020-2029', count: 234 },
  { id: '2010s', value: '2010-2019', label: '2010-2019', count: 567 },
  { id: '2000s', value: '2000-2009', label: '2000-2009', count: 432 },
  { id: '1990s', value: '1990-1999', label: '1990-1999', count: 321 },
  { id: '1980s', value: '1980-1989', label: '1980-1989', count: 198 },
  { id: 'older', value: 'before-1980', label: 'Before 1980', count: 876 }
]

// Authors (with some selected)
const authors: FacetItem[] = [
  {
    id: 'goethe',
    value: 'goethe',
    label: 'Johann Wolfgang von Goethe',
    count: 45,
    isSelected: true
  },
  { id: 'schiller', value: 'schiller', label: 'Friedrich Schiller', count: 32 },
  { id: 'kafka', value: 'kafka', label: 'Franz Kafka', count: 28, isSelected: true },
  { id: 'mann', value: 'mann', label: 'Thomas Mann', count: 23 },
  { id: 'hesse', value: 'hesse', label: 'Hermann Hesse', count: 19 }
]

// Basic Examples
export const Default: Story = {
  args: {
    title: 'Categories',
    items: bookCategories
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

export const WithCheckboxes: Story = {
  name: 'Multiple Selection (Checkboxes)',
  args: {
    title: 'Languages',
    items: bookLanguages,
    selectionMode: 'checkbox'
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

export const WithRadioButtons: Story = {
  name: 'Single Selection (Radio)',
  args: {
    title: 'Publication Period',
    items: publicationYears,
    selectionMode: 'radio'
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

export const Collapsible: Story = {
  args: {
    title: 'Categories',
    items: bookCategories,
    selectionMode: 'checkbox',
    collapsible: true,
    defaultExpanded: true
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

export const CollapsedByDefault: Story = {
  name: 'Collapsed by Default',
  args: {
    title: 'Languages',
    items: bookLanguages,
    selectionMode: 'checkbox',
    collapsible: true,
    defaultExpanded: false
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

export const WithSelectedItems: Story = {
  name: 'With Pre-selected Items',
  args: {
    title: 'Authors',
    items: authors,
    selectionMode: 'checkbox'
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

export const NoSelection: Story = {
  name: 'Read-Only (No Selection)',
  args: {
    title: 'Most Popular Categories',
    items: bookCategories.slice(0, 4)
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

// ---------------------------------------------------------------------------
// Searchable facet examples
// ---------------------------------------------------------------------------

// Extended author list for searchable demos – long enough to justify a filter input
const manyAuthors: FacetItem[] = [
  { id: 'goethe', value: 'goethe', label: 'Johann Wolfgang von Goethe', count: 45 },
  { id: 'schiller', value: 'schiller', label: 'Friedrich Schiller', count: 32 },
  { id: 'kafka', value: 'kafka', label: 'Franz Kafka', count: 28 },
  { id: 'mann', value: 'mann', label: 'Thomas Mann', count: 23 },
  { id: 'hesse', value: 'hesse', label: 'Hermann Hesse', count: 19 },
  { id: 'lessing', value: 'lessing', label: 'Gotthold Ephraim Lessing', count: 17 },
  { id: 'heine', value: 'heine', label: 'Heinrich Heine', count: 15 },
  { id: 'rilke', value: 'rilke', label: 'Rainer Maria Rilke', count: 14 },
  { id: 'brecht', value: 'brecht', label: 'Bertolt Brecht', count: 12 },
  { id: 'buechner', value: 'buechner', label: 'Georg Büchner', count: 11 },
  { id: 'fontane', value: 'fontane', label: 'Theodor Fontane', count: 9 },
  { id: 'kleist', value: 'kleist', label: 'Heinrich von Kleist', count: 8 },
  { id: 'droste', value: 'droste', label: 'Annette von Droste-Hülshoff', count: 7 },
  { id: 'storm', value: 'storm', label: 'Theodor Storm', count: 6 },
  { id: 'hoffmann', value: 'hoffmann', label: 'E.T.A. Hoffmann', count: 5 }
]

/** Searchable facet with local filtering – type to filter the list client-side */
export const SearchableCheckbox: Story = {
  name: 'Searchable (Checkboxes)',
  args: {
    title: 'Authors',
    items: manyAuthors,
    selectionMode: 'checkbox',
    searchable: true,
    searchPlaceholder: 'Filter authors...',
    collapsible: true,
    defaultExpanded: true
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

/** Searchable facet with radio selection */
export const SearchableRadio: Story = {
  name: 'Searchable (Radio)',
  args: {
    title: 'Authors',
    items: manyAuthors,
    selectionMode: 'radio',
    searchable: true,
    searchPlaceholder: 'Filter authors...'
  },
  decorators: [
    Story => (
      <div className="w-full max-w-[300px]">
        <Story />
      </div>
    )
  ]
}

/**
 * Interactive searchable facet showing the interplay between filtering
 * and selection – selected items remain selected even when filtered out of view.
 */
export const SearchableInteractive: Story = {
  name: 'Searchable: Interactive with Selection',
  render: function SearchableInteractiveRender() {
    const [selected, setSelected] = useState<string[]>([])

    return (
      <div className="flex flex-col gap-4 w-full max-w-[300px]">
        <Facet
          title="Authors"
          items={manyAuthors.map(item => ({
            ...item,
            isSelected: selected.includes(item.value)
          }))}
          selectionMode="checkbox"
          searchable
          searchPlaceholder="Filter authors..."
          collapsible
          defaultExpanded
          onSelectionChange={setSelected}
        />

        {selected.length > 0 && (
          <div className="text-sm p-4 bg-scdh-blue-50 border border-scdh-blue-200 rounded-lg">
            <div className="font-semibold text-scdh-blue-700 mb-1">
              Selected ({selected.length}):
            </div>
            <div className="text-scdh-blue-600">
              {selected.map(v => manyAuthors.find(a => a.value === v)?.label ?? v).join(', ')}
            </div>
          </div>
        )}
      </div>
    )
  }
}

/**
 * Demonstrates server-side filtering via onSearchChange.
 * The Facet does NOT filter locally – instead the consumer provides
 * already-filtered items (simulating a backend facet search).
 */
export const SearchableServerSide: Story = {
  name: 'Searchable: Server-Side Filtering (Simulated)',
  render: function SearchableServerSideRender() {
    const [items, setItems] = useState<FacetItem[]>(manyAuthors)
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

    // Simulates server-side facet search
    const handleSearchChange = (query: string) => {
      if (!query.trim()) {
        setItems(manyAuthors)
        return
      }

      // Simulate server response with a slight transformation
      const normalizedQuery = query.toLowerCase().trim()
      const filtered = manyAuthors.filter(item =>
        item.label.toLowerCase().includes(normalizedQuery)
      )
      setItems(filtered)
    }

    const handleToggle = (value: string) => {
      setSelectedItems(prev => {
        const next = new Set(prev)
        if (next.has(value)) {
          next.delete(value)
        } else {
          next.add(value)
        }
        return next
      })
    }

    return (
      <div className="flex flex-col gap-4 w-full max-w-[300px]">
        <Facet
          title="Authors"
          items={items.map(item => ({
            ...item,
            isSelected: selectedItems.has(item.value)
          }))}
          selectionMode="checkbox"
          searchable
          searchPlaceholder="Search authors (server)..."
          collapsible
          defaultExpanded
          onSearchChange={handleSearchChange}
          onToggle={handleToggle}
        />

        <div className="text-xs text-ulb-grey-800 p-3 bg-ulb-grey-50 rounded-lg">
          <p className="font-semibold mb-1">ℹ Server-side mode</p>
          <p>
            The Facet delegates filtering to the consumer via <code>onSearchChange</code>. It does
            not know which backend or search engine is used.
          </p>
        </div>

        {selectedItems.size > 0 && (
          <div className="text-sm p-4 bg-scdh-blue-50 border border-scdh-blue-200 rounded-lg">
            <div className="font-semibold text-scdh-blue-700 mb-1">Active filters (instant):</div>
            <div className="text-scdh-blue-600">{Array.from(selectedItems).join(', ')}</div>
          </div>
        )}
      </div>
    )
  }
}

// Interactive example with state management
export const InteractiveMultipleFilters: Story = {
  name: 'Interactive: Deferred Filtering',
  render: function InteractiveMultipleFiltersRender() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
    const [appliedFilters, setAppliedFilters] = useState<{
      categories: string[]
      languages: string[]
    }>({
      categories: [],
      languages: []
    })

    const handleApplyFilters = () => {
      setAppliedFilters({
        categories: selectedCategories,
        languages: selectedLanguages
      })
    }

    const handleResetFilters = () => {
      setSelectedCategories([])
      setSelectedLanguages([])
      setAppliedFilters({ categories: [], languages: [] })
    }

    const totalSelected = selectedCategories.length + selectedLanguages.length
    const hasChanges =
      JSON.stringify(selectedCategories) !== JSON.stringify(appliedFilters.categories) ||
      JSON.stringify(selectedLanguages) !== JSON.stringify(appliedFilters.languages)

    return (
      <div className="flex flex-col gap-6 w-full max-w-[400px]">
        <div className="flex flex-col gap-6">
          <Facet
            title="Categories"
            items={bookCategories.map(item => ({
              ...item,
              isSelected: selectedCategories.includes(item.value)
            }))}
            selectionMode="checkbox"
            collapsible
            defaultExpanded
            onSelectionChange={setSelectedCategories}
          />

          <Facet
            title="Languages"
            items={bookLanguages.map(item => ({
              ...item,
              isSelected: selectedLanguages.includes(item.value)
            }))}
            selectionMode="checkbox"
            collapsible
            defaultExpanded
            onSelectionChange={setSelectedLanguages}
          />
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={handleApplyFilters}
            disabled={!hasChanges}
            className="flex-1 px-4 py-2 bg-scdh-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-scdh-blue-600 transition-colors"
          >
            Apply Filters {totalSelected > 0 && `(${totalSelected})`}
          </button>
          <button
            onClick={handleResetFilters}
            disabled={totalSelected === 0}
            className="px-4 py-2 border border-ulb-grey-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ulb-grey-100 transition-colors"
          >
            Reset
          </button>
        </div>

        {appliedFilters.categories.length > 0 || appliedFilters.languages.length > 0 ? (
          <div className="text-sm text-muted-foreground p-4 bg-ulb-grey-50 rounded-lg">
            <div className="font-semibold mb-2">Applied Filters:</div>
            {appliedFilters.categories.length > 0 && (
              <div>Categories: {appliedFilters.categories.join(', ')}</div>
            )}
            {appliedFilters.languages.length > 0 && (
              <div>Languages: {appliedFilters.languages.join(', ')}</div>
            )}
          </div>
        ) : null}
      </div>
    )
  }
}

// Instant toggle example
export const InstantTogglePattern: Story = {
  name: 'Instant Toggle Pattern',
  render: function InstantTogglePatternRender() {
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

    const handleToggle = (value: string) => {
      setSelectedItems(prev => {
        const newSet = new Set(prev)
        if (newSet.has(value)) {
          newSet.delete(value)
        } else {
          newSet.add(value)
        }
        return newSet
      })
    }

    return (
      <div className="flex flex-col gap-6 w-full max-w-[300px]">
        <Facet
          title="Categories"
          items={bookCategories.map(item => ({
            ...item,
            isSelected: selectedItems.has(item.value)
          }))}
          selectionMode="checkbox"
          collapsible
          onToggle={handleToggle}
        />

        {selectedItems.size > 0 && (
          <div className="text-sm p-4 bg-scdh-blue-50 border border-scdh-blue-200 rounded-lg">
            <div className="font-semibold text-scdh-blue-700 mb-2">
              Active Filters (instant applied):
            </div>
            <div className="text-scdh-blue-600">{Array.from(selectedItems).join(', ')}</div>
          </div>
        )}
      </div>
    )
  }
}
