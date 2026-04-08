import * as React from 'react'
import { cn } from '@/lib/utils'
import { Field, FieldGroup } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { SearchBar } from '@/components/ui/scdh/search-bar'
import { ChevronUp } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

/**
 * Represents a single item inside a Facet list.
 *
 * The only required fields are `value`, `label` and `count`.
 * `id` defaults to `value` when omitted.
 */
export interface FacetItem {
  /**
   * Optional unique identifier. Falls back to `value` when omitted.
   * Provide this only when the display value differs from the key.
   */
  id?: string

  /** The facet value – used as the primary identifier when toggling or filtering */
  value: string

  /** Human-readable label to display (e.g. "JavaScript", "TypeScript") */
  label: string

  /** Number of matching results for this facet value */
  count: number

  /** Whether this item is currently selected */
  isSelected?: boolean
}

/**
 * Props for the Facet component.
 *
 * The Facet supports two callback styles for selection changes:
 *
 * - **Instant mode (`onToggle`)** – fires once per click with the toggled value.
 *   Ideal when every selection should trigger an immediate action (e.g. a new
 *   search request).
 *
 * - **Deferred mode (`onSelectionChange`)** – fires with the full array of
 *   currently selected values. Useful when the consumer collects selections
 *   and applies them later (e.g. via an "Apply" button).
 *
 * If both callbacks are provided, `onToggle` takes precedence.
 */
export interface FacetProps {
  /** Array of facet items to display */
  items: FacetItem[]

  /** Optional title for the facet */
  title?: string

  /** Whether the facet should be collapsible (default: false) */
  collapsible?: boolean

  /** Whether the facet should be expanded by default when collapsible (default: true) */
  defaultExpanded?: boolean

  /** Selection mode: 'checkbox' for multiple selection, 'radio' for single selection, undefined for no selection */
  selectionMode?: 'checkbox' | 'radio'

  /**
   * Instant-mode callback – fired once per click with the toggled value.
   * Takes precedence over `onSelectionChange` if both are provided.
   *
   * @param value - The value of the toggled item
   *
   * @example
   * ```tsx
   * <Facet items={items} onToggle={(value) => toggleFilter(value)} />
   * ```
   */
  onToggle?: (value: string) => void

  /**
   * Deferred-mode callback – fired with the complete array of selected values.
   * Only used when `onToggle` is not provided.
   *
   * @param selectedValues - Array of currently selected item values
   *
   * @example
   * ```tsx
   * <Facet
   *   items={items}
   *   onSelectionChange={(values) => setPendingFilters(values)}
   * />
   * ```
   */
  onSelectionChange?: (selectedValues: string[]) => void

  /**
   * Enable a search/filter input above the item list.
   * When true, a compact SearchBar is rendered at the top.
   */
  searchable?: boolean

  /** Placeholder text for the search input (only used when `searchable` is true) */
  searchPlaceholder?: string

  /**
   * Optional callback for the filter input **inside the facet** (only relevant when `searchable` is true).
   *
   * This has nothing to do with the main full-text search – it only controls how the
   * list of facet items itself is filtered when the user types into the compact search
   * field at the top of the facet (e.g. searching for "Deutsch" within a 150-item
   * "Language" facet).
   *
   * **With `onSearchChange`** (server-side facet-item filtering):
   * The Facet does NOT filter locally. The consumer fetches matching facet items
   * from the server and passes them back via `items`. The Facet only forwards the query.
   *
   * **Without `onSearchChange`** (local facet-item filtering, default):
   * The Facet filters the `items` array client-side by matching labels against the query.
   * Suitable when all facet items are already loaded.
   *
   * @param query - The current value of the facet's internal filter input
   *
   * @example
   * ```tsx
   * // Server-side facet-item filtering (e.g. 150+ values, loaded on demand)
   * <Facet searchable onSearchChange={fetchFacetItems} items={serverFilteredItems} />
   *
   * // Local facet-item filtering (default – no onSearchChange needed)
   * <Facet searchable items={items} />
   * ```
   */
  onSearchChange?: (query: string) => void

