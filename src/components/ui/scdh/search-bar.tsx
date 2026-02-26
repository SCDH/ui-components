import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

/**
 * Size variants for the SearchBar wrapper.
 *
 * - `default`  – Full-size search bar for standalone usage (e.g. main search)
 * - `compact`  – Smaller variant for use inside facets or sidebars
 *
 * The variants control icon sizing and input padding so that the
 * search icon and clear button align correctly with the input field.
 */
const searchBarVariants = cva('group/search-bar relative flex w-full items-center', {
  variants: {
    size: {
      default: '',
      compact: ''
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchBarProps
  extends VariantProps<typeof searchBarVariants>,
    Omit<React.ComponentProps<'input'>, 'size' | 'onChange' | 'onSubmit' | 'type'> {
  /**
   * Current search/filter value (controlled component).
   * The SearchBar does NOT manage its own state –
   * the consumer is responsible for state management, debouncing, and filtering.
   */
  value?: string

  /**
   * Called on every input change.
   * The consumer decides whether to debounce or filter immediately.
   */
  onChange?: (value: string) => void

  /**
   * Called when the user explicitly submits the search (Enter key).
   * Only relevant for standalone usage – the compact facet variant
   * typically does not need this.
   */
  onSubmit?: (value: string) => void

  /** Placeholder text shown when the input is empty */
  placeholder?: string

  /**
   * Accessible label for the search input.
   * Required when no visible label exists (which is the common case).
   */
  'aria-label'?: string

  /** Additional CSS classes applied to the outer wrapper */
  className?: string
}

// ---------------------------------------------------------------------------
// Icon size mapping
// ---------------------------------------------------------------------------

/** Returns icon dimensions based on the current size variant */
const iconSizeClasses = {
  default: 'h-4 w-4',
  compact: 'h-3.5 w-3.5'
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SCDH SearchBar Component
 *
 * A search input field with a leading search icon and an optional clear button.
 * Built on top of the SCDH `Input` component for consistent styling.
 *
 * Designed for two contexts:
 * - **Standalone**: Prominent search bar (default size) with submit on Enter
 * - **Compact**: Inline filter within Facet components (compact size)
 *
 * The component is **fully controlled** – it does not manage its own search state.
 * The consumer is responsible for state management, debouncing, and filtering.
 *
 * @example
 * ```tsx
 * // Standalone usage
 * <SearchBar
 *   value={query}
 *   onChange={setQuery}
 *   onSubmit={(q) => executeSearch(q)}
 *   placeholder="Volltextsuche..."
 *   aria-label="Search the catalogue"
 * />
 *
 * // Compact usage inside a Facet
 * <SearchBar
 *   size="compact"
 *   value={filterQuery}
 *   onChange={setFilterQuery}
 *   placeholder="Filter..."
 *   aria-label="Filter facet items"
 * />
 * ```
 */
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value = '',
      onChange,
      onSubmit,
      placeholder = 'Search...',
      size = 'default',
      className,
      'aria-label': ariaLabel = 'Search',
      ...passthroughProps
    },
    ref
  ) => {
    const isCompact = size === 'compact'
    const iconSize = iconSizeClasses[size ?? 'default']

    // -----------------------------------------------------------------------
    // Event handlers
    // -----------------------------------------------------------------------

    /** Handle keyboard shortcuts: Enter to submit, Escape to clear */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSubmit) {
        e.preventDefault()
        onSubmit(value)
      }

      if (e.key === 'Escape') {
        onChange?.('')
      }
    }

    /** Clear the input field */
    const handleClear = () => {
      onChange?.('')
    }

    return (
      <div
        data-slot="search-bar"
        data-size={size}
        className={cn(searchBarVariants({ size }), className)}
      >
        {/* Leading search icon – purely decorative, not interactive */}
        <Search
          className={cn(
            'pointer-events-none absolute left-3 text-ulb-grey-400',
            iconSize
          )}
          strokeWidth={1.5}
          aria-hidden="true"
        />

        {/* The actual input field, based on the SCDH Input component */}
        <Input
          ref={ref}
          type="search"
          role="searchbox"
          aria-label={ariaLabel}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            // Padding to accommodate search icon (left) and clear button (right)
            isCompact
              ? 'h-8 pl-8 pr-8 text-md'
              : 'h-10 pl-10 pr-9 text-lg',
            // Hide the native browser clear button – we provide our own
            '[&::-webkit-search-cancel-button]:hidden',
            '[&::-webkit-search-decoration]:hidden'
          )}
          {...passthroughProps}
        />

        {/* Clear button – only rendered when the input has a value */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              'absolute right-2 rounded-full p-0.5',
              'text-ulb-grey-400 transition-colors',
              'hover:bg-ulb-grey-100 hover:text-ulb-grey-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-scdh-blue-700'
            )}
          >
            <X className={iconSize} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }
)

SearchBar.displayName = 'SearchBar'
