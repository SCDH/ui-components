import * as React from 'react'
import { cn } from '@/lib/utils'
import { FieldGroup } from '@/components/ui/field'

/**
 * Single facet item data structure
 * Represents a term with its occurrence count
 */
export interface FacetItem {
  /** Unique identifier for the facet item */
  id: string
  
  /** The facet term/label (e.g., "JavaScript", "TypeScript") */
  label: string
  
  /** Number of occurrences in search results */
  count: number
}

/**
 * Props for the Facet component
 */
export interface FacetProps {
  /** Array of facet items to display */
  items: FacetItem[]
  
  /** Optional CSS class for styling */
  className?: string
}

/**
 * SCDH Facet Component - Simple List Version (Step 1)
 * 
 * Displays a list of facet items with their counts.
 * This is the foundation for a search facet component commonly used
 * in search interfaces to show term frequencies.
 * 
 * @example
 * ```tsx
 * <Facet 
 *   items={[
 *     { id: '1', label: 'JavaScript', count: 42 },
 *     { id: '2', label: 'TypeScript', count: 15 }
 *   ]}
 * />
 * ```
 */
export const Facet = React.forwardRef<HTMLDivElement, FacetProps>(
  ({ items, className }, ref) => {
    return (
      <FieldGroup ref={ref} className={cn('gap-3', className)}>
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
  }
)

Facet.displayName = 'Facet'
