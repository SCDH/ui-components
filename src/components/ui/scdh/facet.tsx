import * as React from 'react'
import { cn } from '@/lib/utils'
import { Field, FieldGroup } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

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
  
  /** Optional CSS class for styling */
  className?: string
}

/**
 * SCDH Facet Component
 * 
 * Displays a list of facet items with their counts.
 * This component is designed to be compatible with InstantSearch.js RefinementList,
 * allowing seamless integration with search interfaces.
 * 
 * @example
 * ```tsx
 * // Standalone usage
 * <Facet 
 *   title="Programming Languages"
 *   collapsible
 *   defaultExpanded
 *   selectionMode="checkbox"
 *   onSelectionChange={(values) => console.log(values)}
 *   items={[
 *     { id: '1', value: 'js', label: 'JavaScript', count: 42, isRefined: true },
 *     { id: '2', value: 'ts', label: 'TypeScript', count: 15, isRefined: false }
 *   ]}
 * />
 * 
 * // InstantSearch.js compatible usage
 * <Facet 
 *   title="Categories"
 *   selectionMode="checkbox"
 *   onRefine={(value) => refine(value)}
 *   items={refinementListItems}
 * />
 * ```
 */
export const Facet = React.forwardRef<HTMLDivElement, FacetProps>(
  ({ items, title, collapsible = false, defaultExpanded = true, selectionMode, onSelectionChange, onRefine, className }, ref) => {
    
    // Handle checkbox toggle
    const handleCheckboxChange = (itemValue: string, checked: boolean) => {
      // Call InstantSearch-compatible onRefine if provided
      if (onRefine) {
        onRefine(itemValue)
        return
      }
      
      // Fallback to onSelectionChange
      if (!onSelectionChange) return
      
      const currentSelected = items.filter(item => item.isRefined).map(item => item.value)
      const newSelected = checked
        ? [...currentSelected, itemValue]
        : currentSelected.filter(val => val !== itemValue)
      
      onSelectionChange(newSelected)
    }
    
    // Handle radio selection
    const handleRadioChange = (itemValue: string) => {
      // Call InstantSearch-compatible onRefine if provided
      if (onRefine) {
        onRefine(itemValue)
        return
      }
      
      // Fallback to onSelectionChange
      if (!onSelectionChange) return
      onSelectionChange([itemValue])
    }
    
    // Content that will be shown (either wrapped in accordion or not)
    const facetContent = (() => {
      // Radio button mode - single selection
      if (selectionMode === 'radio') {
        const selectedValue = items.find(item => item.isRefined)?.value
        
        return (
          <RadioGroup value={selectedValue} onValueChange={handleRadioChange}>
            <FieldGroup className="gap-3">
              {items.map((item) => (
                <Field key={item.id} orientation="horizontal" className="flex-row items-center gap-2">
                  <RadioGroupItem value={item.value} id={`facet-radio-${item.id}`} />
                  <Label 
                    htmlFor={`facet-radio-${item.id}`} 
                    className="flex-1 flex items-center justify-between gap-4 text-sm font-medium cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">({item.count})</span>
                  </Label>
                </Field>
              ))}
            </FieldGroup>
          </RadioGroup>
        )
      }
      
      // Checkbox mode - multiple selection
      if (selectionMode === 'checkbox') {
        return (
          <FieldGroup className="gap-3">
            {items.map((item) => (
              <Field key={item.id} orientation="horizontal" className="flex-row items-center gap-2">
                <Checkbox 
                  id={`facet-checkbox-${item.id}`}
                  checked={item.isRefined}
                  onCheckedChange={(checked) => handleCheckboxChange(item.value, checked as boolean)}
                />
                <Label 
                  htmlFor={`facet-checkbox-${item.id}`}
                  className="flex-1 flex items-center justify-between gap-4 text-sm font-medium cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span className="text-muted-foreground">({item.count})</span>
                </Label>
              </Field>
            ))}
          </FieldGroup>
        )
      }
      
      // No selection mode - simple list
      return (
        <FieldGroup className="gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 text-sm"
            >
              {/* Term/Label */}
              <span className="flex-1 font-medium text-foreground">
                {item.label}
              </span>
              
              {/* Count */}
              <span className="text-muted-foreground">
                ({item.count})
              </span>
            </div>
          ))}
        </FieldGroup>
      )
    })()

    // If not collapsible, render simple version
    if (!collapsible) {
      return (
        <div ref={ref} className={cn('flex flex-col', className)}>
          {/* Title with item count */}
          {title && (
            <>
              <h3 className="text-base font-semibold text-foreground mb-3">
                {title}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({items.length})
                </span>
              </h3>
              <Separator className="mb-4" />
            </>
          )}
          
          {/* Facet items list */}
          {facetContent}
        </div>
      )
    }

    // Collapsible version with accordion
    return (
      <div ref={ref} className={cn('flex flex-col', className)}>
        <Accordion type="single" collapsible defaultValue={defaultExpanded ? 'facet-content' : undefined}>
          <AccordionItem value="facet-content" className="border-0">
            {/* Accordion Trigger with Title */}
            {title && (
              <AccordionTrigger className="py-0 pb-3 hover:no-underline font-semibold text-base">
                <span>
                  {title}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({items.length})
                  </span>
                </span>
              </AccordionTrigger>
            )}
            
            {/* Separator */}
            {title && <Separator className="mb-4" />}
            
            {/* Accordion Content */}
            <AccordionContent className="pb-0">
              {facetContent}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }
)

Facet.displayName = 'Facet'
