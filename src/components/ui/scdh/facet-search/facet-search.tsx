import * as React from 'react'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/ui/scdh/search-bar'
import { Facet } from '@/components/ui/scdh/facet'
import { ListItem } from '@/components/ui/scdh/list-item'
import { useSearchFacets } from './use-search-facets'
import type { FacetDefinition, FacetInteractionMode } from './types'
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
  /**
   * Controls when facet selections trigger a search update.
   * - **instant** (default): every click fires immediately
   * - **deferred**: selections are collected; an "Apply" button submits them
   * - **explore**: item list updates on every click; facets stay frozen until
   *   the user selects from a different facet dimension
   */
  readonly mode?: FacetInteractionMode
}

// ---------------------------------------------------------------------------
// Sub-components (internal)
// ---------------------------------------------------------------------------

/** Sidebar containing all facets */
interface FacetSidebarProps {
  readonly facets: readonly FacetDefinition[]
  readonly mode: FacetInteractionMode
  readonly onToggle: (facetKey: string, value: string) => void
  readonly onRadioChange: (facetKey: string, value: string) => void
  readonly onSelectionChange: (facetKey: string, values: string[]) => void
}

function FacetSidebar({
  facets,
  mode,
  onToggle,
  onRadioChange,
  onSelectionChange
}: FacetSidebarProps) {
  const isDeferred = mode === 'deferred'

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
          // In deferred mode the Facet uses its own internal deferred callback;
          // in instant/explore mode we use the instant onToggle per click.
          onToggle={
            !isDeferred && facet.selectionMode === 'checkbox'
              ? value => onToggle(facet.key, value)
              : undefined
          }
          onSelectionChange={
            isDeferred
              ? // Both checkbox and radio facets emit their full selection array
                values => onSelectionChange(facet.key, values)
              : facet.selectionMode === 'radio'
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
 * Three interaction modes are available via the `mode` prop:
 * - **instant** (default) – every facet click immediately triggers a search
 * - **deferred** – selections are staged and applied via an "Apply" button
 * - **explore** – item list updates instantly; facet counts stay frozen until
 *   the user chooses a value from a second, different facet dimension
 *
 * @example
 * ```tsx
 * <SearchServiceProvider service={mySearchService}>
 *   <FacetSearch mode="explore" />
 * </SearchServiceProvider>
 * ```
 */
export const FacetSearch = React.forwardRef<HTMLDivElement, FacetSearchProps>(
  (
    {
      className,
      searchPlaceholder = 'Volltextsuche...',
      searchAriaLabel = 'Full-text search',
      mode = 'instant'
    },
    ref
  ) => {
    const {
      query,
      setQuery,
      submitQuery,
      toggleFacetValue,
      setRadioFacetValue,
      setPendingFacetValues,
      applyPendingFilters,
      hasPendingChanges,
      isLoading,
      response,
      facetsWithSelection,
      error,
      totalCount
    } = useSearchFacets(mode)

    return (
      <div ref={ref} className={cn('flex flex-col gap-6 w-full', className)}>
        <div className="flex gap-6 w-full">
          {/* Side: Facet sidebar */}
          {facetsWithSelection.length > 0 && (
            <div className="flex flex-col gap-3 min-w-[280px]">
              {/* Spacer for alignment with the items list (SearchBar + gap-6 + CountHeader + gap-4) */}
              <div className="h-[89px]" aria-hidden="true" />

              <FacetSidebar
                facets={facetsWithSelection}
                mode={mode}
                onToggle={toggleFacetValue}
                onRadioChange={setRadioFacetValue}
                onSelectionChange={setPendingFacetValues}
              />

              {/* Deferred mode: "Apply Filters" button */}
              {mode === 'deferred' && (
                <button
                  onClick={applyPendingFilters}
                  disabled={!hasPendingChanges}
                  className={cn(
                    'w-full rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    'bg-ulb-primary text-white',
                    'disabled:opacity-40 disabled:cursor-not-allowed',
                    'hover:enabled:bg-ulb-primary/90'
                  )}
                >
                  Apply Filters
                </button>
              )}
            </div>
          )}

          {/* Main content area: SearchBar top, results below */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            {/* Global search bar – top center */}
            <header className="flex w-full">
              <div className="w-full">
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

            {/* Right: Result list */}
            <ResultList
              items={response?.items ?? []}
              totalCount={totalCount}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    )
  }
)

FacetSearch.displayName = 'FacetSearch'
