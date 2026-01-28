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
          'A facet component for displaying filterable categories with counts. Compatible with InstantSearch.js RefinementList. Supports multiple selection modes (checkbox/radio) and can be collapsible.'
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
  { id: 'goethe', value: 'goethe', label: 'Johann Wolfgang von Goethe', count: 45, isRefined: true },
  { id: 'schiller', value: 'schiller', label: 'Friedrich Schiller', count: 32 },
  { id: 'kafka', value: 'kafka', label: 'Franz Kafka', count: 28, isRefined: true },
  { id: 'mann', value: 'mann', label: 'Thomas Mann', count: 23 },
  { id: 'hesse', value: 'hesse', label: 'Hermann Hesse', count: 19 }
]

// Basic Examples
export const Default: Story = {
  args: {
    title: 'Categories',
    items: bookCategories
  }
}

export const WithCheckboxes: Story = {
  name: 'Multiple Selection (Checkboxes)',
  args: {
    title: 'Languages',
    items: bookLanguages,
    selectionMode: 'checkbox'
  }
}

export const WithRadioButtons: Story = {
  name: 'Single Selection (Radio)',
  args: {
    title: 'Publication Period',
    items: publicationYears,
    selectionMode: 'radio'
  }
}

export const Collapsible: Story = {
  args: {
    title: 'Categories',
    items: bookCategories,
    selectionMode: 'checkbox',
    collapsible: true,
    defaultExpanded: true
  }
}

export const CollapsedByDefault: Story = {
  name: 'Collapsed by Default',
  args: {
    title: 'Languages',
    items: bookLanguages,
    selectionMode: 'checkbox',
    collapsible: true,
    defaultExpanded: false
  }
}

export const WithSelectedItems: Story = {
  name: 'With Pre-selected Items',
  args: {
    title: 'Authors',
    items: authors,
    selectionMode: 'checkbox'
  }
}

export const NoSelection: Story = {
  name: 'Read-Only (No Selection)',
  args: {
    title: 'Most Popular Categories',
    items: bookCategories.slice(0, 4)
  }
}

// Interactive example with state management
export const InteractiveMultipleFilters: Story = {
  name: 'Interactive: Deferred Filtering',
  render: () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
    const [appliedFilters, setAppliedFilters] = useState<{ categories: string[]; languages: string[] }>({
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
      <div className="flex flex-col gap-6 max-w-sm">
        <div className="flex flex-col gap-6">
          <Facet
            title="Categories"
            items={bookCategories.map((item) => ({
              ...item,
              isRefined: selectedCategories.includes(item.value)
            }))}
            selectionMode="checkbox"
            collapsible
            defaultExpanded
            onSelectionChange={setSelectedCategories}
          />

          <Facet
            title="Languages"
            items={bookLanguages.map((item) => ({
              ...item,
              isRefined: selectedLanguages.includes(item.value)
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

// InstantSearch compatible example (simulated)
export const InstantSearchPattern: Story = {
  name: 'InstantSearch.js Pattern (Instant Filtering)',
  render: () => {
    const [refinedItems, setRefinedItems] = useState<Set<string>>(new Set())

    const handleRefine = (value: string) => {
      setRefinedItems((prev) => {
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
      <div className="flex flex-col gap-6 max-w-sm">
        <Facet
          title="Categories"
          items={bookCategories.map((item) => ({
            ...item,
            isRefined: refinedItems.has(item.value)
          }))}
          selectionMode="checkbox"
          collapsible
          onRefine={handleRefine}
        />

        {refinedItems.size > 0 && (
          <div className="text-sm p-4 bg-scdh-blue-50 border border-scdh-blue-200 rounded-lg">
            <div className="font-semibold text-scdh-blue-700 mb-2">
              Active Filters (instant applied):
            </div>
            <div className="text-scdh-blue-600">{Array.from(refinedItems).join(', ')}</div>
          </div>
        )}
      </div>
    )
  }
}