  /** Optional CSS class for styling */
  className?: string
}

// ---------------------------------------------------------------------------
// Internal Sub-components
// ---------------------------------------------------------------------------

/**
 * Internal component to render a single facet row (label + count)
 */
interface FacetRowProps {
  id: string
  label: string
  count: number
  control?: React.ReactNode
}

const FacetRow = ({ id, label, count, control }: FacetRowProps) => (
  <div className="flex flex-row items-center justify-between">
    <Field orientation="horizontal" className="gap-2">
      {control}
      <Label htmlFor={id} className="cursor-pointer flex-none" size="medium">
        {label}
      </Label>
    </Field>
    <Label className="text-ulb-grey-800 cursor-pointer" size="medium">
      {count}
    </Label>
  </div>
)

/**
 * Header section of the facet card
 */
interface FacetHeaderProps {
  title: string
  itemsCount: number
  collapsible?: boolean
  onToggleLabel?: string
}

const FacetHeader = ({ title, itemsCount, collapsible, onToggleLabel }: FacetHeaderProps) => {
  const content = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-start gap-1">
        <h3 className="text-lg font-medium">{title}</h3>
        {!collapsible && (
          <Label className="text-ulb-grey-800 cursor-pointer" size="large">
            ({itemsCount})
          </Label>
        )}
      </div>
      {collapsible && (
        <AccordionPrimitive.Trigger
          aria-label={onToggleLabel}
          className="rounded-full transition-colors [&[data-state=open]>svg]:rotate-180"
        >
          <ChevronUp className="h-6 w-6 transition-transform duration-200" strokeWidth="1" />
        </AccordionPrimitive.Trigger>
      )}
    </div>
  )

  return (
    <>
      <div className="px-4 pt-4 pb-3">
        {collapsible ? (
          <AccordionPrimitive.Header className="flex">{content}</AccordionPrimitive.Header>
        ) : (
          content
        )}
      </div>
      <Separator className="w-full bg-ulb-grey-100" />
    </>
  )
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Encapsulates the filter logic for the search input inside the facet.
 *
 * Note: this is unrelated to the main full-text search. It only filters the
 * list of facet items when the user types into the compact filter field within
 * the facet itself (e.g. narrowing down a long list of languages or categories).
 *
 * Implements a strategy pattern for where the filtering happens:
 * - When `onSearchChange` is provided, the consumer fetches filtered items
 *   from the server and passes them back via `items` (server-side mode).
 *   The hook only forwards the query and skips local filtering.
 * - When `onSearchChange` is absent, the hook filters `items` locally by label.
 *
 * This keeps the filtering concern out of the Facet render body.
 */
