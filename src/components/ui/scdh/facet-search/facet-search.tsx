import * as React from 'react'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/ui/scdh/search-bar'
import { Facet } from '@/components/ui/scdh/facet'
import { ListItem } from '@/components/ui/scdh/list-item'
import { useSearchFacets } from './use-search-facets'
import type { FacetDefinition } from './types'
import type { ListItemProps } from '@/components/ui/scdh/list-item'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FacetSearchProps {
  /** Additional CSS class for the outer wrapper */
  readonly className?: string
  /** Placeholder text for the global search bar */
  readonly searchPlaceholder?: string
  /** Accessible label for the search bar */
  readonly searchAriaLabel?: string
}

// ---------------------------------------------------------------------------
// Sub-components (internal)
// ---------------------------------------------------------------------------

/** Sidebar containing all facets */
interface FacetSidebarProps {
  readonly facets: readonly FacetDefinition[]
  readonly onToggle: (facetKey: string, value: string) => void
  readonly onRadioChange: (facetKey: string, value: string) => void
}

function FacetSidebar({ facets, onToggle, onRadioChange }: FacetSidebarProps) {
  return (
    <aside
      className="flex flex-col gap-4 w-[280px] flex-shrink-0"
      role="complementary"
      aria-label="Search filters"
    >
      {facets.map(facet => (
        <Facet
          key={facet.key}
          title={facet.title}
          items={[...facet.items]}
          selectionMode={facet.selectionMode}
          searchable={facet.searchable}
          collapsible
          defaultExpanded
          onToggle={
            facet.selectionMode === 'checkbox' ? value => onToggle(facet.key, value) : undefined
          }
          onSelectionChange={
            facet.selectionMode === 'radio'
              ? values => {
                  if (values[0]) onRadioChange(facet.key, values[0])
                }
              : undefined
          }
        />
      ))}
    </aside>
  )
}

/** Result list showing ListItem cards */
interface ResultListProps {
  readonly items: readonly ListItemProps[]
  readonly totalCount: number
  readonly isLoading: boolean
}

function ResultList({ items, totalCount, isLoading }: ResultListProps) {
  return (
    <section className="flex flex-col gap-4 flex-1 min-w-0" aria-label="Search results">
      {/* Result count header */}
      <div className="flex items-center justify-between">
        <p className="text-md text-ulb-grey-800">
          {isLoading ? 'Searching...' : `${totalCount} results`}
        </p>
      </div>

      {/* Result items */}
      {items.length > 0 ? (
        <div className="flex flex-col gap-3" role="list">
          {items.map((item, index) => (
            <div key={item.title + index} role="listitem">
              <ListItem {...item} />
            </div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="flex items-center justify-center py-16 text-ulb-grey-600">
            <p className="text-lg">No results found.</p>
          </div>
        )
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * SCDH FacetSearch – Composite search interface
 *
 * Combines SearchBar, Facet, and ListItem into a complete search UI.
 * Layout: global search bar (top), facets (left sidebar), results (right).
 *
 * The component is decoupled from any search engine. All data flows through
 * an injected `SearchService` (via `SearchServiceProvider` context).
 * The `useSearchFacets` hook handles debouncing, caching, and state management.
 *
 * @example
 * ```tsx
 * <SearchServiceProvider service={mySearchService}>
 *   <FacetSearch />
 * </SearchServiceProvider>
 * ```
 */
export const FacetSearch = React.forwardRef<HTMLDivElement, FacetSearchProps>(
  (
    { className, searchPlaceholder = 'Volltextsuche...', searchAriaLabel = 'Full-text search' },
    ref
  ) => {
    const {
      query,
      setQuery,
      submitQuery,
      toggleFacetValue,
      setRadioFacetValue,
      isLoading,
      response,
      facetsWithSelection,
      error,
      totalCount
    } = useSearchFacets()

    return (
      <div ref={ref} className={cn('flex flex-col gap-6 w-full', className)}>
        {/* Global search bar – top center */}
        <header className="flex justify-center w-full">
          <div className="w-full max-w-[640px]">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={submitQuery}
              placeholder={searchPlaceholder}
              aria-label={searchAriaLabel}
            />
          </div>
        </header>

        {/* Error display */}
        {error && (
          <div
            className="rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-md"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Main content area: facets left, results right */}
        <div className="flex gap-6 w-full">
          {/* Left: Facet sidebar */}
          {facetsWithSelection.length > 0 && (
            <FacetSidebar
              facets={facetsWithSelection}
              onToggle={toggleFacetValue}
              onRadioChange={setRadioFacetValue}
            />
          )}

          {/* Right: Result list */}
          <ResultList items={response?.items ?? []} totalCount={totalCount} isLoading={isLoading} />
        </div>
      </div>
    )
  }
)

FacetSearch.displayName = 'FacetSearch'
