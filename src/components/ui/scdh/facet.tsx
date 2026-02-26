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
 * Single facet item data structure
 */
export interface FacetItem {
  /** Unique identifier for the facet item (same as value for InstantSearch compatibility) */
  id: string

  /** The facet value - used for filtering (InstantSearch uses this as the primary identifier) */
  value: string

  /** The facet term/label to display (e.g., "JavaScript", "TypeScript") */
  label: string

  /** Number of occurrences in search results */
  count: number

  /** Whether this item is currently selected/refined (InstantSearch uses 'isRefined') */
  isRefined?: boolean
}

/**
 * Props for the Facet component
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
   * Callback for individual item selection (InstantSearch.js compatible)
   * Called with the item value when an item is toggled.
   * Takes precedence over onSelectionChange if both are provided.
   *
   * @param value - The value of the toggled item
   *
   * @example
   * ```tsx
   * // InstantSearch usage
   * const { items, refine } = useRefinementList({ attribute: 'brand' })
   * <Facet items={items} onRefine={refine} />
   * ```
   */
  onRefine?: (value: string) => void

  /**
   * Callback when selection changes (for standalone usage)
   * Called with an array of all currently selected values.
   * Only used if onRefine is not provided.
   *
   * @param selectedValues - Array of selected item values
   *
   * @example
   * ```tsx
   * // Standalone usage
   * <Facet
   *   items={items}
   *   onSelectionChange={(values) => setSelected(values)}
   * />
   * ```
   */
  onSelectionChange?: (selectedValues: string[]) => void

  /**
   * Enable a search/filter input for long facet lists.
   * When true, a compact SearchBar is rendered above the items list.
   */
  searchable?: boolean

  /** Placeholder text for the search input (only used when searchable is true) */
  searchPlaceholder?: string

  /**
   * Optional callback when the search query changes.
   *
   * If provided, the Facet does NOT filter locally – the consumer is
   * responsible for providing already-filtered items (e.g. via InstantSearch's
   * searchForItems). This enables server-side facet search.
   *
   * If not provided, the Facet filters items locally by label (default).
   *
   * @param query - The current search input value
   *
   * @example
   * ```tsx
   * // Server-side filtering (InstantSearch)
   * const { items, searchForItems } = useRefinementList({ attribute: 'brand' })
   * <Facet searchable onSearchChange={searchForItems} items={items} />
   *
   * // Local filtering (default – no onSearchChange needed)
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
      <Label htmlFor={id} className="text-md cursor-pointer flex-none">
        {label}
      </Label>
    </Field>
    <Label className="text-md text-ulb-grey-800 cursor-pointer">{count}</Label>
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
          <Label className="text-lg text-ulb-grey-800 cursor-pointer">({itemsCount})</Label>
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
// Implementation
// ---------------------------------------------------------------------------

/**
 * SCDH Facet Component
 *
 * Displays a list of facet items with counts and optional search/selection.
 * Compatible with InstantSearch.js RefinementList.
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
      onRefine,
      searchable = false,
      searchPlaceholder = 'Filter...',
      onSearchChange,
      className
    },
    ref
  ) => {
    const facetId = React.useId()
    const [filterQuery, setFilterQuery] = React.useState('')

    // --- Logic: Filtering ---

    const handleSearchChange = React.useCallback(
      (query: string) => {
        setFilterQuery(query)
        onSearchChange?.(query)
      },
      [onSearchChange]
    )

    const displayItems = React.useMemo(() => {
      if (!searchable || !filterQuery.trim() || onSearchChange) return items

      const normalizedQuery = filterQuery.toLowerCase().trim()
      return items.filter(item => item.label.toLowerCase().includes(normalizedQuery))
    }, [items, filterQuery, searchable, onSearchChange])

    // --- Logic: Selection ---

    const handleSelectionUpdate = (itemValue: string, isChecked?: boolean) => {
      // Priority 1: InstantSearch style (refine single value)
      if (onRefine) {
        onRefine(itemValue)
        return
      }

      // Priority 2: Standalone style (emit array of all selected values)
      if (!onSelectionChange) return

      if (selectionMode === 'radio') {
        onSelectionChange([itemValue])
      } else {
        const currentRefined = items.filter(item => item.isRefined).map(item => item.value)
        const next = isChecked
          ? [...currentRefined, itemValue]
          : currentRefined.filter(v => v !== itemValue)
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
          const itemId = `${facetId}-${selectionMode}-${item.id}`

          if (selectionMode === 'checkbox') {
            return (
              <FacetRow
                key={item.id}
                id={itemId}
                label={item.label}
                count={item.count}
                control={
                  <Checkbox
                    id={itemId}
                    checked={item.isRefined}
                    onCheckedChange={checked => handleSelectionUpdate(item.value, !!checked)}
                  />
                }
              />
            )
          }

          if (selectionMode === 'radio') {
            return (
              <FacetRow
                key={item.id}
                id={itemId}
                label={item.label}
                count={item.count}
                control={
                  <RadioGroupItem
                    value={item.value}
                    id={itemId}
                    onClick={() => handleSelectionUpdate(item.value)}
                  />
                }
              />
            )
          }

          // Default: Simple listitem
          return (
            <div key={item.id} className="flex items-center justify-between gap-2 text-md">
              <span className="flex-1 font-medium">{item.label}</span>
              <Label className="text-md text-ulb-grey-800 cursor-pointer">{item.count}</Label>
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
            value={displayItems.find(i => i.isRefined)?.value}
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
            <AccordionContent className="px-4 pb-6 pt-5">{fullFacetContent}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    )
  }
)

Facet.displayName = 'Facet'