function useFacetFilter(
  items: FacetItem[],
  searchable: boolean,
  onSearchChange?: (query: string) => void
) {
  const [filterQuery, setFilterQuery] = React.useState('')

  /** Update internal query state and optionally notify the consumer */
  const handleSearchChange = React.useCallback(
    (query: string) => {
      setFilterQuery(query)
      onSearchChange?.(query)
    },
    [onSearchChange]
  )

  /** Items to render – either the original list or locally filtered */
  const displayItems = React.useMemo(() => {
    // Skip filtering when disabled, query is empty, or consumer filters externally
    if (!searchable || !filterQuery.trim() || onSearchChange) return items

    const normalizedQuery = filterQuery.toLowerCase().trim()
    return items.filter(item => item.label.toLowerCase().includes(normalizedQuery))
  }, [items, filterQuery, searchable, onSearchChange])

  return { filterQuery, displayItems, handleSearchChange } as const
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * SCDH Facet Component
 *
 * Displays a list of facet items with counts and optional search/selection.
 * Supports two interaction styles:
 * - **Instant mode** (`onToggle`): each click immediately notifies the consumer
 * - **Deferred mode** (`onSelectionChange`): emits the full selection array
 */
export const Facet = React.forwardRef<HTMLDivElement, FacetProps>(
  (
    {
      items,
      title,
      collapsible = false,
      defaultExpanded = true,
      selectionMode,
      onSelectionChange,
      onToggle,
      searchable = false,
      searchPlaceholder = 'Filter...',
      onSearchChange,
      className
    },
    ref
  ) => {
    const facetId = React.useId()
    const { filterQuery, displayItems, handleSearchChange } = useFacetFilter(
      items,
      searchable,
      onSearchChange
    )

    // --- Logic: Selection ---

    /**
     * Handles item toggling for both instant and deferred mode.
     *
     * @param itemValue - The value of the toggled item
     * @param isChecked - Only relevant in checkbox mode: whether the checkbox was checked.
     *                    Ignored in radio mode (radio always selects).
     */
    const handleSelectionUpdate = (itemValue: string, isChecked?: boolean) => {
      // Instant mode – delegate single value to consumer
      if (onToggle) {
        onToggle(itemValue)
        return
      }

      // Deferred mode – emit full selection array
      if (!onSelectionChange) return

      if (selectionMode === 'radio') {
        onSelectionChange([itemValue])
      } else {
        const currentSelected = items.filter(item => item.isSelected).map(item => item.value)
        const next = isChecked
          ? [...currentSelected, itemValue]
          : currentSelected.filter(v => v !== itemValue)
        onSelectionChange(next)
      }
    }

    // --- Render: Content Parts ---

    const searchInput = searchable && (
      <div className="mb-3">
        <SearchBar
          size="compact"
          value={filterQuery}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          aria-label={`Filter ${title ?? 'items'}`}
        />
      </div>
    )

    const listContent = (
      <FieldGroup className="gap-3">
        {displayItems.map(item => {
          const itemKey = item.id ?? item.value
          const itemId = `${facetId}-${selectionMode}-${itemKey}`

          if (selectionMode === 'checkbox') {
            return (
              <FacetRow
                key={itemKey}
                id={itemId}
                label={item.label}
                count={item.count}
                control={
                  <Checkbox
                    id={itemId}
                    checked={item.isSelected}
                    onCheckedChange={checked => handleSelectionUpdate(item.value, !!checked)}
                  />
                }
              />
            )
          }

          if (selectionMode === 'radio') {
            return (
              <FacetRow
                key={itemKey}
                id={itemId}
                label={item.label}
                count={item.count}
                control={<RadioGroupItem value={item.value} id={itemId} />}
              />
            )
          }

          // Default: Read-only listitem (no selection control)
          return (
            <div key={itemKey} className="flex items-center justify-between gap-2 text-md">
              <span className="flex-1 font-medium">{item.label}</span>
              <Label className="text-ulb-grey-800 cursor-pointer" size="medium">
                {item.count}
              </Label>
            </div>
          )
        })}
      </FieldGroup>
    )

    const fullFacetContent = (
      <>
        {searchInput}
        {selectionMode === 'radio' ? (
          <RadioGroup
            value={displayItems.find(i => i.isSelected)?.value}
            onValueChange={val => handleSelectionUpdate(val)}
          >
            {listContent}
          </RadioGroup>
        ) : (
          listContent
        )}
      </>
    )

    // --- Render: Main Layout ---

    if (!collapsible) {
      return (
        <Card ref={ref} className={cn('shadow-none border-ulb-grey-200', className)}>
          {title && <FacetHeader title={title} itemsCount={items.length} />}
          <div className={cn('px-4', title ? 'pt-4 pb-5' : 'p-4')}>{fullFacetContent}</div>
        </Card>
      )
    }

    return (
      <Card ref={ref} className={cn('shadow-none border-ulb-grey-200', className)}>
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultExpanded ? 'facet-content' : undefined}
        >
          <AccordionItem value="facet-content" className="border-0">
            {title && (
              <FacetHeader
                title={title}
                itemsCount={items.length}
                collapsible
                onToggleLabel={`Toggle ${title} facet`}
              />
            )}
            <AccordionContent className="px-4 pb-5 pt-4">{fullFacetContent}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    )
  }
)

Facet.displayName = 'Facet'
